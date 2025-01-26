import { S3 } from "@aws-sdk/client-s3";
import { appDataSource } from "../config/database";
import { Product } from "../entities/products";
import { IncomingForm } from "formidable";
import fs from "fs";

const productDataSource = appDataSource.getRepository(Product);

export const client = new S3({
  region: "ap-south-1",
  credentials: {
    accessKeyId: `${process.env.AWS_ACCESSKEY_ID}`,
    secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
  },
});

export const addProducts = async (req: any, res: any) => {
  const form = new IncomingForm({
    multiples: false,
    keepExtensions: true,
  });

  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      return res.status(400).json({ error: "File upload failed" });
    }

    const file = files.image;
    if (!file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const fileStream = fs.createReadStream(
      file.map((list: any) => list.filepath)[0]
    );

    const uniqueKey = `${Date.now()}-${file.map(
      (list: any) => list.originalFilename
    )}`;

    try {
      await client.putObject({
        Bucket: process.env.BUCKET_NAME,
        Key: uniqueKey,
        Body: fileStream,
        ContentType: `${file.map((list: any) => list.mimetype)[0]}`,
      });

      const fileUrl = `https://${process.env.BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${uniqueKey}`;
      console.log("fileUrlfileUrl", fileUrl);

      const {
        name,
        description,
        price,
        is_featured_product,
        is_top_categories,
        our_productType_categoriesId,
      } = fields;
      console.log("fieldsfields", fields);

      await productDataSource
        .createQueryBuilder()
        .insert()
        .into("product")
        .values({
          name: name[0],
          description: description[0],
          price: Number(price),
          is_featured_product: is_featured_product[0] === "true",
          is_top_categories: is_top_categories[0] === "true",
          our_productType_categoriesId:
            Number(our_productType_categoriesId) || null,
          image: fileUrl,
        })
        .execute();

      res.status(200).json({
        message: "Product added successfully",
        fileUrl,
      });
    } catch (uploadErr) {
      res
        .status(500)
        .json({ error: "Failed to upload to S3 or save product data" });
    }
  });
};

export const getProducts = async (req: any, res: any) => {
  const {
    is_featured_product,
    is_top_categories,
    our_productType_categoriesId,
  } = req.body;
  console.log("req.queryreq.query", req.body);
  try {
    const queryBuilder = productDataSource.createQueryBuilder("product");

    if (is_featured_product && is_top_categories) {
      queryBuilder.where(
        "product.is_featured_product = :is_featured_product AND product.is_top_categories = :is_top_categories",
        {
          is_featured_product: is_featured_product,
          is_top_categories: is_top_categories,
        }
      );
    } else if (is_featured_product) {
      queryBuilder.where("product.is_featured_product = :is_featured_product", {
        is_featured_product: is_featured_product,
      });
    } else if (is_top_categories) {
      queryBuilder.where("product.is_top_categories = :is_top_categories", {
        is_top_categories: is_top_categories,
      });
    } else if (our_productType_categoriesId) {
      queryBuilder.where(
        "product.our_productType_categoriesId = :our_productType_categoriesId",
        {
          our_productType_categoriesId: our_productType_categoriesId,
        }
      );
    }

    const result = await queryBuilder.getRawMany();
    res.status(200).json({ "All Products": result });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const deleteProducts = async (req: any, res: any) => {
  const { id } = req.body;
  try {
    await productDataSource
      .createQueryBuilder("product")
      .delete()
      .where("product.id = :id", { id })
      .execute();

    res.status(200).json("Product Deleted Successfully.");
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const updateProducts = async (req: any, res: any) => {
  const { id, ...otherValues } = req.body;
  console.log("otherValues", otherValues);
  try {
    const result = await productDataSource
      .createQueryBuilder("product")
      .update()
      .set(otherValues)
      .where("product.id = :id", { id })
      .execute();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json("");
  }
};
