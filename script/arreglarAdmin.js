const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

async function arreglarAdmin() {
    try {
        const email = 'admin@limpieza.com';

        console.log('🔧 Actualizando estado del administrador...');

        const result = await pool.query(
            `UPDATE usuarios 
       SET estado_verificacion = 'aprobado', verificado = true 
       WHERE email = $1 AND rol = 'admin'
       RETURNING id, nombre, apellido, email, rol, verificado, estado_verificacion`,
            [email]
        );

        if (result.rows.length > 0) {
            console.log('✅ Administrador actualizado exitosamente:');
            console.log(JSON.stringify(result.rows[0], null, 2));
        } else {
            console.log('❌ No se encontró el administrador');
        }

        await pool.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        await pool.end();
        process.exit(1);
    }
}

arreglarAdmin();
