import { body } from "express-validator";
import { UserModel } from "../../models/mongoose/user.model.js";

export const createUserValidation = [
  // TODO: completar las validaciones para crear un usuario
    body("username")
        .notEmpty().withMessage("El nombre de usuario es obligatorio")
        .isLength({ min: 3, max: 20 }).withMessage("El nombre de usuario debe tener entre 3 y 20 caracteres")
        .custom(async (value) => {
            const user = await UserModel.findOne({ where: { username: value } });
            if (user) {
                throw new Error("El nombre de usuario ya está en uso");
                
            } 
        }),

    body("email")
        .notEmpty().withMessage("El correo electrónico es obligatorio")
        .isEmail().withMessage("El correo electrónico no es válido")
        .custom(async (value) => {
            const user = await UserModel.findOne({ where: { email: value } });      
            if (user) {
                throw new Error("El correo electrónico ya está en uso");
            }
        }),

    body("password")    
        .notEmpty().withMessage("La contraseña es obligatoria")
        .isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres")
        .matches(/[A-Z]/).withMessage("Debe contener al menos una letra mayúscula")
        .matches(/[a-z]/).withMessage("Debe contener al menos una letra minúscula")
        .matches(/\d/).withMessage("Debe contener al menos un número"),

    body("role")
        .notEmpty().withMessage("El rol es obligatorio")
        .isIn(["secretary", "administrator"]).withMessage("El rol debe ser 'user' o 'admin'"),
];




