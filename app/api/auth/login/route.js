import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña requeridos" },
        { status: 400 }
      );
    }

    const userRes = await pool.query(
      "SELECT id, nombre, apellido, email, rol, password FROM usuarios WHERE email = $1",
      [email]
    );
    if (userRes.rows.length === 0) {
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 400 }
      );
    }
    const user = userRes.rows[0];
    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass) {
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 400 }
      );
    }

    // Retorna datos del usuario sin password
    return NextResponse.json({
      id: user.id,
      rol: user.rol,
      nombre: user.nombre,
      email: user.email,
    });
  } catch (err) {
    console.error("Error en login:", err);
    return NextResponse.json(
      { error: "Error al iniciar sesión: " + err.message },
      { status: 500 }
    );
  }
}
