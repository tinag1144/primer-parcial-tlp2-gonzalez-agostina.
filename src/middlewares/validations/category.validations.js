import { body } from "express-validator";
import { CategoryModel } from "../../models/mongoose/category.model.js";

export const createCategoryValidation = [
  // TODO: completar las validaciones para crear una categoria
   body("name")
    .isLength({ min: 3, max: 100 }).withMessage("El nombre debe tener entre 3 y 100 caracteres")
    .custom(async (value) => {
      const exists = await CategoryModel.findOne({ name: value });
      if (exists) throw new Error("El nombre de la categoría ya existe");
      return true;
    }),
  body("description")
    .optional()
    .isLength({ max: 500 }).withMessage("La descripción no puede superar los 500 caracteres")
];
