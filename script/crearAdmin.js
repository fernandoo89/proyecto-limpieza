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

async function crearAdmin() {
  try {
    const adminData = {
      nombre: 'Admin',
      apellido: 'Sistema',
      tipo_documento: 'DNI',
      numero_documento: '00000000',
      email: 'admin@limpieza.com',
      telefono: '999999999',
      password: 'Admin2024!',
      fecha_nacimiento: '1990-01-01'
    };

    // Validar que no exista el correo
    const existe = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [adminData.email]
    );
    if (existe.rows.length > 0) {
      console.log('⚠️ Ya existe un usuario con ese correo');
      process.exit(1);
    }

    // Crear usuario admin
    const result = await pool.query(
      `INSERT INTO usuarios (
        nombre, apellido, tipo_documento, numero_documento, email, telefono, password, rol, verificado, estado_verificacion, fecha_nacimiento, email_verified, foto_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id, nombre, apellido, email, rol, verificado, estado_verificacion, email_verified`,
      [
        adminData.nombre,
        adminData.apellido,
        adminData.tipo_documento,
        adminData.numero_documento,
        adminData.email,
        adminData.telefono,
        await bcrypt.hash(adminData.password, 10),
        'admin',             // ADMINISTRADOR
        true,                // Verificarlo por defecto
        'aprobado',          // Estado de verificación aprobado
        adminData.fecha_nacimiento,
        true,                // Email verificado (para que pueda hacer login)
        'https://ui-avatars.com/api/?name=Admin+Sistema&background=0D8ABC&color=fff'
      ]
    );

    console.log('✅ Administrador creado exitosamente!');
    console.log(result.rows[0]);
    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

crearAdmin();
