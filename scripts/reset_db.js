const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "limpieza-db",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "adminadmin",
});

async function resetDB() {
    try {
        console.log("Eliminando solicitudes...");
        await pool.query("DELETE FROM solicitudes");
        console.log("Solicitudes eliminadas.");

        console.log("Eliminando usuarios...");
        await pool.query("DELETE FROM usuarios");
        console.log("Usuarios eliminados.");

        console.log("Base de datos limpia.");
    } catch (err) {
        console.error("Error al limpiar la BD:", err);
    } finally {
        await pool.end();
    }
}

resetDB();
