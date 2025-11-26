import pool from "@/lib/db";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const personalId = searchParams.get("personal_id");

        if (!personalId) {
            return new Response(JSON.stringify({ error: "Falta personal_id" }), { status: 400 });
        }

        const result = await pool.query(
            `SELECT s.*, u.nombre as cliente_nombre, u.apellido as cliente_apellido
     FROM solicitudes s
     JOIN usuarios u ON s.usuario_id = u.id
     WHERE s.personal_id = $1
     ORDER BY s.fecha DESC`,
            [personalId]
        );


        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (err) {
        console.error("Error al obtener solicitudes de personal:", err);
        return new Response(JSON.stringify({ error: "Error al obtener solicitudes" }), { status: 500 });
    }
}
