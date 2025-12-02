import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { solicitud_id, cliente_id, personal_id, calificacion, comentario } = await req.json();

        if (!solicitud_id || !cliente_id || !personal_id || !calificacion) {
            return NextResponse.json(
                { error: "Faltan datos requeridos" },
                { status: 400 }
            );
        }

        // Verificar si ya existe una calificación para esta solicitud
        const existe = await pool.query(
            "SELECT id FROM calificaciones WHERE solicitud_id = $1",
            [solicitud_id]
        );

        if (existe.rows.length > 0) {
            return NextResponse.json(
                { error: "Ya has calificado este servicio" },
                { status: 400 }
            );
        }

        const result = await pool.query(
            `INSERT INTO calificaciones (solicitud_id, cliente_id, personal_id, calificacion, comentario)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [solicitud_id, cliente_id, personal_id, calificacion, comentario]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (err) {
        console.error("Error al guardar calificación:", err);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const personal_id = searchParams.get("personal_id");

    if (!personal_id) {
        return NextResponse.json({ error: "ID de personal requerido" }, { status: 400 });
    }

    try {
        const result = await pool.query(
            `SELECT c.*, u.nombre as cliente_nombre, u.apellido as cliente_apellido
       FROM calificaciones c
       JOIN usuarios u ON c.cliente_id = u.id
       WHERE c.personal_id = $1
       ORDER BY c.fecha DESC
       LIMIT 5`,
            [personal_id]
        );

        return NextResponse.json(result.rows);
    } catch (err) {
        console.error("Error al obtener calificaciones:", err);
        return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
    }
}
