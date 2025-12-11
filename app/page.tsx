"use client";

// Perfiles de demostración para la landing page
const PERSONAL_DEMO = [
  {
    id: 1,
    nombre: "Rosa",
    apellido: "Martínez",
    foto_url: "https://i.pravatar.cc/150?img=47",
    anios_experiencia: 8,
    zona_cobertura: "San Isidro, Miraflores"
  },
  {
    id: 2,
    nombre: "Carmen",
    apellido: "López",
    foto_url: "https://i.pravatar.cc/150?img=45",
    anios_experiencia: 5,
    zona_cobertura: "Surco, La Molina"
  },
  {
    id: 3,
    nombre: "Lucía",
    apellido: "Fernández",
    foto_url: "https://i.pravatar.cc/150?img=44",
    anios_experiencia: 12,
    zona_cobertura: "San Borja, Surco"
  },
  {
    id: 4,
    nombre: "Patricia",
    apellido: "Rojas",
    foto_url: "https://i.pravatar.cc/150?img=32",
    anios_experiencia: 6,
    zona_cobertura: "Jesús María, Lince"
  }
];

import FAQSection from './components/FAQSection';
import ChatWidget from './components/ChatWidget';

export default function Home() {

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

      {/* PRICING SECTION (Recommended Plans) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Elige el servicio a tu medida</h2>
            <p className="text-gray-600">Paquetes diseñados para cada necesidad. Sin costos ocultos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Card 1: Express */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-purple-200 transition-all hover:shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pack Express</h3>
              <p className="text-gray-500 text-sm mb-6">Ideal para departamentos pequeños o mantenimiento.</p>
              <div className="text-4xl font-bold text-gray-900 mb-2">S/ 99</div>
              <p className="text-gray-400 text-sm mb-8">4 horas de servicio</p>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Limpieza general</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 1 baño y cocina</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Productos básicos</li>
              </ul>
              <a href="/registro" className="block w-full py-3 px-6 text-center border-2 border-gray-900 text-gray-900 font-bold rounded-xl hover:bg-gray-900 hover:text-white transition-all">
                Reservar
              </a>
            </div>

            {/* Card 2: Standard (Popular) */}
            <div className="relative bg-white p-8 rounded-2xl border-2 border-purple-500 shadow-xl transform md:-translate-y-4">
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-wider">
                Más Popular
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pack Estándar</h3>
              <p className="text-gray-500 text-sm mb-6">El favorito para familias y casas medianas.</p>
              <div className="text-4xl font-bold text-purple-600 mb-2">S/ 109</div>
              <p className="text-gray-400 text-sm mb-8">6 horas de servicio</p>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                <li className="flex items-center gap-2"><span className="text-purple-500">✓</span> Limpieza profunda</li>
                <li className="flex items-center gap-2"><span className="text-purple-500">✓</span> Hasta 2 baños</li>
                <li className="flex items-center gap-2"><span className="text-purple-500">✓</span> Desinfección completa</li>
              </ul>
              <a href="/registro" className="block w-full py-3 px-6 text-center bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200">
                Reservar
              </a>
            </div>

            {/* Card 3: Premium */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-purple-200 transition-all hover:shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pack Premium</h3>
              <p className="text-gray-500 text-sm mb-6">Para casas grandes o limpieza exhaustiva.</p>
              <div className="text-4xl font-bold text-gray-900 mb-2">S/ 119</div>
              <p className="text-gray-400 text-sm mb-8">7 horas de servicio</p>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Todo incluido</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Limpieza de ventanas</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Planchado básico</li>
              </ul>
              <a href="/registro" className="block w-full py-3 px-6 text-center border-2 border-gray-900 text-gray-900 font-bold rounded-xl hover:bg-gray-900 hover:text-white transition-all">
                Reservar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Cómo funciona?</h2>
            <p className="text-gray-600">Solicitar un servicio de limpieza nunca fue tan fácil. Solo 3 pasos y listo.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-200 -z-10"></div>

            {[
              {
                step: "1",
                title: "Solicita tu servicio",
                desc: "Completa el formulario con los detalles de tu necesidad: tipo de limpieza, fecha, hora y dirección.",
                icon: "📝",
                color: "purple"
              },
              {
                step: "2",
                title: "Confirmamos y asignamos",
                desc: "Nuestro personal verificado acepta tu solicitud. Recibes confirmación inmediata con los datos del profesional.",
                icon: "✅",
                color: "blue"
              },
              {
                step: "3",
                title: "Disfruta tu hogar limpio",
                desc: "El profesional llega puntual, realiza el servicio y tú disfrutas de un hogar impecable sin preocupaciones.",
                icon: "✨",
                color: "green"
              }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-purple-200 transition-all hover:shadow-lg group">
                  <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                    {item.step}
                  </div>
                  <div className="text-5xl mb-4 text-center mt-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{item.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <a href="/solicitar" className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl">
              Solicitar ahora
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </a>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section id="beneficios" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por qué elegir PeruLimpio?</h2>
            <p className="text-gray-600">Más que un servicio de limpieza, somos tu aliado de confianza para el cuidado de tu hogar.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Personal Verificado", desc: "Todos nuestros profesionales pasan por rigurosos controles de antecedentes y entrevistas.", icon: "🔒", gradient: "from-purple-500 to-purple-600" },
              { title: "Pago Seguro", desc: "Procesamos pagos de forma segura. Tu información financiera está protegida.", icon: "💳", gradient: "from-blue-500 to-blue-600" },
              { title: "Flexibilidad Total", desc: "Elige la fecha y hora que mejor te convenga. Nos adaptamos a tu agenda.", icon: "📅", gradient: "from-green-500 to-green-600" },
              { title: "Calidad Garantizada", desc: "Si no quedas satisfecho, volvemos sin costo adicional.", icon: "⭐", gradient: "from-yellow-500 to-yellow-600" },
              { title: "Atención 24/7", desc: "Nuestro equipo de soporte está disponible para ayudarte en cualquier momento.", icon: "💬", gradient: "from-pink-500 to-pink-600" },
              { title: "Precios Transparentes", desc: "Sin sorpresas. El precio que ves es el precio que pagas.", icon: "💰", gradient: "from-indigo-500 to-indigo-600" }
            ].map((benefit, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 group">
                <div className={`w-14 h-14 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-gray-600">Miles de hogares confían en nosotros. Lee sus experiencias.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "María González",
                role: "Ama de casa",
                avatar: "https://i.pravatar.cc/100?img=5",
                rating: 5,
                text: "Increíble servicio. El personal es muy profesional y mi casa quedó impecable. Lo mejor es la tranquilidad de saber que son personas verificadas.",
                date: "Hace 2 semanas"
              },
              {
                name: "Carlos Ramírez",
                role: "Empresario",
                avatar: "https://i.pravatar.cc/100?img=12",
                rating: 5,
                text: "Uso PeruLimpio cada semana para mi oficina. Siempre puntuales, siempre profesionales. El proceso de pago es súper fácil y seguro.",
                date: "Hace 1 mes"
              },
              {
                name: "Ana Flores",
                role: "Profesora",
                avatar: "https://i.pravatar.cc/100?img=9",
                rating: 5,
                text: "Como madre soltera, necesitaba ayuda confiable. PeruLimpio me dio esa tranquilidad. La persona que viene es como de la familia ya.",
                date: "Hace 3 días"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-purple-200 transition-all hover:shadow-lg group">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full border-2 border-purple-100 group-hover:border-purple-300 transition-colors"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-4 italic">"{testimonial.text}"</p>
                <p className="text-xs text-gray-400">{testimonial.date}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 border border-green-100 rounded-full">
              <span className="text-2xl">🎉</span>
              <span className="text-green-700 font-semibold">Más de 500 clientes satisfechos</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PERSONAL_DEMO.map((p) => (
              <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center group">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img
                    src={p.foto_url}
                    alt={`Foto de ${p.nombre}`}
                    className="w-full h-full object-cover rounded-full border-4 border-purple-50 group-hover:border-purple-100 transition-colors"
                  />
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{p.nombre} {p.apellido}</h3>
                <div className="flex justify-center gap-1 text-yellow-400 text-sm my-2">★★★★★</div>
                <p className="text-gray-500 text-sm mb-3">
                  {p.anios_experiencia} años de experiencia
                </p>
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {p.zona_cobertura}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-xs text-gray-400 italic">* Perfiles de demostración</p>
          </div>
          <div className="text-center mt-12">
            <a href="/registro" className="text-purple-600 font-semibold hover:text-purple-700 flex items-center justify-center gap-2">
              Ver todos los profesionales <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <FAQSection />

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

      {/* CHAT WIDGET */}
      <ChatWidget />
    </main>
  );
}
