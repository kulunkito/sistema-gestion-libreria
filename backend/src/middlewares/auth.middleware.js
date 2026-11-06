
import jwt from "jsonwebtoken";
import { User, Role } from "../models/index.js";

export async function authenticate(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token no proporcionado"
      });
    }

    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(payload.sub, {
      include: [{ model: Role, as: "role" }]
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autorizado"
      });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Token inválido o expirado"
    });
  }
}
