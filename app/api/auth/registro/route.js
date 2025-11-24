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
    const {
      nombre,
      apellido,
      tipo_documento,
      numero_documento,
      email,
      telefono,
      password,
      fecha_nacimiento,
      rol,
      foto_url,
      anios_experiencia,
      zona_cobertura,
    } = await req.json();

    // Validar campos requeridos básicos
    if (!nombre || !apellido || !email || !password || !telefono) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Validar rol
    const rolFinal = rol === "personal" ? "personal" : "cliente";

    // Validaciones específicas para personal
    if (rolFinal === "personal") {
      if (!foto_url) {
        return NextResponse.json({ error: "La foto es obligatoria para el personal" }, { status: 400 });
      }
    }

    // Foto por defecto para cliente si no se envía
    const fotoFinal = foto_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(nombre + " " + apellido);

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

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const result = await pool.query(
      `INSERT INTO usuarios
        (nombre, apellido, tipo_documento, numero_documento, email, telefono, password, rol, verificado, fecha_nacimiento, foto_url, anios_experiencia, zona_cobertura)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        RETURNING id, nombre, apellido, email, rol, verificado;`,
      [
        nombre,
        apellido,
        tipo_documento,
        numero_documento,
        email,
        telefono,
        hashedPassword,
        rolFinal,
        true, // Verificado por defecto para simplificar (o false si se requiere aprobación)
        fecha_nacimiento,
        fotoFinal,
        rolFinal === "personal" ? anios_experiencia : null,
        rolFinal === "personal" ? zona_cobertura : null,
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
