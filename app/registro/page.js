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
    rol: "cliente",
    foto_url: "",
    anios_experiencia: "",
    zona_cobertura: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const selectRole = (role) => {
    setForm({ ...form, rol: role });
  };

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
          rol: form.rol,
          foto_url: form.foto_url,
          anios_experiencia: form.anios_experiencia,
          zona_cobertura: form.zona_cobertura,
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded shadow mt-8 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Crear Una Cuenta</h2>

      {/* Selección de Rol */}
      <div className="flex gap-4 mb-6">
        <div
          onClick={() => selectRole("cliente")}
          className={`flex-1 p-4 border rounded cursor-pointer text-center transition-all ${form.rol === "cliente" ? "border-purple-600 bg-purple-50 ring-2 ring-purple-600" : "border-gray-200 hover:border-purple-300"
            }`}
        >
          <div className="text-2xl mb-1">👤</div>
          <div className="font-semibold text-gray-700">Cliente</div>
          <div className="text-xs text-gray-500">Busco limpieza</div>
        </div>
        <div
          onClick={() => selectRole("personal")}
          className={`flex-1 p-4 border rounded cursor-pointer text-center transition-all ${form.rol === "personal" ? "border-purple-600 bg-purple-50 ring-2 ring-purple-600" : "border-gray-200 hover:border-purple-300"
            }`}
        >
          <div className="text-2xl mb-1">🧹</div>
          <div className="font-semibold text-gray-700">Personal</div>
          <div className="text-xs text-gray-500">Quiero trabajar</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          name="nombre"
          placeholder="Nombre"
          className="mb-2 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          onChange={handleChange}
          required
        />
        <input
          name="apellido"
          placeholder="Apellido"
          className="mb-2 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          onChange={handleChange}
          required
        />
      </div>

      <select
        name="tipo_documento"
        className="mb-2 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
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
        className="mb-2 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="mb-2 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
        onChange={handleChange}
        required
      />
      <input
        name="telefono"
        placeholder="Teléfono"
        className="mb-2 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Contraseña"
        className="mb-2 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
        onChange={handleChange}
        required
      />
      <input
        name="password2"
        type="password"
        placeholder="Confirmar contraseña"
        className="mb-2 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
        onChange={handleChange}
        required
      />
      <label className="block text-sm text-gray-600 mb-1">Fecha de Nacimiento</label>
      <input
        name="fecha_nacimiento"
        type="date"
        className="mb-4 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
        onChange={handleChange}
        required
      />

      {/* Campos adicionales SOLO para Personal */}
      {form.rol === "personal" && (
        <div className="bg-purple-50 p-4 rounded-lg mb-4 border border-purple-100">
          <h3 className="font-semibold text-purple-800 mb-2 text-sm">Información Profesional</h3>
          <label className="block text-xs text-gray-600 mb-1">URL de tu Foto (Obligatorio)</label>
          <input
            name="foto_url"
            placeholder="https://ejemplo.com/mifoto.jpg"
            className="mb-2 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Años Experiencia</label>
              <input
                name="anios_experiencia"
                type="number"
                placeholder="Ej: 2"
                className="mb-2 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Zona Cobertura</label>
              <input
                name="zona_cobertura"
                placeholder="Ej: Lima Norte"
                className="mb-2 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
      )}

      {error && <div className="text-red-600 mb-2 p-2 bg-red-50 rounded text-sm border border-red-200">{error}</div>}
      {success && <div className="text-green-600 mb-2 p-2 bg-green-50 rounded text-sm border border-green-200">{success}</div>}
      <button
        disabled={loading}
        className="w-full py-3 bg-purple-600 text-white rounded font-bold hover:bg-purple-700 disabled:bg-gray-400 transition-colors shadow-lg"
      >
        {loading ? "Registrando..." : "Crear Cuenta"}
      </button>
    </form>
  );
}
