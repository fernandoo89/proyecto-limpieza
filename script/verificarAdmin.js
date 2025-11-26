const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

async function verificarAdmin() {
    try {
        const email = 'admin@limpieza.com';
        const password = 'Admin2024!';

        console.log('🔍 Buscando usuario con email:', email);

        const result = await pool.query(
            'SELECT id, nombre, apellido, email, rol, password, verificado, estado_verificacion FROM usuarios WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            console.log('❌ No se encontró el usuario');
            await pool.end();
            return;
        }

        const user = result.rows[0];
        console.log('\n✅ Usuario encontrado:');
        console.log('ID:', user.id);
        console.log('Nombre:', user.nombre, user.apellido);
        console.log('Email:', user.email);
        console.log('Rol:', user.rol);
        console.log('Verificado:', user.verificado);
        console.log('Estado verificación:', user.estado_verificacion);

        // Verificar contraseña
        const validPass = await bcrypt.compare(password, user.password);
        console.log('\n🔐 Contraseña válida:', validPass);

        if (!validPass) {
            console.log('❌ La contraseña no coincide');
            console.log('Hash en BD:', user.password);
        }

        await pool.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        await pool.end();
        process.exit(1);
    }
}

verificarAdmin();
