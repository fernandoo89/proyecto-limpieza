"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PersonalDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [trabajos, setTrabajos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            router.push("/login");
            return;
        }
        const parsedUser = JSON.parse(userData);
        if (parsedUser.rol !== "personal") {
            router.push("/usuario/dashboard"); // Redirigir si no es personal
            return;
        }
        setUser(parsedUser);
    }, [router]);

    const cargarTrabajos = () => {
        if (!user) return;
        setLoading(true);
        fetch(`/api/solicitudes/personal?personal_id=${user.id}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Mapear datos de la BD al formato del dashboard
                    const trabajosFormateados = data.map(t => ({
                        id: t.id,
                        cliente: `${t.cliente_nombre} ${t.cliente_apellido}`,
                        direccion: t.direccion || "Dirección no especificada",
                        tipo: t.tipo_limpieza || "Limpieza General", // Fixed field name
                        fecha: new Date(t.fecha).toLocaleDateString(), // Fixed field name
                        hora: t.hora || "09:00", // Fixed field name
                        estado: t.estado || "pendiente",
                        monto: t.monto || 0, // Fixed field name
                        notas: t.notas || "Sin notas adicionales"
                    }));
                    setTrabajos(trabajosFormateados);
                }
            })
            .catch(err => console.error("Error cargando trabajos:", err))
            .finally(() => setLoading(false));
    };

    // Cargar trabajos reales
    useEffect(() => {
        cargarTrabajos();
    }, [user]);

    const actualizarEstado = async (id, nuevoEstado) => {
        try {
            const body = { id, estado: nuevoEstado };
            if (nuevoEstado === "confirmado" && user) {
                body.personal_id = user.id;
            }

            const res = await fetch("/api/solicitudes/estado", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setTrabajos((prev) =>
                    prev.map((t) => (t.id === id ? { ...t, estado: nuevoEstado } : t))
                );
                // Reload to reflect changes (e.g. if we want to move it to "My Jobs" list visually)
                cargarTrabajos();
                if (selectedJob && selectedJob.id === id) {
                    setSelectedJob(prev => ({ ...prev, estado: nuevoEstado }));
                }
            } else {
                alert("Error al actualizar el estado");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/");
    };

    if (!user) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* SIDEBAR */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full z-10">
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
                        onClick={() => setActiveTab("trabajos")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "trabajos" ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
                    >
                        <span>🧹</span> Mis Trabajos
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
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold">
                            {user.nombre.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{user.nombre}</p>
                            <p className="text-xs text-gray-400 truncate">Personal</p>
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
            <main className="flex-1 ml-64 p-8 relative">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {activeTab === "dashboard" && "Panel de Personal"}
                            {activeTab === "trabajos" && "Mis Trabajos Asignados"}
                            {activeTab === "perfil" && "Mi Perfil Profesional"}
                        </h1>
                        <p className="text-gray-500 text-sm">Bienvenido, {user.nombre}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={cargarTrabajos}
                            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            🔄 Actualizar
                        </button>
                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Disponible
                        </div>
                    </div>
                </header>

                {activeTab === "dashboard" && (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="text-gray-500 text-sm mb-1">Trabajos Pendientes</div>
                                <div className="text-3xl font-bold text-gray-900">{trabajos.filter(t => t.estado === "pendiente").length}</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="text-gray-500 text-sm mb-1">Ganancias del Mes</div>
                                <div className="text-3xl font-bold text-gray-900">S/ 1,200</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="text-gray-500 text-sm mb-1">Calificación Promedio</div>
                                <div className="text-3xl font-bold text-gray-900 flex items-center gap-1">
                                    4.8 <span className="text-yellow-400 text-xl">★</span>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Jobs */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-bold text-gray-900">Próximos Trabajos</h3>
                            </div>
                            <div className="p-6">
                                {loading ? (
                                    <p className="text-gray-500">Cargando trabajos...</p>
                                ) : trabajos.length === 0 ? (
                                    <p className="text-gray-500">No tienes trabajos asignados.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {trabajos.map((t) => (
                                            <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-lg">
                                                        🗓️
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{t.cliente}</p>
                                                        <p className="text-xs text-gray-500">{t.direccion} • {t.tipo}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-900">{t.fecha} - {t.hora}</p>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${t.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                                        {t.estado}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "trabajos" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6">
                            {loading ? (
                                <p className="text-gray-500">Cargando trabajos...</p>
                            ) : trabajos.length === 0 ? (
                                <p className="text-gray-500">No tienes trabajos asignados.</p>
                            ) : (
                                <div className="grid gap-4">
                                    {trabajos.map((t) => (
                                        <div key={t.id} className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-purple-200 transition-colors">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900">{t.tipo}</h3>
                                                    <p className="text-gray-500">{t.cliente}</p>
                                                </div>
                                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                                                    S/ {t.monto}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <span>📍</span> {t.direccion}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span>🕒</span> {t.fecha} {t.hora}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {t.estado === "pendiente" ? (
                                                    <>
                                                        <button
                                                            onClick={() => actualizarEstado(t.id, "confirmado")}
                                                            className="flex-1 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                                                        >
                                                            Aceptar
                                                        </button>
                                                        <button
                                                            onClick={() => actualizarEstado(t.id, "rechazado")}
                                                            className="flex-1 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                                                        >
                                                            Rechazar
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button className="flex-1 py-2 bg-gray-400 text-white rounded-lg font-semibold cursor-not-allowed">
                                                        {t.estado === "confirmado" ? "Aceptado" : "Rechazado"}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setSelectedJob(t)}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    Ver Detalles
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "perfil" && (
                    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                            🧹
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
                            <div className="p-4 bg-gray-50 rounded-xl col-span-2">
                                <p className="text-xs text-gray-500 uppercase font-bold">Zona de Cobertura</p>
                                <p className="font-medium text-gray-900">{user.zona_cobertura || "Lima Metropolitana"}</p>
                            </div>
                            {user.anios_experiencia && (
                                <div className="p-4 bg-gray-50 rounded-xl col-span-2">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Experiencia</p>
                                    <p className="font-medium text-gray-900">{user.anios_experiencia} años</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* MODAL DE DETALLES */}
                {selectedJob && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="text-xl font-bold text-gray-800">Detalles del Servicio</h3>
                                <button
                                    onClick={() => setSelectedJob(null)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                                        👤
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Cliente</p>
                                        <p className="font-bold text-lg text-gray-900">{selectedJob.cliente}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-xl">
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Servicio</p>
                                        <p className="font-semibold text-gray-800">{selectedJob.tipo}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-xl">
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Monto</p>
                                        <p className="font-semibold text-purple-600">S/ {selectedJob.monto}</p>
                                    </div>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Dirección</p>
                                    <p className="font-semibold text-gray-800">{selectedJob.direccion}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-xl">
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Fecha</p>
                                        <p className="font-semibold text-gray-800">{selectedJob.fecha}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-xl">
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Hora</p>
                                        <p className="font-semibold text-gray-800">{selectedJob.hora}</p>
                                    </div>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Notas Adicionales</p>
                                    <p className="text-gray-700 italic">"{selectedJob.notas}"</p>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    {selectedJob.estado === "pendiente" ? (
                                        <>
                                            <button
                                                onClick={() => {
                                                    actualizarEstado(selectedJob.id, "confirmado");
                                                    setSelectedJob(null);
                                                }}
                                                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                                            >
                                                Aceptar Trabajo
                                            </button>
                                            <button
                                                onClick={() => {
                                                    actualizarEstado(selectedJob.id, "rechazado");
                                                    setSelectedJob(null);
                                                }}
                                                className="flex-1 py-3 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition-colors"
                                            >
                                                Rechazar
                                            </button>
                                        </>
                                    ) : (
                                        <div className={`w-full py-3 text-center rounded-xl font-bold ${selectedJob.estado === 'confirmado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            Estado: {selectedJob.estado.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
