"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SolicitarPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    direccion: "",
    tipo_limpieza: "Profunda",
    fecha: "",
    hora: "",
    notas: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Guardar los datos TEMPORALMENTE (se borra tras usado)
    localStorage.setItem("solicitudPendiente", JSON.stringify(form));
    router.push("/solicitar/seleccionar-personal");
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Solicitar Servicio de Limpieza</h2>
      <form onSubmit={handleSubmit}>
        <input name="direccion" placeholder="Dirección" className="w-full mb-2 p-2 border rounded" onChange={handleChange} required />
        <select name="tipo_limpieza" className="w-full mb-2 p-2 border rounded" onChange={handleChange} value={form.tipo_limpieza}>
          <option value="Profunda">Profunda</option>
          <option value="Ligera">Ligera</option>
          <option value="Desinfección">Desinfección</option>
          <option value="Mantenimiento">Mantenimiento</option>
        </select>
        <input type="date" name="fecha" className="w-full mb-2 p-2 border rounded" onChange={handleChange} required />
        <input type="time" name="hora" className="w-full mb-2 p-2 border rounded" onChange={handleChange} required />
        <textarea name="notas" placeholder="Notas adicionales" className="w-full mb-3 p-2 border rounded" onChange={handleChange} />
        <button type="submit" className="w-full bg-purple-600 text-white rounded py-2 font-bold">Siguiente</button>
      </form>
    </main>
  );
}
