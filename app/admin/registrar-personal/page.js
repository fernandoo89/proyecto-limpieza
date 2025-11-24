"use client";
import { useState } from "react";

export default function RegistrarPersonal() {
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
    foto_url: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.password !== form.password2) {
      setError("Las contraseñas no coinciden");
      return;
    }
    const res = await fetch("/api/personal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.error) setError(data.error);
    else {
      setSuccess("¡Personal registrado correctamente!");
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Registrar nuevo personal de limpieza</h2>
      <input name="nombre" placeholder="Nombre" className="mb-2 w-full p-2 border rounded" onChange={handleChange} required />
      <input name="apellido" placeholder="Apellido" className="mb-2 w-full p-2 border rounded" onChange={handleChange} required />
      <select name="tipo_documento" className="mb-2 w-full p-2 border rounded" onChange={handleChange} required>
        <option value="">Tipo de documento</option>
        <option value="DNI">DNI</option>
        <option value="CE">Carnet Extranjería</option>
        <option value="Pasaporte">Pasaporte</option>
      </select>
      <input name="numero_documento" placeholder="Número de documento" className="mb-2 w-full p-2 border rounded" onChange={handleChange} required />
      <input name="fecha_nacimiento" type="date" placeholder="Fecha de nacimiento" className="mb-2 w-full p-2 border rounded" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Correo electrónico" className="mb-2 w-full p-2 border rounded" onChange={handleChange} required />
      <input name="telefono" placeholder="Teléfono" className="mb-2 w-full p-2 border rounded" onChange={handleChange} required />
      <input name="foto_url" placeholder="URL de foto de perfil" className="mb-2 w-full p-2 border rounded" onChange={handleChange} />
      <input name="password" type="password" placeholder="Contraseña" className="mb-2 w-full p-2 border rounded" onChange={handleChange} required />
      <input name="password2" type="password" placeholder="Confirmar contraseña" className="mb-4 w-full p-2 border rounded" onChange={handleChange} required />
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <button className="w-full py-2 bg-teal-600 text-white rounded font-bold">Registrar personal</button>
    </form>
  );
}
