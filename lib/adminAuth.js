import pool from "@/lib/db";

export async function verifyAdminAuth(req) {
    try {
        // Obtener el email del header de autorización
        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return { authorized: false, error: "No autorizado" };
        }

        const email = authHeader.replace("Bearer ", "");

        // Verificar que el usuario existe y es admin
        const result = await pool.query(
            "SELECT id, nombre, apellido, email, rol FROM usuarios WHERE email = $1 AND rol = $2",
            [email, "admin"]
        );

        if (result.rows.length === 0) {
            return { authorized: false, error: "Acceso denegado" };
        }

        return { authorized: true, user: result.rows[0] };
    } catch (error) {
        console.error("Error en verificación admin:", error);
        return { authorized: false, error: "Error de autenticación" };
    }
}
