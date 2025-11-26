"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SeleccionaPersonalPage() {
  const router = useRouter();
  const [personal, setPersonal] = useState([]);
  const [solicitud, setSolicitud] = useState(null);

  useEffect(() => {
    const s = localStorage.getItem("solicitudPendiente");
    if (!s) {
      router.push("/solicitar");
      return;
    }
    setSolicitud(JSON.parse(s));
  }, [router]);

  useEffect(() => {
    fetch("/api/personal")
      .then((r) => r.json())
      .then(setPersonal)
      .catch(() => setPersonal([]));
  }, []);

  const seleccionarPersonal = (p) => {
    localStorage.setItem("solicitudPersonal", JSON.stringify(p));
    router.push("/solicitar/confirmar");
  };

  if (!solicitud) return <div>Cargando...</div>;

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-8 text-center text-purple-700">Selecciona Personal de Limpieza</h2>

      <div className="flex justify-center mb-8">
        <button
          onClick={() => {
            localStorage.removeItem("solicitudPersonal");
            router.push("/solicitar/confirmar");
          }}
          className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <span>⏩</span> Omitir selección (Asignar cualquiera)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {personal.map((p) => (
          <div key={p.id} className="bg-white p-6 rounded-lg shadow text-center">
            <img
              src={p.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.nombre + " " + p.apellido)}`}
              alt={`Foto de ${p.nombre}`}
              className="w-28 h-28 object-cover rounded-full mx-auto mb-2 border"
            />
            <h3 className="text-xl font-semibold">{p.nombre} {p.apellido}</h3>
            <p className="text-gray-600 text-sm mb-1">Experiencia: {p.anios_experiencia || 0} años</p>
            <p className="text-purple-500 text-xs">{p.zona_cobertura || "Cobertura: —"}</p>
            <button
              className="mt-3 w-full bg-purple-600 text-white rounded py-2 font-bold hover:bg-purple-700"
              onClick={() => seleccionarPersonal(p)}
            >
              Seleccionar
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
