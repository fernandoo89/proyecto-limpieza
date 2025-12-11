"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    anios_experiencia: "",
    zona_cobertura: "",
    nombre_titular: "",
    numero_tarjeta: "",
    fecha_vencimiento: "",
    cvc: "",
  });
  const [files, setFiles] = useState({
    dni_foto: null,
    antecedentes: null,
    foto_perfil: null,
  });
  const [filePreviews, setFilePreviews] = useState({
    dni_foto: null,
    antecedentes: null,
    foto_perfil: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const selectRole = (role) => {
    setForm({ ...form, rol: role });
    if (role === "cliente") {
      setFiles({ dni_foto: null, antecedentes: null, foto_perfil: null });
      setFilePreviews({ dni_foto: null, antecedentes: null, foto_perfil: null });
    }
  };

  const validateFileType = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    return allowedTypes.includes(file.type);
  };

  const validateFileSize = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize;
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateFileType(file)) {
      setError(`Tipo de archivo no válido. Solo se permiten: JPG, JPEG, PNG`);
      e.target.value = "";
      return;
    }

    if (!validateFileSize(file)) {
      setError(`El archivo excede el tamaño máximo de 5MB`);
      e.target.value = "";
      return;
    }

    setError("");
    setFiles({ ...files, [fieldName]: file });

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviews((prev) => ({ ...prev, [fieldName]: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreviews((prev) => ({ ...prev, [fieldName]: "pdf" }));
    }
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

    if (form.rol === "personal" && parseInt(form.anios_experiencia) < 0) {
      setError("Los años de experiencia no pueden ser negativos");
      setLoading(false);
      return;
    }

    if (form.rol === "personal") {
      if (!files.dni_foto || !files.antecedentes || !files.foto_perfil) {
        setError("Debe subir la foto de perfil, DNI y el certificado de antecedentes");
        setLoading(false);
        return;
      }
    }

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));

      if (form.rol === "personal") {
        formData.append("dni_foto", files.dni_foto);
        formData.append("antecedentes", files.antecedentes);
        formData.append("foto_perfil", files.foto_perfil);
      }

      const res = await fetch("/api/auth/registro", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al registrar");
        setLoading(false);
        return;
      }

      setSuccess(
        form.rol === "personal"
          ? "¡Registro exitoso! Tu cuenta está pendiente de aprobación. Redirigiendo..."
          : "¡Usuario creado correctamente! Redirigiendo..."
      );

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError("Error de conexión: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-slate-900 opacity-90"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-2">Crear una Cuenta</h2>
            <p className="text-blue-100">Únete a nuestra plataforma de servicios de confianza</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 lg:p-10">

          {/* Selección de Rol */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-3 text-center">Selecciona tu perfil</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <div
                onClick={() => selectRole("cliente")}
                className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-4 ${form.rol === "cliente"
                    ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
              >
                <div className={`p-3 rounded-full ${form.rol === "cliente" ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Cliente</div>
                  <div className="text-xs text-slate-500">Busco servicios de limpieza</div>
                </div>
                {form.rol === "cliente" && (
                  <div className="absolute top-3 right-3 text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              <div
                onClick={() => selectRole("personal")}
                className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-4 ${form.rol === "personal"
                    ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                  }`}
              >
                <div className={`p-3 rounded-full ${form.rol === "personal" ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Personal</div>
                  <div className="text-xs text-slate-500">Quiero trabajar con ustedes</div>
                </div>
                {form.rol === "personal" && (
                  <div className="absolute top-3 right-3 text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-gray-100 pb-2">Información Personal</h3>
              <div className="grid grid-cols-2 gap-4">
                <input name="nombre" placeholder="Nombre" className="input-field" onChange={handleChange} required />
                <input name="apellido" placeholder="Apellido" className="input-field" onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <select name="tipo_documento" className="input-field col-span-1" onChange={handleChange} required>
                  <option value="">Doc</option>
                  <option value="DNI">DNI</option>
                  <option value="CE">CE</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
                <input name="numero_documento" placeholder="Nro Documento" className="input-field col-span-2" onChange={handleChange} required />
              </div>
              <input name="fecha_nacimiento" type="date" className="input-field" onChange={handleChange} required />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-gray-100 pb-2">Datos de Cuenta</h3>
              <input name="email" type="email" placeholder="Correo Electrónico" className="input-field" onChange={handleChange} required />
              <input name="telefono" placeholder="Teléfono" className="input-field" onChange={handleChange} required />

              <div className="relative">
                <input name="password" type={showPassword ? "text" : "password"} placeholder="Contraseña" className="input-field" onChange={handleChange} required />
              </div>
              <div className="relative">
                <input name="password2" type={showPassword ? "text" : "password"} placeholder="Confirmar Contraseña" className="input-field" onChange={handleChange} required />
              </div>

              <div className="flex items-center mt-2">
                <input type="checkbox" id="showPass" className="w-4 h-4 text-blue-600 rounded border-gray-300"
                  onChange={() => setShowPassword(!showPassword)} checked={showPassword} />
                <label htmlFor="showPass" className="ml-2 text-sm text-slate-600 cursor-pointer">Mostrar contraseñas</label>
              </div>
            </div>
          </div>

          {/* Campos adicionales para Personal */}
          {form.rol === "personal" && (
            <div className="mt-8 bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
              <h3 className="flex items-center gap-2 font-semibold text-indigo-900 mb-4 text-lg">
                <span className="text-xl">💼</span> Perfil Profesional
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-indigo-800 mb-2 uppercase">Foto de Perfil</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer bg-white border border-indigo-200 hover:border-indigo-400 rounded-lg p-3 text-center transition">
                      <span className="text-sm text-indigo-600 font-medium">Subir Foto</span>
                      <input type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={(e) => handleFileChange(e, "foto_perfil")} required />
                    </label>
                    {filePreviews.foto_perfil && <img src={filePreviews.foto_perfil} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-indigo-800 mb-1">Experiencia (Años)</label>
                    <input name="anios_experiencia" type="number" min="0" placeholder="0" className="input-field bg-white" onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-indigo-800 mb-1">Zona</label>
                    <input name="zona_cobertura" placeholder="Ej: Lima" className="input-field bg-white" onChange={handleChange} required />
                  </div>
                </div>
              </div>

              <h4 className="font-semibold text-indigo-900 mb-3 text-sm flex items-center gap-2 border-t border-indigo-200 pt-4">
                💳 Datos de Cobro (Simulación)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input name="nombre_titular" placeholder="Titular de la tarjeta" className="input-field bg-white" onChange={handleChange} required />
                <input name="numero_tarjeta" placeholder="Número de Tarjeta" className="input-field bg-white" onChange={handleChange} required />
                <div className="grid grid-cols-2 gap-4">
                  <input name="fecha_vencimiento" placeholder="MM/YY" className="input-field bg-white" onChange={handleChange} required />
                  <input name="cvc" placeholder="CVC" className="input-field bg-white" onChange={handleChange} required />
                </div>
              </div>

              <h4 className="font-semibold text-indigo-900 mb-3 text-sm flex items-center gap-2 border-t border-indigo-200 pt-4">
                📄 Documentación
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Foto DNI</label>
                  <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, "dni_foto")}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200" />

                  {filePreviews.dni_foto && <p className="text-xs text-green-600 mt-1">✓ Archivo cargado</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Antecedentes</label>
                  <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleFileChange(e, "antecedentes")}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200" />
                  {filePreviews.antecedentes && <p className="text-xs text-green-600 mt-1">✓ Archivo cargado</p>}
                </div>
              </div>
            </div>
          )}

          {error && <div className="mt-6 text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg text-sm text-center font-medium">{error}</div>}
          {success && <div className="mt-6 text-green-600 bg-green-50 border border-green-100 p-3 rounded-lg text-sm text-center font-medium">{success}</div>}

          <div className="mt-8">
            <button disabled={loading} className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transform transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 ${form.rol === 'personal' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-500' : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:ring-blue-500'} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {loading ? "Procesando..." : `Crear Cuenta de ${form.rol === 'cliente' ? 'Cliente' : 'Personal'}`}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            ¿Ya tienes una cuenta? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Inicia Sesión</Link>
          </p>

        </form>
      </div>

      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          color: #334155;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .input-field:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  );
}
