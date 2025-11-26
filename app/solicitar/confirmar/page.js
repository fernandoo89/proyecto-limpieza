"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmarSolicitudPage() {
  const router = useRouter();
  const [resumen, setResumen] = useState(null);
  const [personal, setPersonal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem("solicitudPendiente");
    const p = localStorage.getItem("solicitudPersonal");
    if (!s) {
      router.push("/solicitar");
      return;
    }
    setResumen(JSON.parse(s));
    if (p) {
      setPersonal(JSON.parse(p));
    }
  }, [router]);

  const handleSolicitar = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await fetch("/api/solicitudes/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...resumen,
          usuario_id: user.id,
          personal_id: personal ? personal.id : null,
          monto: resumen.monto, // Asegurarse que el monto esté en el resumen o calcularlo
          metodo_pago: null, // No se paga aún
        }),
      });

      if (response.ok) {
        localStorage.removeItem("solicitudPendiente");
        localStorage.removeItem("solicitudPersonal");
        router.push("/usuario/mis-solicitudes");
      } else {
        const data = await response.json();
        alert(data.error || "Error al crear la solicitud");
      }
    } catch (err) {
      console.error(err);
      alert("Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  if (!resumen) return <div>Cargando resumen...</div>;

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-8 text-center text-purple-700">Confirma tu Solicitud</h2>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div><b>Dirección:</b> {resumen.direccion}</div>
        <div><b>Tipo:</b> {resumen.tipo_limpieza}</div>
        <div><b>Fecha:</b> {resumen.fecha} <b>Hora:</b> {resumen.hora}</div>
        <div><b>Notas:</b> {resumen.notas || "—"}</div>
        <div><b>Monto Estimado:</b> S/ {resumen.monto}</div>
        <div className="my-3">
          <b>Personal seleccionado:</b> {personal ? `${personal.nombre} ${personal.apellido}` : "Por asignar (Cualquiera)"}
          <br />
          {personal && personal.foto_url && (
            <img src={personal.foto_url} alt="Foto personal" width={60} style={{ borderRadius: "50%", marginTop: 4 }} />
          )}
        </div>
      </div>
      <button
        className="block w-full py-3 bg-purple-600 text-white rounded font-bold text-lg hover:bg-purple-700 transition-colors"
        onClick={handleSolicitar}
        disabled={loading}
      >
        {loading ? "Procesando..." : "Solicitar Servicio"}
      </button>
      <button
        className="block w-full py-2 mt-4 border rounded text-purple-700 hover:bg-purple-50"
        onClick={() => router.push("/solicitar/seleccionar-personal")}
        disabled={loading}
      >
        Cambiar personal
      </button>
    </main>
  );
}
