const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "limpieza-db",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "adminadmin",
});

async function updateSchema() {
    try {
        console.log("🔄 Actualizando esquema de base de datos...");

        // Agregar columnas para documentos
        await pool.query(`
            ALTER TABLE usuarios 
            ADD COLUMN IF NOT EXISTS dni_foto_url TEXT,
            ADD COLUMN IF NOT EXISTS antecedentes_url TEXT,
            ADD COLUMN IF NOT EXISTS estado_verificacion TEXT DEFAULT 'pendiente'
        `);

        console.log("✅ Columnas agregadas: dni_foto_url, antecedentes_url, estado_verificacion");

        // Verificar que la columna verificado existe
        const checkVerificado = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'usuarios' AND column_name = 'verificado'
        `);

        if (checkVerificado.rows.length > 0) {
            console.log("✅ Columna 'verificado' existe");
        } else {
            console.log("⚠️ Columna 'verificado' no existe, creándola...");
            await pool.query(`
                ALTER TABLE usuarios 
                ADD COLUMN verificado BOOLEAN DEFAULT false
            `);
            console.log("✅ Columna 'verificado' creada");
        }

        // Actualizar estado_verificacion para usuarios existentes
        await pool.query(`
            UPDATE usuarios 
            SET estado_verificacion = CASE 
                WHEN verificado = true THEN 'aprobado'
                ELSE 'pendiente'
            END
            WHERE estado_verificacion IS NULL
        `);

        console.log("✅ Estados de verificación actualizados");
        console.log("🎉 Esquema actualizado exitosamente!");

    } catch (err) {
        console.error("❌ Error al actualizar esquema:", err.message);
    } finally {
        await pool.end();
    }
}

updateSchema();
