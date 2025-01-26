import { appDataSource } from "../config/database";
import { ProductCart } from "../entities/cart";

const cartDataSource = appDataSource.getRepository(ProductCart);

export const addToCart = async (req: any, res: any) => {
  const { quantity, userId, productId } = req.body;
  try {
    const ifProductExist = await cartDataSource
      .createQueryBuilder("product_cart")
      .where(
        "product_cart.productid = :productId AND product_cart.userid = :userId",
        { productId, userId }
      )
      .getOne();

    if (ifProductExist) {
      ifProductExist.quantity += quantity;
      await cartDataSource
        .createQueryBuilder()
        .update("product_cart")
        .set({
          quantity: ifProductExist.quantity,
        })
        .where(
          "product_cart.productid = :productId AND product_cart.userid = :userId",
          { productId, userId }
        )
        .execute();
      res
        .status(200)
        .json({ message: "Product quantity update successfully." });
    } else {
      await cartDataSource
        .createQueryBuilder()
        .insert()
        .values({
          quantity,
          userid: userId,
          productid: productId,
        })
        .execute();
      res.status(200).json({ message: "product is added in Cart" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getItemsFromCart = async (req: any, res: any) => {
  const { userId } = req.body;
  try {
    const queryBuilder = cartDataSource.createQueryBuilder("product_cart");
    if (userId) {
      queryBuilder
        .leftJoinAndSelect("product_cart.productid", "product")
        .where("product_cart.userid = :userId", { userId });
    } else {
      queryBuilder
        .leftJoinAndSelect("product_cart.userid", "user")
        .leftJoinAndSelect("product_cart.productid", "product");
    }
    const result = await queryBuilder.getMany();
    res.status(200).json({ "All Product": result });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
};

export const removeFormCart = async (req: any, res: any) => {
  const { productId } = req.body;
  try {
    const result = await cartDataSource
      .createQueryBuilder("product_cart")
      .delete()
      .where("product_cart.productid = :productId", { productId })
      .execute();
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
};
