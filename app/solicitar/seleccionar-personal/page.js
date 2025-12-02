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
            <div className="flex items-center justify-center gap-2 mb-1">
              <h3 className="text-xl font-semibold">{p.nombre} {p.apellido}</h3>
              {p.verificado && (
                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 border border-blue-200" title="Identidad Verificada">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verificado
                </span>
              )}
            </div>

            <div className="flex items-center justify-center gap-1 mb-2 text-yellow-500 text-sm">
              <span>⭐</span>
              <span className="font-bold text-gray-700">{Number(p.promedio_calificacion).toFixed(1)}</span>
              <span className="text-gray-400 text-xs">({p.total_resenas} reseñas)</span>
            </div>

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
