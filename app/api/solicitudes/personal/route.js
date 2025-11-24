import { Pool } from "pg";

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "limpieza-db",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const personalId = searchParams.get("personal_id");

        if (!personalId) {
            return new Response(JSON.stringify({ error: "Falta personal_id" }), { status: 400 });
        }

        // Por ahora, mostraremos todas las solicitudes pendientes o las asignadas a este personal
        // Si la lógica es que el personal "toma" trabajos, podríamos mostrar todas las pendientes.
        // Si se le asignan, filtramos por personal_id.
        // Asumiremos que ve las que se le han asignado O las pendientes si no hay asignación estricta aún.
        // Dado el esquema actual, vamos a mostrar las solicitudes donde personal_id coincida.

        const result = await pool.query(
            `SELECT s.*, u.nombre as cliente_nombre, u.apellido as cliente_apellido, u.direccion as cliente_direccion
       FROM solicitudes s
       JOIN usuarios u ON s.usuario_id = u.id
       WHERE s.personal_id = $1
       ORDER BY s.fecha_servicio DESC`,
            [personalId]
        );

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (err) {
        console.error("Error al obtener solicitudes de personal:", err);
        return new Response(JSON.stringify({ error: "Error al obtener solicitudes" }), { status: 500 });
    }
}
