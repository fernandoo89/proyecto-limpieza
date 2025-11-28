import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { v2 as cloudinary } from "cloudinary";

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función para extraer el public_id de una URL de Cloudinary
function extractPublicId(url) {
    if (!url || !url.includes("cloudinary.com")) {
        return null;
    }

    // URL típica: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{extension}
    // Queremos extraer: {folder}/{public_id}
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");

    if (uploadIndex === -1 || uploadIndex + 2 >= parts.length) {
        return null;
    }

    // Saltar la versión (v123456) si existe
    let startIndex = uploadIndex + 1;
    if (parts[startIndex].startsWith("v")) {
        startIndex++;
    }

    // Tomar todo desde la carpeta hasta el final (sin extensión)
    const pathParts = parts.slice(startIndex);
    const lastPart = pathParts[pathParts.length - 1];
    const publicIdWithoutExt = lastPart.split(".")[0];
    pathParts[pathParts.length - 1] = publicIdWithoutExt;

    return pathParts.join("/");
}

// Función para eliminar archivo de Cloudinary
async function deleteFromCloudinary(url) {
    const publicId = extractPublicId(url);

    if (!publicId) {
        console.log("No se pudo extraer public_id de:", url);
        return;
    }

    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`Eliminado de Cloudinary: ${publicId}`, result);
    } catch (error) {
        console.error(`Error al eliminar ${publicId} de Cloudinary:`, error);
    }
}

export async function POST(req) {
    try {
        // Verificar autenticación admin
        const auth = await verifyAdminAuth(req);
        if (!auth.authorized) {
            return NextResponse.json({ error: auth.error }, { status: 403 });
        }

        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { error: "ID de usuario requerido" },
                { status: 400 }
            );
        }

        // Obtener datos del usuario para acceder a las URLs de archivos
        const userResult = await pool.query(
            `SELECT id, nombre, apellido, email, rol, foto_url, dni_foto_url, antecedentes_url 
       FROM usuarios 
       WHERE id = $1`,
            [userId]
        );

        if (userResult.rows.length === 0) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        const user = userResult.rows[0];

        // Eliminar archivos de Cloudinary si existen
        const filesToDelete = [
            user.foto_url,
            user.dni_foto_url,
            user.antecedentes_url,
        ].filter(Boolean); // Filtrar valores null/undefined

        for (const fileUrl of filesToDelete) {
            await deleteFromCloudinary(fileUrl);
        }

        // Eliminar usuario de la base de datos
        await pool.query("DELETE FROM usuarios WHERE id = $1", [userId]);

        return NextResponse.json(
            {
                message: "Usuario y archivos eliminados exitosamente",
                deletedUser: {
                    id: user.id,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    email: user.email,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        return NextResponse.json(
            { error: "Error al eliminar usuario: " + error.message },
            { status: 500 }
        );
    }
}
