"use client";
import { useEffect, useState } from "react";

type Personal = {
  id: number;
  nombre: string;
  apellido: string;
  foto_url?: string;
  anios_experiencia?: number;
  zona_cobertura?: string;
};

export default function Home() {
  // INDICA el tipo del array: Personal[]
  const [personal, setPersonal] = useState<Personal[]>([]);

  useEffect(() => {
    fetch("/api/personal")
      .then((res) => res.json())
      .then(setPersonal)
      .catch(() => setPersonal([]));
  }, []);

  return (
    <main className="min-h-screen bg-hero-pattern">
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="text-3xl font-extrabold text-purple-600">PeruLimpio</a>
        </div>
        <nav className="flex items-center gap-6 text-gray-600">
          <a href="#nosotros" className="hover:text-purple-600">Nosotros</a>
          <a href="#" className="hover:text-purple-600">Beneficios</a>
          <div className="flex items-center gap-3 ml-4">
            <a href="/registro" className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 font-semibold">Registrar</a>
            <a href="/login" className="px-4 py-2 border border-purple-300 rounded-full text-purple-600 hover:bg-purple-50">Iniciar sesión</a>
          </div>
        </nav>
      </header>

      {/* Sección HERO */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-purple-600 leading-tight">
            Conecta con Nosotros independientes en limpieza cerca de ti
          </h1>
          <p className="text-gray-600 text-lg max-w-xl">
            Reserva servicio de limpieza en minutos. Profesionales verificadas,
            precios claros y reservas flexibles.
          </p>
          <div className="mt-6">
            <a href="/solicitar" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 font-semibold">
              Reservar
            </a>
          </div>
        </div>
        <div className="relative flex justify-center lg:justify-end">
          <div className="w-full max-w-lg">
            <img
              src="https://www.jover-abogados.com/wp-content/uploads/2023/02/subrogacion-personal-servicio-limpieza.jpg"
              alt="Imagen hero (sustituir por la imagen que vas a dar)"
              className="w-full h-72 sm:h-96 rounded-lg shadow-2xl object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* SECCIÓN NOSOTROS / NUESTRO PERSONAL */}
      <section id="nosotros" className="max-w-7xl mx-auto px-6 py-14">
        <h2 className="text-3xl font-bold mb-8 text-purple-600 text-center">Nuestro Personal</h2>
        {personal.length === 0 ? (
          <p className="text-center text-gray-600">No hay personal registrado aún.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {personal.map((p) => (
              <div key={p.id} className="bg-white p-6 rounded-lg shadow text-center">
                <img
                  src={p.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.nombre + " " + p.apellido)}`}
                  alt={`Foto de ${p.nombre}`}
                  className="w-28 h-28 object-cover rounded-full mx-auto mb-2 border"
                />
                <h3 className="text-xl font-semibold mt-2">{p.nombre} {p.apellido}</h3>
                <p className="text-gray-600 text-sm mb-1">
                  Experiencia: {p.anios_experiencia || 0} años
                </p>
                <p className="text-purple-500 text-xs">
                  {p.zona_cobertura || "Cobertura: —"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
