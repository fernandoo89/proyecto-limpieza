// app/admin/dashboard/page.js

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.rol !== "admin") {
      router.push("/usuario/dashboard");
      return;
    }
    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center p-6 bg-teal-100">
        <div>
          <h1 className="text-3xl font-bold text-teal-800">Panel de Administrador</h1>
          <p className="text-sm text-teal-600">Bienvenido, {user.nombre}</p>
        </div>
        <button
          className="px-4 py-2 border rounded text-teal-800 border-teal-500 hover:bg-teal-200 font-semibold"
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </header>
      <main className="max-w-5xl mx-auto mt-8">
        <section className="bg-gradient-to-r from-teal-400 to-teal-600 text-white p-8 rounded-xl text-center mb-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-1">¡Bienvenido Administrador!</h2>
          <p className="mb-2">Rol: Administrador</p>
          <span>Tienes acceso completo al sistema de limpieza</span>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tarjeta: Registrar Personal */}
          <div className="bg-white rounded-xl p-6 text-center shadow hover:shadow-lg transition">
            <span className="block text-5xl mb-4">🧹</span>
            <a
              className="text-teal-700 font-bold text-lg underline"
              href="/admin/registrar-personal"
            >
              Registrar Personal
            </a>
            <p className="text-gray-500 mt-2">Agrega nuevos integrantes a tu equipo de limpieza</p>
          </div>
         
        </div>
      </main>
    </div>
  );
}
