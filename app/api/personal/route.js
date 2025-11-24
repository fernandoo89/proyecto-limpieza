import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// POST: Registrar personal
export async function POST(request) {
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
      foto_url,
      anios_experiencia,
      zona_cobertura
    } = await request.json();

    const existe = await pool.query("SELECT id FROM usuarios WHERE email = $1", [email]);
    if (existe.rows.length > 0) {
      return new Response(JSON.stringify({ error: "El correo ya está registrado" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (
        nombre, apellido, tipo_documento, numero_documento, email, telefono, password, rol, verificado, fecha_nacimiento, foto_url, anios_experiencia, zona_cobertura
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id, nombre, apellido, email, rol, verificado, foto_url, anios_experiencia, zona_cobertura;`,
      [
        nombre,
        apellido,
        tipo_documento,
        numero_documento,
        email,
        telefono,
        hashedPassword,
        "personal",
        true,
        fecha_nacimiento,
        foto_url || null,
        anios_experiencia || null,
        zona_cobertura || null
      ]
    );

    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (err) {
    console.error("Error al registrar personal:", err);
    return new Response(JSON.stringify({ error: "Error al registrar personal" }), { status: 500 });
  }
}

// GET: Listar personal para mostrarlo en la web (ej. sección "Nosotros")
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, nombre, apellido, foto_url, anios_experiencia, zona_cobertura
       FROM usuarios
       WHERE rol = 'personal'`
    );
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (err) {
    console.error("Error al listar personal:", err);
    return new Response(JSON.stringify({ error: "Error al listar personal" }), { status: 500 });
  }
}
