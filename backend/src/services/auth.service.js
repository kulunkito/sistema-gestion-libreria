
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Role } from "../models/index.js";

export async function login(email, password) {
  const user = await User.scope("withPassword").findOne({
    where: { email },
    include: [{ model: Role, as: "role" }]
  });

  if (!user || !user.isActive) {
    throw Object.assign(new Error("Credenciales inválidas"), { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    throw Object.assign(new Error("Credenciales inválidas"), { status: 401 });
  }

  const token = jwt.sign(
    { sub: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name
    }
  };
}
