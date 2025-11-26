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
      "SELECT id, nombre, apellido, email, rol, password, telefono, tipo_documento, numero_documento, zona_cobertura, anios_experiencia, verificado, estado_verificacion, email_verified FROM usuarios WHERE email = $1",
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

    // Verificar si el correo ha sido confirmado
    if (!user.email_verified) {
      return NextResponse.json(
        { error: "Por favor confirma tu correo electrónico antes de iniciar sesión." },
        { status: 403 }
      );
    }

    // Verificar si el personal está aprobado
    if (user.rol === "personal" && user.estado_verificacion !== "aprobado") {
      let mensaje = "Tu cuenta está pendiente de aprobación por un administrador.";
      if (user.estado_verificacion === "rechazado") {
        mensaje = "Tu cuenta ha sido rechazada. Contacta al administrador para más información.";
      }
      return NextResponse.json(
        { error: mensaje },
        { status: 403 }
      );
    }

    // Retorna datos del usuario sin password
    return NextResponse.json({
      id: user.id,
      rol: user.rol,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono,
      tipo_documento: user.tipo_documento,
      numero_documento: user.numero_documento,
      zona_cobertura: user.zona_cobertura,
      anios_experiencia: user.anios_experiencia,
    });
  } catch (err) {
    console.error("Error en login:", err);
    return NextResponse.json(
      { error: "Error al iniciar sesión: " + err.message },
      { status: 500 }
    );
  }
}
