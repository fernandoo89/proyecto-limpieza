import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
        return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM tarjetas_bancarias WHERE usuario_id = $1",
            [userId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Tarjeta no encontrada" }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error al obtener tarjeta:", error);
        return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
    }
}
