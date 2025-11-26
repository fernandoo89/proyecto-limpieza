const { Pool } = require('pg');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "limpieza-db",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "adminadmin",
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function verifyFlow() {
    const email = `test_verify_${Date.now()}@example.com`;
    const password = 'password123';
    let userId;
    let token;

    try {
        console.log("🚀 Iniciando prueba de flujo de verificación...");

        // 1. Registro
        console.log(`\n1️⃣ Registrando usuario: ${email}`);

        const form = new FormData();
        form.append('nombre', 'Test');
        form.append('apellido', 'User');
        form.append('email', email);
        form.append('password', password);
        form.append('telefono', '123456789');
        form.append('rol', 'cliente');
        form.append('tipo_documento', 'DNI');
        form.append('numero_documento', '12345678');
        form.append('fecha_nacimiento', '1990-01-01');

        try {
            const registerRes = await axios.post(`${BASE_URL}/api/auth/registro`, form, {
                headers: form.getHeaders()
            });
            console.log("✅ Registro exitoso:", registerRes.data.id);
            userId = registerRes.data.id;
        } catch (error) {
            throw new Error(`Error en registro: ${error.response?.data?.error || error.message}`);
        }

        // 2. Intentar Login (Debería fallar)
        console.log("\n2️⃣ Intentando login antes de verificar (Debería fallar)...");
        try {
            await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
            console.error("❌ Login NO bloqueado (Debería haber fallado)");
        } catch (error) {
            if (error.response && error.response.status === 403 && error.response.data.error.includes("confirma tu correo")) {
                console.log("✅ Login bloqueado correctamente:", error.response.data.error);
            } else {
                console.error("❌ Error inesperado en login:", error.response?.data || error.message);
            }
        }

        // 3. Obtener Token de BD
        console.log("\n3️⃣ Obteniendo token de la base de datos...");
        const tokenRes = await pool.query("SELECT verification_token FROM usuarios WHERE email = $1", [email]);
        if (tokenRes.rows.length === 0) throw new Error("Usuario no encontrado en BD");
        token = tokenRes.rows[0].verification_token;
        console.log("✅ Token obtenido:", token);

        // 4. Verificar Correo
        console.log("\n4️⃣ Verificando correo...");
        try {
            const verifyRes = await axios.get(`${BASE_URL}/api/auth/verificar?token=${token}`);
            console.log("✅ Verificación exitosa:", verifyRes.data.message);
        } catch (error) {
            throw new Error(`Error en verificación: ${error.response?.data?.error || error.message}`);
        }

        // 5. Intentar Login (Debería funcionar)
        console.log("\n5️⃣ Intentando login después de verificar (Debería funcionar)...");
        try {
            const loginRes2 = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
            console.log("✅ Login exitoso:", loginRes2.data.email);
        } catch (error) {
            console.error("❌ Login falló:", error.response?.data || error.message);
        }

    } catch (err) {
        console.error("❌ Error en la prueba:", err.message);
    } finally {
        await pool.end();
    }
}

verifyFlow();
