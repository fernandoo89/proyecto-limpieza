import { Pool } from "pg";
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
      usuario_id,
      direccion,
      tipo_limpieza,
      fecha,
      hora,
      notas,
      personal_id,
      monto,
      metodo_pago  // Nuevo campo (opcional, pero recomendable)
    } = await req.json();

    if (
      !usuario_id ||
      !direccion ||
      !tipo_limpieza ||
      !fecha ||
      !hora ||
      !personal_id ||
      !monto
    ) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO solicitudes
        (usuario_id, direccion, tipo_limpieza, fecha, hora, notas, estado, created_at, personal_id, monto, metodo_pago)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8, $9, $10)
        RETURNING id, usuario_id, direccion, tipo_limpieza, fecha, hora, estado, personal_id, monto, metodo_pago;`,
      [
        usuario_id,
        direccion,
        tipo_limpieza,
        fecha,
        hora,
        notas || "",
        "pagada",         // Estado "pagada" por MVP de simulación (puedes cambiar por "pendiente" si prefieres otro flujo)
        personal_id,
        monto,
        metodo_pago || null,
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error("Error en crear solicitud:", err);
    return NextResponse.json(
      { error: "Error al crear solicitud: " + err.message },
      { status: 500 }
    );
  }
}
