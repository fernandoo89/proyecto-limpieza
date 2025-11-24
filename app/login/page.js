"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.error) {
      setError(data.error);
    } else {
      // Guarda datos del usuario en localStorage
      localStorage.setItem("user", JSON.stringify(data));
      
      // Redirige según rol
      if (data.rol === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/usuario/dashboard");
      }
    }
  };

  // Placeholder para Google/Facebook (integración real después)
  const loginWithGoogle = () => alert("Google login próximamente");
  const loginWithFacebook = () => alert("Facebook login próximamente");

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
      
      <button
        type="button"
        className="w-full mb-2 py-2 bg-white border border-gray-500 text-gray-800 rounded font-bold"
        onClick={loginWithGoogle}
      >
        Ingresa con Google
      </button>
      <div className="my-4 border-b" />
      <input name="email" type="email" placeholder="Email" className="mb-2 w-full p-2 border rounded" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Contraseña" className="mb-4 w-full p-2 border rounded" onChange={handleChange} required />
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button className="w-full py-2 mb-2 bg-purple-600 text-white rounded font-bold">Iniciar sesión</button>
      <button type="button"
        className="w-full py-2 border border-purple-600 text-purple-600 rounded font-bold mb-2"
        onClick={() => router.push("/registro")}
      >
        Regístrate
      </button>
      <a href="#" className="text-sm text-purple-600 block text-center mb-2">¿Olvidaste tu contraseña?</a>
      <p className="text-xs text-gray-500 text-center mt-2">
        Al hacer uso de la plataforma, aceptas los <a href="#" className="underline">Términos y condiciones</a>
      </p>
    </form>
  );
}
