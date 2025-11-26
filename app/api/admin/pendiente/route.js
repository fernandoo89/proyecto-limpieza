import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";

export async function GET(req) {
    try {
        // Verificar autenticación admin
        const auth = await verifyAdminAuth(req);
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: 403 });
        }

        // Obtener personal pendiente de aprobación
        const result = await pool.query(
            `SELECT 
        id, 
        nombre, 
        apellido, 
        email, 
        telefono,
        tipo_documento,
        numero_documento,
        anios_experiencia,
        zona_cobertura,
        dni_foto_url, 
        antecedentes_url,
        estado_verificacion,
        fecha_nacimiento,
        created_at
      FROM usuarios 
      WHERE rol = 'personal' AND estado_verificacion = 'pendiente'
      ORDER BY created_at DESC`
        );

        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        console.error("Error al obtener personal pendiente:", error);
        return NextResponse.json(
            { error: "Error al obtener datos" },
            { status: 500 }
        );
    }
}
