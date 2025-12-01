import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { solicitud_id, personal_id } = await req.json();

        if (!solicitud_id || !personal_id) {
            return NextResponse.json(
                { error: "Faltan campos requeridos" },
                { status: 400 }
            );
        }

        // 1. Verificar si el personal tiene tarjeta
        const tarjetaRes = await pool.query(
            "SELECT numero_tarjeta, tipo_tarjeta FROM tarjetas_bancarias WHERE usuario_id = $1",
            [personal_id]
        );

        if (tarjetaRes.rows.length === 0) {
            return NextResponse.json(
                { error: "No tienes una tarjeta registrada para recibir el pago." },
                { status: 400 } // Frontend should catch this and show the alert
            );
        }

        const tarjeta = tarjetaRes.rows[0];
        const tarjetaMasked = `${tarjeta.tipo_tarjeta} ...${tarjeta.numero_tarjeta.slice(-4)}`;

        // 2. Obtener datos de la solicitud
        const solicitudRes = await pool.query(
            "SELECT monto, estado FROM solicitudes WHERE id = $1",
            [solicitud_id]
        );

        if (solicitudRes.rows.length === 0) {
            return NextResponse.json(
                { error: "Solicitud no encontrada" },
                { status: 404 }
            );
        }

        const solicitud = solicitudRes.rows[0];

        if (solicitud.estado !== "confirmado" && solicitud.estado !== "pagada") {
            return NextResponse.json(
                { error: "La solicitud no está en estado confirmado ni pagado" },
                { status: 400 }
            );
        }

        // 3. Calcular montos (Simulación: 80% para personal)
        const montoTotal = parseFloat(solicitud.monto);
        const comision = montoTotal * 0.20;
        const pagoPersonal = montoTotal - comision;

        // 4. Registrar el pago y actualizar estado (Transacción)
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Insertar pago
            await client.query(
                `INSERT INTO pagos_personal (solicitud_id, personal_id, monto, tarjeta_destino, estado)
         VALUES ($1, $2, $3, $4, 'Depositado')`,
                [solicitud_id, personal_id, pagoPersonal, tarjetaMasked]
            );

            // Actualizar solicitud
            await client.query(
                "UPDATE solicitudes SET estado = 'finalizado' WHERE id = $1",
                [solicitud_id]
            );

            await client.query("COMMIT");

            return NextResponse.json({
                success: true,
                mensaje: "Servicio finalizado y pago procesado",
                monto_pagado: pagoPersonal,
                tarjeta: tarjetaMasked
            });

        } catch (e) {
            await client.query("ROLLBACK");
            throw e;
        } finally {
            client.release();
        }

    } catch (err) {
        console.error("Error al finalizar servicio:", err);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
