import { comparePassword, hashPassword } from "../helpers/bcrypt.helper.js";
import { signToken } from "../helpers/jwt.helper.js";
import { UserModel } from "../models/mongoose/user.model.js";


export const register = async (req, res) => {
  try {
    // TODO: crear usuario con password hasheada y profile embebido
     const { username, email, password, role, profile } = req.body;

     const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ msg: "El usuario o el email ya están en uso" });
    }
        const hashedPassword = await hashPassword(password);

        const newRegister = await UserModel.create({
            username: username,  
            email: email, 
            password: hashedPassword,
            role: role,  
            profile: profile
        });

    return res.status(201).json({ msg: "Usuario registrado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  try {
    // TODO: buscar user, validar password, firmar JWT y setear cookie httpOnly

      const { username, password} = req.body;
        const user = await UserModel.findOne( { $or: [{username}] } );
        const hashPass = await comparePassword(password, user.password);

        if (!user || !hashPass) {   
            return res.status(401).json({ 
                ok: false,
                msg: "Credenciales invalidas"
            });
        }
        const token = signToken( {
            id: user.id,
            username: user.username,
            role: user.role
        });

        res.cookie("token", token, {
            httpOnly: true, 
            maxAge: 60 * 60 * 100
        });

    return res.status(200).json({ msg: "Usuario logueado correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getProfile = async (req, res) => {
  try {
    // TODO: devolver profile del user logueado actualmente
    const userId = req.user.id;
    const profile = await UserModel.findById(userId).select( "profile" )

    if (!profile) {
      return res.status(404).json({
        ok: false,
        msg: "Perfil no encontrado"
      });
    }; 

    return res.status(200).json({ data: profile });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const logout = async (_req, res) => {
  res.clearCookie("token");
  return res.status(204).json({ msg: "Sesión cerrada correctamente" });
};
