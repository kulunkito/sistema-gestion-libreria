
import * as authService from "../services/auth.service.js";

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);

    res.json({
      success: true,
      data,
      message: "Sesión iniciada correctamente"
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  res.json({
    success: true,
    data: { user: req.user }
  });
}
