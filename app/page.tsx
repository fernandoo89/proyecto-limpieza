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
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* HEADER */}
      <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <a href="/" className="text-2xl font-bold text-gray-900 tracking-tight">PeruLimpio</a>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#nosotros" className="hover:text-purple-600 transition-colors">Nosotros</a>
            <a href="#seguridad" className="hover:text-purple-600 transition-colors">Seguridad</a>
            <a href="#beneficios" className="hover:text-purple-600 transition-colors">Beneficios</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">Iniciar sesión</a>
            <a href="/registro" className="px-5 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-full hover:bg-purple-700 transition-all shadow-lg shadow-purple-200">
              Registrarse
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Confianza y Seguridad Garantizada
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              Limpieza experta, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                sin preocupaciones.
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
              Tu tranquilidad es nuestra prioridad. Conectamos hogares con profesionales de limpieza rigurosamente verificados. Olvídate de la inseguridad, nosotros nos encargamos de todo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/solicitar" className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2">
                Solicitar Servicio
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </a>
              <a href="#como-funciona" className="px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition-all flex items-center justify-center">
                Cómo funciona
              </a>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex text-yellow-400">★★★★★</div>
                <p className="text-gray-500">Más de 500 clientes felices</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full blur-3xl opacity-50 -z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1581578731117-104f2a41272c?q=80&w=1000&auto=format&fit=crop"
              alt="Limpieza segura y profesional"
              className="w-full rounded-2xl shadow-2xl border border-gray-100"
            />
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce-slow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <p className="font-bold text-gray-900">100% Verificado</p>
                <p className="text-xs text-gray-500">Personal de confianza</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES / SECURITY SECTION */}
      <section id="seguridad" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tu seguridad es lo primero</h2>
            <p className="text-gray-600">Entendemos que dejar entrar a alguien a tu hogar requiere confianza. Por eso, hemos implementado el proceso de verificación más estricto del mercado.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Antecedentes Penales", desc: "Verificamos rigurosamente los antecedentes de cada profesional.", icon: "👮‍♂️" },
              { title: "Entrevistas Personales", desc: "Nuestro equipo de psicólogos entrevista a cada candidato.", icon: "🗣️" },
              { title: "Seguro de Responsabilidad", desc: "Tu hogar está protegido contra cualquier eventualidad.", icon: "🛡️" }
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-gray-50 hover:bg-purple-50 transition-colors border border-gray-100 hover:border-purple-100 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERSONAL SECTION */}
      <section id="nosotros" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-gray-900 text-center">Conoce a nuestro equipo estrella</h2>
          {personal.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500">Cargando perfiles destacados...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {personal.slice(0, 4).map((p) => (
                <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center group">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <img
                      src={p.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.nombre + " " + p.apellido)}&background=random`}
                      alt={`Foto de ${p.nombre}`}
                      className="w-full h-full object-cover rounded-full border-4 border-purple-50 group-hover:border-purple-100 transition-colors"
                    />
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{p.nombre} {p.apellido}</h3>
                  <div className="flex justify-center gap-1 text-yellow-400 text-sm my-2">★★★★★</div>
                  <p className="text-gray-500 text-sm mb-3">
                    {p.anios_experiencia ? `${p.anios_experiencia} años de experiencia` : "Experta en limpieza"}
                  </p>
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {p.zona_cobertura || "Lima Metropolitana"}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <a href="/registro" className="text-purple-600 font-semibold hover:text-purple-700 flex items-center justify-center gap-2">
              Ver todos los profesionales <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">P</div>
              <span className="text-2xl font-bold">PeruLimpio</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revolucionando la industria de la limpieza en Perú. Seguridad, confianza y calidad en cada servicio.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Plataforma</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Cómo funciona</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Beneficios</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Seguridad</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Empresa</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Sobre nosotros</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Carreras</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Prensa</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Legal</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Términos de servicio</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de privacidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Libro de reclamaciones</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 mt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2024 PeruLimpio. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
