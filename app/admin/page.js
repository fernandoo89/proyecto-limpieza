"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const [personalPendiente, setPersonalPendiente] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [adminInfo, setAdminInfo] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Verificar si hay sesión de admin
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            router.push("/login");
            return;
        }

        const user = JSON.parse(userStr);
        if (user.rol !== "admin") {
            router.push("/login");
            return;
        }

        setAdminEmail(user.email);
        fetchAdminInfo(user.email);
        fetchPersonalPendiente(user.email);
    }, []);

    const fetchAdminInfo = async (email) => {
        try {
            const res = await fetch("/api/auth/me", {
                headers: {
                    Authorization: `Bearer ${email}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setAdminInfo(data);
            }
        } catch (err) {
            console.error("Error al obtener info admin:", err);
        }
    };

    const fetchPersonalPendiente = async (email) => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/pendiente", {
                headers: {
                    Authorization: `Bearer ${email}`,
                },
            });

            if (!res.ok) {
                throw new Error("Error al cargar datos");
            }

            const data = await res.json();
            setPersonalPendiente(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAprobar = async (userId, nombre) => {
        if (!confirm(`¿Aprobar a ${nombre}?`)) return;

        try {
            const res = await fetch("/api/admin/aprobar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminEmail}`,
                },
                body: JSON.stringify({ userId }),
            });

            if (!res.ok) {
                throw new Error("Error al aprobar");
            }

            alert(`${nombre} ha sido aprobado exitosamente`);
            fetchPersonalPendiente(adminEmail);
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    const handleRechazar = async (userId, nombre) => {
        if (!confirm(`¿Rechazar a ${nombre}? Esta acción marcará el usuario como rechazado.`)) return;

        try {
            const res = await fetch("/api/admin/rechazar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminEmail}`,
                },
                body: JSON.stringify({ userId }),
            });

            if (!res.ok) {
                throw new Error("Error al rechazar");
            }

            alert(`${nombre} ha sido rechazado`);
            fetchPersonalPendiente(adminEmail);
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    const handleEliminar = async (userId, nombre) => {
        if (!confirm(`⚠️ ¿ELIMINAR PERMANENTEMENTE a ${nombre}?\n\nEsta acción:
- Borrará al usuario de la base de datos
- Eliminará sus archivos de Cloudinary
- NO SE PUEDE DESHACER\n\n¿Estás seguro?`)) return;

        try {
            const res = await fetch("/api/admin/eliminar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${adminEmail}`,
                },
                body: JSON.stringify({ userId }),
            });

            if (!res.ok) {
                throw new Error("Error al eliminar");
            }

            alert(`${nombre} ha sido eliminado permanentemente`);
            fetchPersonalPendiente(adminEmail);
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        router.push("/login");
    };

    const verDocumento = (url) => {
        if (url) {
            // Corregir URLs de Cloudinary para PDFs
            // Cambiar /image/upload/ a /raw/upload/ si es un PDF
            let fixedUrl = url;
            if (url.includes('.pdf') && url.includes('/image/upload/')) {
                fixedUrl = url.replace('/image/upload/', '/raw/upload/');
            }

            // Abrir tanto PDFs como imágenes en nueva pestaña
            window.open(fixedUrl, "_blank");
        } else {
            alert("Documento no disponible");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-purple-700 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Panel de Administración</h1>
                        <p className="text-purple-200 text-sm">Sistema de Limpieza</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {adminInfo && (
                            <div className="text-right">
                                <p className="font-semibold">{adminInfo.nombre} {adminInfo.apellido}</p>
                                <p className="text-xs text-purple-200">{adminInfo.email}</p>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="bg-purple-600 hover:bg-purple-800 px-4 py-2 rounded transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        ⭐ Panel Admin para aprobar personal
                    </h2>
                    <p className="text-gray-600 mb-2">
                        Revisa y aprueba las solicitudes de personal de limpieza. Verifica sus documentos antes de aprobar.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                        <p className="mt-4 text-gray-600">Cargando...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                ) : personalPendiente.length === 0 ? (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-center">
                        ✓ No hay personal pendiente de aprobación
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        DNI
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Antecedentes
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acción
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {personalPendiente.map((persona) => (
                                    <tr key={persona.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {persona.nombre} {persona.apellido}
                                            </div>
                                            <div className="text-sm text-gray-500">{persona.email}</div>
                                            <div className="text-xs text-gray-400">
                                                {persona.anios_experiencia} años exp. • {persona.zona_cobertura}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => verDocumento(persona.dni_foto_url)}
                                                className="text-purple-600 hover:text-purple-800 font-medium text-sm underline"
                                            >
                                                Ver DNI
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => verDocumento(persona.antecedentes_url)}
                                                className="text-purple-600 hover:text-purple-800 font-medium text-sm underline"
                                            >
                                                Ver Cert.
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                Pendiente
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAprobar(persona.id, persona.nombre)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"
                                                >
                                                    ✓ Aprobar
                                                </button>
                                                <button
                                                    onClick={() => handleRechazar(persona.id, persona.nombre)}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                                                >
                                                    ✗ Rechazar
                                                </button>
                                                <button
                                                    onClick={() => handleEliminar(persona.id, persona.nombre)}
                                                    className="bg-gray-800 hover:bg-black text-white px-3 py-1 rounded transition-colors"
                                                    title="Eliminar permanentemente (usuario + archivos)"
                                                >
                                                    🗑️ Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
