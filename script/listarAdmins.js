const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

async function listarAdmins() {
    try {
        const result = await pool.query(
            "SELECT id, nombre, apellido, email, rol, verificado, estado_verificacion FROM usuarios WHERE rol = 'admin'"
        );

        console.log('Total admins:', result.rows.length);
        console.log(JSON.stringify(result.rows, null, 2));

        await pool.end();
    } catch (error) {
        console.error('Error:', error.message);
        await pool.end();
    }
}

listarAdmins();
