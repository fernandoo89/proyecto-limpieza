import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      nombre,
      apellido,
      tipo_documento,
      numero_documento,
      email,
      telefono,
      password,
      fecha_nacimiento,
    } = await req.json();

    if (!nombre || !apellido || !email || !password || !telefono) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Verificar que no exista el correo
    const existe = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    );
    if (existe.rows.length > 0) {
      return NextResponse.json(
        { error: "El correo ya está registrado" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO usuarios
        (nombre, apellido, tipo_documento, numero_documento, email, telefono, password, rol, verificado, fecha_nacimiento)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING id, nombre, apellido, email, rol, verificado;`,
      [
        nombre,
        apellido,
        tipo_documento,
        numero_documento,
        email,
        telefono,
        hashedPassword,
        "cliente",
        false,
        fecha_nacimiento,
      ]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error("Error en registro:", err);
    return NextResponse.json(
      { error: "Error al registrar usuario: " + err.message },
      { status: 500 }
    );
  }
}
