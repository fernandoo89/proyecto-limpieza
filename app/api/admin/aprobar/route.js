import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";

export async function POST(req) {
    try {
        // Verificar autenticación admin
        const auth = await verifyAdminAuth(req);
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: 403 });
        }

        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { error: "ID de usuario requerido" },
                { status: 400 }
            );
        }

        // Actualizar estado a aprobado
        const result = await pool.query(
            `UPDATE usuarios 
       SET verificado = true, estado_verificacion = 'aprobado'
       WHERE id = $1 AND rol = 'personal'
       RETURNING id, nombre, apellido, email, verificado, estado_verificacion`,
            [userId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Personal aprobado exitosamente",
                user: result.rows[0],
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error al aprobar personal:", error);
        return NextResponse.json(
            { error: "Error al aprobar personal" },
            { status: 500 }
        );
    }
}
