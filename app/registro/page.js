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
    // foto_url ya no se usa como string directo del input, se usará para enviar la url si existe o se manejará el archivo
    anios_experiencia: "",
    zona_cobertura: "",
    // Campos de tarjeta
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
    // Limpiar archivos si cambia de personal a cliente
    if (role === "cliente") {
      setFiles({ dni_foto: null, antecedentes: null, foto_perfil: null });
      setFilePreviews({ dni_foto: null, antecedentes: null, foto_perfil: null });
    }
  };

  // Validar tipo de archivo
  const validateFileType = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    return allowedTypes.includes(file.type);
  };

  // Validar tamaño de archivo (max 5MB)
  const validateFileSize = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize;
  };

  // Manejar cambio de archivo
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo
    if (!validateFileType(file)) {
      setError(`Tipo de archivo no válido. Solo se permiten: JPG, JPEG, PNG`);
      e.target.value = "";
      return;
    }

    // Validar tamaño
    if (!validateFileSize(file)) {
      setError(`El archivo excede el tamaño máximo de 5MB`);
      e.target.value = "";
      return;
    }

    setError("");
    setFiles({ ...files, [fieldName]: file });

    // Crear preview si es imagen
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviews({ ...filePreviews, [fieldName]: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreviews({ ...filePreviews, [fieldName]: "pdf" });
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

    // Validar años de experiencia (no negativos) para personal
    if (form.rol === "personal" && parseInt(form.anios_experiencia) < 0) {
      setError("Los años de experiencia no pueden ser negativos");
      setLoading(false);
      return;
    }

    // Validar archivos para personal
    if (form.rol === "personal") {
      if (!files.dni_foto || !files.antecedentes || !files.foto_perfil) {
        setError("Debe subir la foto de perfil, DNI y el certificado de antecedentes");
        setLoading(false);
        return;
      }
    }

    try {
      // Crear FormData
      const formData = new FormData();
      formData.append("nombre", form.nombre);
      formData.append("apellido", form.apellido);
      formData.append("tipo_documento", form.tipo_documento);
      formData.append("numero_documento", form.numero_documento);
      formData.append("email", form.email);
      formData.append("telefono", form.telefono);
      formData.append("password", form.password);
      formData.append("fecha_nacimiento", form.fecha_nacimiento);
      formData.append("rol", form.rol);
      // formData.append("foto_url", form.foto_url); // Ya no se envía URL manual
      formData.append("anios_experiencia", form.anios_experiencia);
      formData.append("zona_cobertura", form.zona_cobertura);

      // Agregar datos de tarjeta si es personal
      if (form.rol === "personal") {
        formData.append("nombre_titular", form.nombre_titular);
        formData.append("numero_tarjeta", form.numero_tarjeta);
        formData.append("fecha_vencimiento", form.fecha_vencimiento);
        formData.append("cvc", form.cvc);
      }

      // Agregar archivos si es personal
      if (form.rol === "personal") {
        formData.append("dni_foto", files.dni_foto);
        formData.append("antecedentes", files.antecedentes);
        formData.append("foto_perfil", files.foto_perfil);
      }

      const res = await fetch("/api/auth/registro", {
        method: "POST",
        body: formData, // No establecer Content-Type, el navegador lo hace automáticamente
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al registrar");
        setLoading(false);
        return;
      }

      if (form.rol === "personal") {
        setSuccess(
          "¡Registro exitoso! Tu cuenta está pendiente de aprobación por un administrador. Redirigiendo..."
        );
      } else {
        setSuccess("¡Usuario creado correctamente! Redirigiendo...");
      }

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError("Error de conexión: " + err.message);
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-8 rounded shadow mt-8 mb-8"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
        Crear Una Cuenta
      </h2>

      {/* Selección de Rol */}
      <div className="flex gap-4 mb-6">
        <div
          onClick={() => selectRole("cliente")}
          className={`flex-1 p-4 border rounded cursor-pointer text-center transition-all ${form.rol === "cliente"
            ? "border-purple-600 bg-purple-50 ring-2 ring-purple-600"
            : "border-gray-200 hover:border-purple-300"
            }`}
        >
          <div className="text-2xl mb-1">👤</div>
          <div className="font-semibold text-gray-700">Cliente</div>
          <div className="text-xs text-gray-500">Busco limpieza</div>
        </div>
        <div
          onClick={() => selectRole("personal")}
          className={`flex-1 p-4 border rounded cursor-pointer text-center transition-all ${form.rol === "personal"
            ? "border-purple-600 bg-purple-50 ring-2 ring-purple-600"
            : "border-gray-200 hover:border-purple-300"
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
      <div className="mb-2 relative">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-2 relative">
        <input
          name="password2"
          type={showPassword ? "text" : "password"}
          placeholder="Confirmar contraseña"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="showPasswordReg"
          className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        />
        <label
          htmlFor="showPasswordReg"
          className="text-sm text-gray-600 cursor-pointer select-none"
        >
          Mostrar contraseña
        </label>
      </div>
      <label className="block text-sm text-gray-600 mb-1">
        Fecha de Nacimiento
      </label>
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
          <h3 className="font-semibold text-purple-800 mb-2 text-sm">
            Información Profesional
          </h3>
          <label className="block text-xs text-gray-600 mb-1">
            foto de perfil(Obligatorio)
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(e, "foto_perfil")}
            className="mb-2 w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer"
            required
          />
          {filePreviews.foto_perfil && (
            <div className="mb-3">
              <img
                src={filePreviews.foto_perfil}
                alt="Preview Perfil"
                className="w-24 h-24 object-cover rounded-full border-2 border-purple-200"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Años Experiencia
              </label>
              <input
                name="anios_experiencia"
                type="number"
                placeholder="Ej: 2"
                className="mb-2 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                onChange={handleChange}
                min="0"
                title="Los años de experiencia no pueden ser negativos"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Zona Cobertura
              </label>
              <input
                name="zona_cobertura"
                placeholder="Ej: Lima Norte"
                className="mb-2 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Datos de Tarjeta (Simulación) */}
          <div className="mt-4 border-t pt-4 mb-4">
            <h4 className="font-semibold text-purple-800 mb-3 text-sm flex items-center gap-2">
              💳 Datos de Tarjeta (Simulación)
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Nombre del Titular
                </label>
                <input
                  name="nombre_titular"
                  placeholder="Como aparece en la tarjeta"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Número de Tarjeta
                </label>
                <input
                  name="numero_tarjeta"
                  placeholder="0000 0000 0000 0000"
                  maxLength="19"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Vencimiento (MM/YY)
                  </label>
                  <input
                    name="fecha_vencimiento"
                    placeholder="MM/YY"
                    maxLength="5"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    CVC
                  </label>
                  <input
                    name="cvc"
                    placeholder="123"
                    maxLength="4"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subida de Documentos */}
          <div className="mt-4 border-t pt-4">
            <h4 className="font-semibold text-purple-800 mb-3 text-sm">
              📄 Documentos Requeridos
            </h4>

            {/* DNI Foto */}
            <div className="mb-3">
              <label className="block text-xs text-gray-700 mb-1 font-medium">
                Foto de DNI *
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, "dni_foto")}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer"
                required
              />
              {filePreviews.dni_foto && (
                <div className="mt-2">
                  {filePreviews.dni_foto === "pdf" ? (
                    <div className="text-xs text-green-600 flex items-center">
                      <span className="mr-1">✓</span> PDF cargado
                    </div>
                  ) : (
                    <img
                      src={filePreviews.dni_foto}
                      alt="Preview DNI"
                      className="w-24 h-24 object-cover rounded border"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Certificado de Antecedentes */}
            <div className="mb-2">
              <label className="block text-xs text-gray-700 mb-1 font-medium">
                Certificado de Antecedentes *
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => handleFileChange(e, "antecedentes")}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer"
                required
              />
              {filePreviews.antecedentes && (
                <div className="mt-2">
                  {filePreviews.antecedentes === "pdf" ? (
                    <div className="text-xs text-green-600 flex items-center">
                      <span className="mr-1">✓</span> PDF cargado
                    </div>
                  ) : (
                    <img
                      src={filePreviews.antecedentes}
                      alt="Preview Antecedentes"
                      className="w-24 h-24 object-cover rounded border"
                    />
                  )}
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Formatos permitidos: JPG, JPEG, PNG (máx. 5MB)
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-600 mb-2 p-2 bg-red-50 rounded text-sm border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-600 mb-2 p-2 bg-green-50 rounded text-sm border border-green-200">
          {success}
        </div>
      )}
      <button
        disabled={loading}
        className="w-full py-3 bg-purple-600 text-white rounded font-bold hover:bg-purple-700 disabled:bg-gray-400 transition-colors shadow-lg"
      >
        {loading ? "Registrando..." : "Crear Cuenta"}
      </button>
    </form>
  );
}
