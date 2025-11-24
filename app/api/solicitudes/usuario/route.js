import pool from "@/lib/db";

// GET /api/solicitudes/usuario?usuario_id=3
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const usuario_id = searchParams.get("usuario_id");

  if (!usuario_id) {
    return new Response(JSON.stringify({ error: "Falta usuario_id" }), { status: 400 });
  }
  try {
    const result = await pool.query(
      `SELECT 
         s.id, s.direccion, s.tipo_limpieza, s.fecha, s.hora, s.notas, s.estado, s.monto, s.created_at, 
         s.personal_id, 
         p.nombre AS personal_nombre, p.apellido AS personal_apellido, p.foto_url AS personal_foto
      FROM solicitudes s
      LEFT JOIN usuarios p ON s.personal_id = p.id
      WHERE s.usuario_id = $1
      ORDER BY s.created_at DESC`,
      [usuario_id]
    );
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Error al listar solicitudes" }), { status: 500 });
  } 
}
