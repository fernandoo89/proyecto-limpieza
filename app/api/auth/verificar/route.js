import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.json(
            { error: "Token de verificación no proporcionado" },
            { status: 400 }
        );
    }

    try {
        // Buscar usuario con el token y verificar expiración
        const result = await pool.query(
            `SELECT id, email, token_expiry FROM usuarios WHERE verification_token = $1`,
            [token]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: "Token inválido o no encontrado" },
                { status: 400 }
            );
        }

        const user = result.rows[0];
        const now = new Date();

        if (new Date(user.token_expiry) < now) {
            return NextResponse.json(
                { error: "El token ha expirado" },
                { status: 400 }
            );
        }

        // Actualizar usuario: email_verified = true, borrar token
        await pool.query(
            `UPDATE usuarios SET email_verified = true, verification_token = NULL, token_expiry = NULL WHERE id = $1`,
            [user.id]
        );

        return NextResponse.json(
            { message: "Correo verificado exitosamente" },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error en verificación:", err);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
