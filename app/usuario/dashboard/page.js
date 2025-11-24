"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PRECIOS_LIMPIEZA = {
  Profunda: 80,
  Ligera: 40,
  "Desinfección": 60,
  Mantenimiento: 30,
};

export default function UsuarioDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [form, setForm] = useState({
    direccion: "",
    tipo_limpieza: "Profunda",
    fecha: "",
    hora: "",
    notas: "",
  });
  const [solicitudes, setSolicitudes] = useState([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.rol === "personal") {
      router.push("/personal/dashboard");
      return;
    }
    setUser(parsedUser);
  }, [router]);

  const fetchSolicitudes = async (usuario_id) => {
    setLoadingSolicitudes(true);
    try {
      const res = await fetch(`/api/solicitudes/usuario?usuario_id=${usuario_id}`);
      const data = await res.json();
      setSolicitudes(data);
    } catch (error) {
      console.error("Error fetching solicitudes:", error);
    } finally {
      setLoadingSolicitudes(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchSolicitudes(user.id);
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const monto = PRECIOS_LIMPIEZA[form.tipo_limpieza] || 0;
    localStorage.setItem("solicitudPendiente", JSON.stringify({ ...form, monto }));
    router.push("/solicitar/seleccionar-personal");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const simularPago = async (id) => {
    await fetch("/api/solicitudes/pagar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await fetchSolicitudes(user.id);
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold">P</div>
          <span className="text-xl font-bold">PeruLimpio</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "dashboard" ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
          >
            <span>📊</span> Dashboard
          </button>
          <button
            onClick={() => setActiveTab("servicio")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "servicio" ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
          >
            <span>🧹</span> Solicitar Servicio
          </button>
          <button
            onClick={() => setActiveTab("perfil")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "perfil" ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
          >
            <span>👤</span> Mi Perfil
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-sm font-bold">
              {user.nombre.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user.nombre}</p>
              <p className="text-xs text-gray-400 truncate">Cliente</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm font-semibold"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {activeTab === "dashboard" && "Panel de Control"}
              {activeTab === "servicio" && "Solicitar Limpieza"}
              {activeTab === "perfil" && "Mi Perfil"}
            </h1>
            <p className="text-gray-500 text-sm">Bienvenido de nuevo, {user.nombre}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors relative">
              🔔
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm mb-1">Solicitudes Activas</div>
                <div className="text-3xl font-bold text-gray-900">{solicitudes.filter(s => ["pendiente", "confirmado"].includes(s.estado)).length}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm mb-1">Total Servicios</div>
                <div className="text-3xl font-bold text-gray-900">{solicitudes.length}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm mb-1">Mensajes Nuevos</div>
                <div className="text-3xl font-bold text-gray-900">0</div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Solicitudes Recientes</h3>
              </div>
              <div className="p-6">
                {loadingSolicitudes ? (
                  <p className="text-gray-500">Cargando...</p>
                ) : solicitudes.length === 0 ? (
                  <p className="text-gray-500">No tienes solicitudes recientes.</p>
                ) : (
                  <div className="space-y-4">
                    {solicitudes.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${s.estado === 'pagada' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                            {s.estado === 'pagada' ? '✓' : '⏳'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{s.tipo_limpieza}</p>
                            <p className="text-xs text-gray-500">{s.fecha} - {s.hora}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-600">S/ {s.monto}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${s.estado === 'pagada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {s.estado}
                          </span>
                        </div>
                        {["pendiente", "confirmado"].includes(s.estado) && (
                          <button
                            onClick={() => simularPago(s.id)}
                            className="px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Pagar
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "servicio" && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Nueva Solicitud</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  placeholder="Ej: Av. Larco 123, Miraflores"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Limpieza</label>
                  <select
                    name="tipo_limpieza"
                    value={form.tipo_limpieza}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                  >
                    {Object.keys(PRECIOS_LIMPIEZA).map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio Estimado</label>
                  <div className="w-full p-3 bg-purple-50 border border-purple-100 rounded-xl text-purple-700 font-bold">
                    S/ {PRECIOS_LIMPIEZA[form.tipo_limpieza]}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                  <input
                    type="date"
                    name="fecha"
                    value={form.fecha}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
                  <input
                    type="time"
                    name="hora"
                    value={form.hora}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notas Adicionales</label>
                <textarea
                  name="notas"
                  value={form.notas}
                  onChange={handleChange}
                  placeholder="Instrucciones especiales..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all h-32 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
              >
                Continuar y Seleccionar Personal
              </button>
            </form>
          </div>
        )}

        {activeTab === "perfil" && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
              👤
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{user.nombre} {user.apellido}</h2>
            <p className="text-gray-500 mb-6">{user.email}</p>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 uppercase font-bold">Teléfono</p>
                <p className="font-medium text-gray-900">{user.telefono}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 uppercase font-bold">Documento</p>
                <p className="font-medium text-gray-900">{user.tipo_documento} - {user.numero_documento}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
