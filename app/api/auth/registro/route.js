import pool from "@/lib/db";
import { NextResponse } from "next/server";

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
      metodo_pago
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
        "pagada",
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
