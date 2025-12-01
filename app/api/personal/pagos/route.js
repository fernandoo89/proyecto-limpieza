import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const personal_id = searchParams.get("personal_id");

        if (!personal_id) {
            return NextResponse.json(
                { error: "ID de personal requerido" },
                { status: 400 }
            );
        }

        const query = `
      SELECT 
        p.id,
        p.monto,
        p.fecha_pago,
        p.estado,
        p.tarjeta_destino,
        s.tipo_limpieza,
        u.nombre as cliente_nombre,
        u.apellido as cliente_apellido
      FROM pagos_personal p
      JOIN solicitudes s ON p.solicitud_id = s.id
      JOIN usuarios u ON s.usuario_id = u.id
      WHERE p.personal_id = $1
      ORDER BY p.fecha_pago DESC
    `;

        const result = await pool.query(query, [personal_id]);

        return NextResponse.json(result.rows);
    } catch (err) {
        console.error("Error obteniendo pagos:", err);
        return NextResponse.json(
            { error: "Error al obtener pagos" },
            { status: 500 }
        );
    }
}
