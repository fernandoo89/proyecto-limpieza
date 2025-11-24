import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "limpieza-db",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

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
      "SELECT id, nombre, apellido, email, rol FROM usuarios WHERE email = $1",
      [email]
    );
    if (userRes.rows.length === 0) {
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 400 }
      );
    }
    const user = userRes.rows[0];
    
    // Obtener password hasheada para validar
    const userWithPassword = await pool.query(
      "SELECT password FROM usuarios WHERE email = $1",
      [email]
    );
    const validPass = await bcrypt.compare(password, userWithPassword.rows[0].password);

    if (!validPass) {
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 400 }
      );
    }

    // Retorna datos del usuario sin JWT por ahora
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
