import pool from '../lib/db.js';

async function fixCloudinaryPDFUrls() {
    try {
        console.log('🔧 Iniciando corrección de URLs de PDFs en Cloudinary...\n');

        // Obtener todos los usuarios con documentos PDF
        const result = await pool.query(`
      SELECT id, nombre, apellido, dni_foto_url, antecedentes_url 
      FROM usuarios 
      WHERE dni_foto_url IS NOT NULL OR antecedentes_url IS NOT NULL
    `);

        console.log(`📋 Encontrados ${result.rows.length} usuarios con documentos\n`);

        let updatedCount = 0;

        for (const user of result.rows) {
            let needsUpdate = false;
            let newDniUrl = user.dni_foto_url;
            let newAntecedentesUrl = user.antecedentes_url;

            // Corregir URL de DNI si es PDF con path incorrecto
            if (user.dni_foto_url && user.dni_foto_url.includes('.pdf') && user.dni_foto_url.includes('/image/upload/')) {
                newDniUrl = user.dni_foto_url.replace('/image/upload/', '/raw/upload/');
                needsUpdate = true;
                console.log(`  📄 Corrigiendo DNI de ${user.nombre} ${user.apellido}`);
                console.log(`     Antes: ${user.dni_foto_url}`);
                console.log(`     Después: ${newDniUrl}`);
            }

            // Corregir URL de Antecedentes si es PDF con path incorrecto
            if (user.antecedentes_url && user.antecedentes_url.includes('.pdf') && user.antecedentes_url.includes('/image/upload/')) {
                newAntecedentesUrl = user.antecedentes_url.replace('/image/upload/', '/raw/upload/');
                needsUpdate = true;
                console.log(`  📄 Corrigiendo Antecedentes de ${user.nombre} ${user.apellido}`);
                console.log(`     Antes: ${user.antecedentes_url}`);
                console.log(`     Después: ${newAntecedentesUrl}`);
            }

            // Actualizar en la base de datos si hay cambios
            if (needsUpdate) {
                await pool.query(
                    `UPDATE usuarios 
           SET dni_foto_url = $1, antecedentes_url = $2 
           WHERE id = $3`,
                    [newDniUrl, newAntecedentesUrl, user.id]
                );
                updatedCount++;
                console.log(`  ✅ Usuario actualizado\n`);
            }
        }

        console.log(`\n✨ Proceso completado!`);
        console.log(`   Total usuarios revisados: ${result.rows.length}`);
        console.log(`   Total usuarios actualizados: ${updatedCount}`);

        await pool.end();
    } catch (error) {
        console.error('❌ Error al corregir URLs:', error);
        process.exit(1);
    }
}

fixCloudinaryPDFUrls();
