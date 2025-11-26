const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "limpieza-db",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "adminadmin",
});

async function checkColumns() {
    try {
        console.log("🔍 Verificando columnas en tabla 'usuarios'...");

        const query = `
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'usuarios' 
            AND column_name IN ('email_verified', 'verification_token', 'token_expiry');
        `;

        const res = await pool.query(query);

        if (res.rows.length === 0) {
            console.log("❌ No se encontraron las columnas nuevas.");
        } else {
            console.log("✅ Columnas encontradas:");
            res.rows.forEach(row => {
                console.log(`   - ${row.column_name} (${row.data_type})`);
            });
            
            const foundColumns = res.rows.map(r => r.column_name);
            const missing = ['email_verified', 'verification_token', 'token_expiry'].filter(c => !foundColumns.includes(c));
            
            if (missing.length > 0) {
                console.log(`⚠️ Faltan las siguientes columnas: ${missing.join(', ')}`);
            } else {
                console.log("🎉 Todas las columnas requeridas están presentes.");
            }
        }

    } catch (err) {
        console.error("❌ Error al verificar columnas:", err.message);
    } finally {
        await pool.end();
    }
}

checkColumns();
