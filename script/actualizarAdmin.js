const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

async function actualizarAdmin() {
    try {
        console.log('🔄 Actualizando usuario administrador...');

        // Actualizar el admin existente
        const result = await pool.query(
            `UPDATE usuarios 
       SET email_verified = true, 
           verificado = true, 
           estado_verificacion = 'aprobado',
           rol = 'admin'
       WHERE email = 'admin@limpieza.com'
       RETURNING id, nombre, email, rol, email_verified, verificado, estado_verificacion`,
            []
        );

        if (result.rows.length === 0) {
            console.log('❌ No se encontró el usuario admin@limpieza.com');
            process.exit(1);
        }

        console.log('✅ Administrador actualizado exitosamente!');
        console.log(result.rows[0]);
        await pool.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        await pool.end();
        process.exit(1);
    }
}

actualizarAdmin();
