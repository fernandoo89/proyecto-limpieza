"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmarSolicitudPage() {
  const router = useRouter();
  const [resumen, setResumen] = useState(null);
  const [personal, setPersonal] = useState(null);

  useEffect(() => {
    const s = localStorage.getItem("solicitudPendiente");
    const p = localStorage.getItem("solicitudPersonal");
    if (!s || !p) {
      router.push("/solicitar");
      return;
    }
    setResumen(JSON.parse(s));
    setPersonal(JSON.parse(p));
  }, [router]);

  if (!resumen || !personal) return <div>Cargando resumen...</div>;

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-8 text-center text-purple-700">Confirma tu Solicitud</h2>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div><b>Dirección:</b> {resumen.direccion}</div>
        <div><b>Tipo:</b> {resumen.tipo_limpieza}</div>
        <div><b>Fecha:</b> {resumen.fecha} <b>Hora:</b> {resumen.hora}</div>
        <div><b>Notas:</b> {resumen.notas || "—"}</div>
        <div><b>Monto:</b> S/ {resumen.monto}</div>
        <div className="my-3">
          <b>Personal seleccionado:</b> {personal.nombre} {personal.apellido}
          <br />
          {personal.foto_url && (
            <img src={personal.foto_url} alt="Foto personal" width={60} style={{ borderRadius: "50%", marginTop: 4 }} />
          )}
        </div>
      </div>
      <button
        className="block w-full py-3 bg-purple-600 text-white rounded font-bold text-lg"
        onClick={() => router.push("/solicitar/pago")}
      >
        Continuar a pago
      </button>
      <button
        className="block w-full py-2 mt-4 border rounded text-purple-700 hover:bg-purple-50"
        onClick={() => router.push("/solicitar/seleccionar-personal")}
      >
        Cambiar personal
      </button>
    </main>
  );
}
