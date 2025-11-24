"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Registro() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    tipo_documento: "",
    numero_documento: "",
    email: "",
    telefono: "",
    password: "",
    password2: "",
    fecha_nacimiento: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (form.password !== form.password2) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          tipo_documento: form.tipo_documento,
          numero_documento: form.numero_documento,
          email: form.email,
          telefono: form.telefono,
          password: form.password,
          fecha_nacimiento: form.fecha_nacimiento,
        }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Error al registrar");
        setLoading(false);
        return;
      }

      setSuccess("¡Usuario creado correctamente! Redirigiendo...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError("Error de conexión: " + err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Crear Una Cuenta</h2>
      <input 
        name="nombre" 
        placeholder="Nombre" 
        className="mb-2 w-full p-2 border rounded" 
        onChange={handleChange} 
        required 
      />
      <input 
        name="apellido" 
        placeholder="Apellido" 
        className="mb-2 w-full p-2 border rounded" 
        onChange={handleChange} 
        required 
      />
      <select 
        name="tipo_documento" 
        className="mb-2 w-full p-2 border rounded" 
        onChange={handleChange} 
        required
      >
        <option value="">Tipo de documento</option>
        <option value="DNI">DNI</option>
        <option value="CE">Carnet Extranjería</option>
        <option value="Pasaporte">Pasaporte</option>
      </select>
      <input 
        name="numero_documento" 
        placeholder="Nro. de documento" 
        className="mb-2 w-full p-2 border rounded" 
        onChange={handleChange} 
        required 
      />
      <input 
        name="email" 
        type="email" 
        placeholder="Email" 
        className="mb-2 w-full p-2 border rounded" 
        onChange={handleChange} 
        required 
      />
      <input 
        name="telefono" 
        placeholder="Teléfono" 
        className="mb-2 w-full p-2 border rounded" 
        onChange={handleChange} 
        required 
      />
      <input 
        name="password" 
        type="password" 
        placeholder="Contraseña" 
        className="mb-2 w-full p-2 border rounded" 
        onChange={handleChange} 
        required 
      />
      <input 
        name="password2" 
        type="password" 
        placeholder="Confirmar contraseña" 
        className="mb-2 w-full p-2 border rounded" 
        onChange={handleChange} 
        required 
      />
      <input 
        name="fecha_nacimiento" 
        type="date" 
        placeholder="Fecha de nacimiento" 
        className="mb-4 w-full p-2 border rounded" 
        onChange={handleChange} 
        required 
      />
      {error && <div className="text-red-600 mb-2 p-2 bg-red-50 rounded">{error}</div>}
      {success && <div className="text-green-600 mb-2 p-2 bg-green-50 rounded">{success}</div>}
      <button 
        disabled={loading}
        className="w-full py-2 bg-purple-600 text-white rounded font-bold hover:bg-purple-700 disabled:bg-gray-400"
      >
        {loading ? "Registrando..." : "Aceptar"}
      </button>
    </form>
  );
}
