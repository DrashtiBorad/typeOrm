import { appDataSource } from "../config/database";
import { Categories } from "../entities/categories";

const categoriesDataSource = appDataSource.getRepository(Categories);

export const addProductCategories = async (req: any, res: any) => {
  const { categoriesName } = req.body;
  console.log("categoriesNamecategoriesName", categoriesName);

  const findCategories = await categoriesDataSource
    .createQueryBuilder("categories")
    .where("categories.categoriesName = :categoriesName", { categoriesName })
    .getOne();

  if (!findCategories) {
    await categoriesDataSource
      .createQueryBuilder()
      .insert()
      .values({
        categories_name: categoriesName,
      })
      .execute();

    res.status(200).json({ message: "Category add successfully" });
  } else {
    res.status(400).json({ message: "This category is already added." });
  }
};

export const getProductCategories = async (req: any, res: any) => {
  try {
    const result = await categoriesDataSource
      .createQueryBuilder("categories")
      .delete()
      .execute();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
