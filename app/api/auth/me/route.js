import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const email = authHeader.replace("Bearer ", "");

        const result = await pool.query(
            "SELECT id, nombre, apellido, email, rol, verificado FROM usuarios WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(result.rows[0], { status: 200 });
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
    }
}
