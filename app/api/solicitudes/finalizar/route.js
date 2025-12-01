import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        console.log("=== INICIO: Finalizar servicio ===");

        const { solicitud_id, personal_id } = await req.json();
        console.log("Datos recibidos:", { solicitud_id, personal_id });

        if (!solicitud_id || !personal_id) {
            console.log("ERROR: Faltan campos requeridos");
            return NextResponse.json(
                { error: "Faltan campos requeridos" },
                { status: 400 }
            );
        }

        // 1. Verificar si el personal tiene tarjeta
        console.log("PASO 1: Buscando tarjeta para usuario_id:", personal_id);
        const tarjetaRes = await pool.query(
            "SELECT numero_tarjeta, tipo_tarjeta FROM tarjetas_bancarias WHERE usuario_id = $1",
            [personal_id]
        );
        console.log("Resultado tarjeta:", tarjetaRes.rows.length > 0 ? "Encontrada" : "No encontrada");

        if (tarjetaRes.rows.length === 0) {
            console.log("ERROR: No hay tarjeta registrada");
            return NextResponse.json(
                { error: "No tienes una tarjeta registrada para recibir el pago." },
                { status: 400 } // Frontend should catch this and show the alert
            );
        }

        const tarjeta = tarjetaRes.rows[0];
        const tarjetaMasked = `${tarjeta.tipo_tarjeta} ...${tarjeta.numero_tarjeta.slice(-4)}`;
        console.log("Tarjeta enmascarada:", tarjetaMasked);

        // 2. Obtener datos de la solicitud
        console.log("PASO 2: Buscando solicitud con id:", solicitud_id);
        const solicitudRes = await pool.query(
            "SELECT monto, estado FROM solicitudes WHERE id = $1",
            [solicitud_id]
        );
        console.log("Resultado solicitud:", solicitudRes.rows.length > 0 ? solicitudRes.rows[0] : "No encontrada");

        if (solicitudRes.rows.length === 0) {
            console.log("ERROR: Solicitud no encontrada");
            return NextResponse.json(
                { error: "Solicitud no encontrada" },
                { status: 404 }
            );
        }

        const solicitud = solicitudRes.rows[0];
        console.log("Estado de solicitud:", solicitud.estado);

        if (solicitud.estado !== "confirmado" && solicitud.estado !== "pagada") {
            console.log("ERROR: Estado de solicitud no válido:", solicitud.estado);
            return NextResponse.json(
                { error: "La solicitud no está en estado confirmado ni pagado" },
                { status: 400 }
            );
        }

        // 3. Calcular montos (Simulación: 80% para personal)
        console.log("PASO 3: Calculando montos");
        const montoTotal = parseFloat(solicitud.monto);
        const comision = montoTotal * 0.20;
        const pagoPersonal = montoTotal - comision;
        console.log("Montos:", { montoTotal, comision, pagoPersonal });

        // 4. Registrar el pago y actualizar estado (Transacción)
        console.log("PASO 4: Iniciando transacción");
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            console.log("Transacción iniciada");

            // Insertar pago
            console.log("Insertando pago en pagos_personal...");
            await client.query(
                `INSERT INTO pagos_personal (solicitud_id, personal_id, monto, tarjeta_destino, estado)
         VALUES ($1, $2, $3, $4, 'Depositado')`,
                [solicitud_id, personal_id, pagoPersonal, tarjetaMasked]
            );
            console.log("Pago insertado exitosamente");

            // Actualizar solicitud
            console.log("Actualizando estado de solicitud...");
            await client.query(
                "UPDATE solicitudes SET estado = 'finalizado' WHERE id = $1",
                [solicitud_id]
            );
            console.log("Estado actualizado a 'finalizado'");

            await client.query("COMMIT");
            console.log("Transacción completada exitosamente");

            return NextResponse.json({
                success: true,
                mensaje: "Servicio finalizado y pago procesado",
                monto_pagado: pagoPersonal,
                tarjeta: tarjetaMasked
            });

        } catch (e) {
            console.error("ERROR en transacción:", e);
            console.error("Detalles del error:", {
                message: e.message,
                code: e.code,
                detail: e.detail,
                stack: e.stack
            });
            await client.query("ROLLBACK");
            console.log("Transacción revertida (ROLLBACK)");
            throw e;
        } finally {
            client.release();
            console.log("Conexión liberada");
        }

    } catch (err) {
        console.error("=== ERROR GENERAL al finalizar servicio ===");
        console.error("Mensaje:", err.message);
        console.error("Código:", err.code);
        console.error("Stack:", err.stack);
        console.error("Detalles completos:", err);
        return NextResponse.json(
            { error: "Error interno del servidor", details: err.message },
            { status: 500 }
        );
    }
}
