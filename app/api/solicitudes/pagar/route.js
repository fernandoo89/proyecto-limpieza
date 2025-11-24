
import pool from "@/lib/db";

export async function POST(request) {
  const { id } = await request.json();
  if (!id) {
    return new Response(JSON.stringify({ error: "Falta id de solicitud" }), { status: 400 });
  }
  try {
    const result = await pool.query(
      `UPDATE solicitudes SET estado='pagada' WHERE id=$1 RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ error: "No encontrada" }), { status: 404 });
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
