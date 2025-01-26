import { DataSource } from "typeorm";
import { appDataSource } from "../config/database";
import { Favourite } from "../entities/favourite";

const faviouriteDataSource = appDataSource.getRepository(Favourite);

export const addToFaviourite = async (req: any, res: any) => {
  const { productId, userId } = req.body;
  try {
    const faviouriteQueryBuilder =
      faviouriteDataSource.createQueryBuilder("favourite");

    const isItemIsAddedInFaviourite = await faviouriteQueryBuilder
      .where("favourite.productid = :productId", { productId })
      .getOne();
    if (!isItemIsAddedInFaviourite) {
      await faviouriteQueryBuilder
        .insert()
        .values({
          productid: productId,
          userid: userId,
        })
        .execute();
      res.status(200).json({ message: "Item is added in faviourite" });
    } else {
      res.status(400).json({ message: "Item is already added in faviourite" });
    }
  } catch (err) {
    res.status(200).json({ Error: err });
  }
};

export const getFaviouriteItems = async (req: any, res: any) => {
  const { userId } = req.body;
  try {
    const faviouriteQueryBuilder =
      faviouriteDataSource.createQueryBuilder("favourite");
    if (userId) {
      faviouriteQueryBuilder.where("favourite.userid = :userId", {
        userId,
      });
    } else {
      faviouriteQueryBuilder
        .leftJoinAndSelect("favourite.userid", "user")
        .leftJoinAndSelect("favourite.productid", "product");
    }
    const result = await faviouriteQueryBuilder.getMany();
    res.status(200).json({ "All Favourite ": result });
  } catch (err) {
    res.status(200).json({ Error: err });
  }
};

export const removeFaviouriteItems = async (req: any, res: any) => {
  const { productId } = req.body;
  try {
    const result = await faviouriteDataSource
      .createQueryBuilder("favourite")
      .delete()
      .from("favourite")
      .where("favourite.productid = :productId", { productId })
      .execute();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
};
