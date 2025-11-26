import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { id, estado, personal_id } = await req.json();

        if (!id || !estado) {
            return NextResponse.json(
                { error: "Faltan campos requeridos" },
                { status: 400 }
            );
        }

        if (!["confirmado", "rechazado"].includes(estado)) {
            return NextResponse.json(
                { error: "Estado inválido" },
                { status: 400 }
            );
        }

        let query = `UPDATE solicitudes SET estado = $1 WHERE id = $2 RETURNING *`;
        let values = [estado, id];

        if (estado === "confirmado" && personal_id) {
            query = `UPDATE solicitudes SET estado = $1, personal_id = $3 WHERE id = $2 RETURNING *`;
            values = [estado, id, personal_id];
        }

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return NextResponse.json(
                { error: "Solicitud no encontrada" },
                { status: 404 }
            );
        }

        return NextResponse.json(result.rows[0], { status: 200 });
    } catch (err) {
        console.error("Error actualizando estado:", err);
        return NextResponse.json(
            { error: "Error al actualizar estado" },
            { status: 500 }
        );
    }
}
