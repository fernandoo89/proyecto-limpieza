import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";
import { v2 as cloudinary } from "cloudinary";

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función helper para subir a Cloudinary
async function uploadToCloudinary(file, folder) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
}

// Configuración de validación de archivos
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Función para validar tipo de archivo
function validateFileType(file) {
  return ALLOWED_FILE_TYPES.includes(file.type);
}

// Función para validar tamaño de archivo
function validateFileSize(file) {
  return file.size <= MAX_FILE_SIZE;
}

// Función para generar nombre único de archivo
function generateUniqueFilename(originalName) {
  const timestamp = Date.now();
  const randomString = randomBytes(8).toString("hex");
  const extension = originalName.split(".").pop();
  return `${timestamp}-${randomString}.${extension}`;
}

// Configuración del transporter de Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req) {
  try {
    const formData = await req.formData();

    // Extraer campos del formulario
    const nombre = formData.get("nombre");
    const apellido = formData.get("apellido");
    const tipo_documento = formData.get("tipo_documento");
    const numero_documento = formData.get("numero_documento");
    const email = formData.get("email");
    const telefono = formData.get("telefono");
    const password = formData.get("password");
    const fecha_nacimiento = formData.get("fecha_nacimiento");
    const rol = formData.get("rol");
    const anios_experiencia = formData.get("anios_experiencia");
    const zona_cobertura = formData.get("zona_cobertura");

    // Archivos (solo para personal)
    const dni_foto = formData.get("dni_foto");
    const antecedentes = formData.get("antecedentes");
    const foto_perfil = formData.get("foto_perfil");

    // Validar campos requeridos
    if (!nombre || !apellido || !email || !password || !telefono) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Validar rol
    const rolFinal = rol === "personal" ? "personal" : "cliente";

    // Validaciones específicas para personal
    if (rolFinal === "personal") {
      // Validar que se hayan subido los documentos
      if (!dni_foto || !antecedentes || !foto_perfil) {
        return NextResponse.json(
          { error: "Debe subir foto de perfil, DNI y certificado de antecedentes" },
          { status: 400 }
        );
      }

      // Validar tipo de archivo DNI
      if (!validateFileType(dni_foto)) {
        return NextResponse.json(
          {
            error:
              "Tipo de archivo no válido para DNI. Solo se permiten: JPG, JPEG, PNG, PDF",
          },
          { status: 400 }
        );
      }

      // Validar tamaño de archivo DNI
      if (!validateFileSize(dni_foto)) {
        return NextResponse.json(
          { error: "El archivo de DNI excede el tamaño máximo de 5MB" },
          { status: 400 }
        );
      }

      // Validar tipo de archivo Antecedentes
      if (!validateFileType(antecedentes)) {
        return NextResponse.json(
          {
            error:
              "Tipo de archivo no válido para antecedentes. Solo se permiten: JPG, JPEG, PNG, PDF",
          },
          { status: 400 }
        );
      }

      // Validar tamaño de archivo Antecedentes
      if (!validateFileSize(antecedentes)) {
        return NextResponse.json(
          {
            error:
              "El archivo de antecedentes excede el tamaño máximo de 5MB",
          },
          { status: 400 }
        );
      }

      // Validar tipo de archivo Foto Perfil
      if (!validateFileType(foto_perfil)) {
        return NextResponse.json(
          {
            error:
              "Tipo de archivo no válido para foto de perfil. Solo se permiten: JPG, JPEG, PNG",
          },
          { status: 400 }
        );
      }

      // Validar tamaño de archivo Foto Perfil
      if (!validateFileSize(foto_perfil)) {
        return NextResponse.json(
          { error: "La foto de perfil excede el tamaño máximo de 5MB" },
          { status: 400 }
        );
      }
    }

    // Foto por defecto para cliente si no se envía (o si es personal se sobreescribirá abajo)
    let fotoFinal =
      "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(nombre + " " + apellido);

    // Verificar que no exista el correo
    const existe = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    );
    if (existe.rows.length > 0) {
      return NextResponse.json(
        { error: "El correo ya está registrado" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Variables para rutas de archivos
    let dni_foto_url = null;
    let antecedentes_url = null;

    // Guardar archivos si es personal
    if (rolFinal === "personal") {
      try {
        // Subir DNI
        const dniResult = await uploadToCloudinary(dni_foto, "documentos");
        dni_foto_url = dniResult.secure_url;

        // Subir Antecedentes
        const antecedentesResult = await uploadToCloudinary(antecedentes, "documentos");
        antecedentes_url = antecedentesResult.secure_url;

        // Subir Foto Perfil
        const perfilResult = await uploadToCloudinary(foto_perfil, "perfiles");
        fotoFinal = perfilResult.secure_url;

      } catch (fileError) {
        console.error("Error al subir archivos a Cloudinary:", fileError);
        return NextResponse.json(
          { error: "Error al guardar los documentos en la nube" },
          { status: 500 }
        );
      }
    }

    // Determinar verificado y estado_verificacion
    // AHORA: verificado (aprobación admin) es false para todos inicialmente o true para clientes?
    // El requerimiento dice: "cliente... registrarse con su correo real... notificacion... confirmando"
    // "personal... registrarse... notificacion... confirmando"
    // PERO el personal requiere aprobación de admin ADEMÁS de confirmar correo.
    // El cliente NO requiere aprobación de admin, solo confirmar correo.

    // Mantenemos la lógica de aprobación admin:
    // Cliente: verificado = true (aprobado por admin/sistema auto), pero email_verified = false
    // Personal: verificado = false (pendiente admin), email_verified = false

    const verificado = rolFinal === "cliente";
    const estado_verificacion = rolFinal === "cliente" ? "aprobado" : "pendiente";

    // Generar token de verificación
    const verificationToken = randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    const result = await pool.query(
      `INSERT INTO usuarios
        (nombre, apellido, tipo_documento, numero_documento, email, telefono, password, rol, verificado, estado_verificacion, fecha_nacimiento, foto_url, anios_experiencia, zona_cobertura, dni_foto_url, antecedentes_url, verification_token, token_expiry, email_verified)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
        RETURNING id, nombre, apellido, email, rol, verificado, estado_verificacion;`,
      [
        nombre,
        apellido,
        tipo_documento,
        numero_documento,
        email,
        telefono,
        hashedPassword,
        rolFinal,
        verificado,
        estado_verificacion,
        fecha_nacimiento,
        fotoFinal,
        rolFinal === "personal" ? anios_experiencia : null,
        rolFinal === "personal" ? zona_cobertura : null,
        dni_foto_url,
        antecedentes_url,
        verificationToken,
        tokenExpiry,
        false // email_verified inicia en false
      ]
    );

    // Enviar correo de verificación
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verificar?token=${verificationToken}`;

    try {
      await transporter.sendMail({
        from: '"Soporte Limpieza" <' + (process.env.SMTP_USER || 'no-reply@example.com') + '>',
        to: email,
        subject: "Verifica tu correo electrónico",
        html: `
          <h1>Bienvenido a nuestra plataforma</h1>
          <p>Hola ${nombre},</p>
          <p>Gracias por registrarte. Por favor confirma tu correo electrónico haciendo clic en el siguiente enlace:</p>
          <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Verificar Correo</a>
          <p>Si no te registraste, ignora este correo.</p>
          <p>Este enlace expira en 24 horas.</p>
        `,
      });
    } catch (emailError) {
      console.error("Error al enviar correo:", emailError);
      // No fallamos el registro si falla el correo, pero idealmente deberíamos avisar o permitir reenvío
      // Por ahora, logueamos el error.
    }

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error("Error en registro:", err);
    return NextResponse.json(
      { error: "Error al registrar usuario: " + err.message },
      { status: 500 }
    );
  }
}
