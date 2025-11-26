"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MisSolicitudesPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);

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
        setLoading(true);
        try {
            const res = await fetch(`/api/solicitudes/usuario?usuario_id=${usuario_id}`);
            const data = await res.json();
            setSolicitudes(data);
        } catch (error) {
            console.error("Error fetching solicitudes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;
        fetchSolicitudes(user.id);
    }, [user]);

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
                        onClick={() => router.push("/usuario/dashboard")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
                    >
                        <span>📊</span> Dashboard
                    </button>
                    <button
                        onClick={() => router.push("/usuario/dashboard")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
                    >
                        <span>🧹</span> Solicitar Servicio
                    </button>
                    <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-900/50 transition-all"
                    >
                        <span>📅</span> Mis Solicitudes
                    </button>
                    <button
                        onClick={() => router.push("/usuario/dashboard")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
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
                        <h1 className="text-2xl font-bold text-gray-900">Mis Solicitudes</h1>
                        <p className="text-gray-500 text-sm">Historial completo de tus servicios</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors relative">
                            🔔
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6">
                        {loading ? (
                            <p className="text-gray-500">Cargando...</p>
                        ) : solicitudes.length === 0 ? (
                            <p className="text-gray-500">No tienes solicitudes registradas.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-gray-500 border-b border-gray-100">
                                            <th className="p-4 font-medium">Fecha</th>
                                            <th className="p-4 font-medium">Hora</th>
                                            <th className="p-4 font-medium">Tipo</th>
                                            <th className="p-4 font-medium">Personal</th>
                                            <th className="p-4 font-medium">Precio</th>
                                            <th className="p-4 font-medium">Estado</th>
                                            <th className="p-4 font-medium">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {solicitudes.map((s) => (
                                            <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                <td className="p-4 text-gray-900">{s.fecha}</td>
                                                <td className="p-4 text-gray-900">{s.hora}</td>
                                                <td className="p-4 font-bold text-gray-900">{s.tipo_limpieza}</td>
                                                <td className="p-4 text-gray-600">
                                                    {s.personal_nombre ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                                                                <img
                                                                    src={s.personal_foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.personal_nombre + " " + s.personal_apellido)}`}
                                                                    alt="Personal"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            {s.personal_nombre} {s.personal_apellido}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">Sin asignar</span>
                                                    )}
                                                </td>
                                                <td className="p-4 font-bold text-purple-600">S/ {s.monto}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${s.estado === 'pagada' ? 'bg-green-100 text-green-700' :
                                                        s.estado === 'confirmado' ? 'bg-blue-100 text-blue-700' :
                                                            s.estado === 'rechazado' ? 'bg-red-100 text-red-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {s.estado.charAt(0).toUpperCase() + s.estado.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    {s.estado === "confirmado" && (
                                                        <button
                                                            onClick={() => router.push(`/solicitar/pago?id=${s.id}`)}
                                                            className="px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
                                                        >
                                                            Pagar
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
