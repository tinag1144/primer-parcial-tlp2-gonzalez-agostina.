import { body } from "express-validator";
import { UserModel } from "../../models/mongoose/user.model.js";

export const createAssetValidation = [
  // TODO: completar las validaciones para crear un recurso

  body("description")
    .isLength({ min: 10, max: 500 }).withMessage("La descripción debe tener entre 10 y 500 caracteres"),

  body("brand")
    .isLength({ min: 2, max: 100 }).withMessage("La marca debe tener entre 2 y 100 caracteres"),

  body("model")
    .isLength({ min: 2, max: 100 }).withMessage("El modelo debe tener entre 2 y 100 caracteres"),

  body("status")
    .isIn(["good", "regular", "bad", "out_of_service"]).withMessage("Estado inválido"),

  body("acquisition_date")
    .isISO8601().withMessage("La fecha de adquisición debe ser válida")
    .custom((value) => {
      if (new Date(value) > new Date()) throw new Error("La fecha de adquisición no puede ser futura");
      return true;
    }),

  body("acquisition_value")
    .isFloat({ gt: 0 }).withMessage("El valor de adquisición debe ser un número positivo"),

  body("responsible_id")
    .custom(async (value) => {
      const user = await UserModel.findById(value);
      if (!user) throw new Error("El responsable no existe");
      if (user.deletedAt) throw new Error("El responsable no está activo");
      return true;
    }),

  body("categories")
    .isArray().withMessage("Las categorías deben ser un array de IDs")
];


