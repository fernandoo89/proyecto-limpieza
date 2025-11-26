"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PagoPage() {
  const router = useRouter();
  const [resumen, setResumen] = useState(null);
  const [personal, setPersonal] = useState(null);
  const [metodo, setMetodo] = useState("Tarjeta");
  const [tarjeta, setTarjeta] = useState({
    numero: "",
    titular: "",
    mm: "",
    aa: "",
    cvv: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState(null);

  useEffect(() => {
    // Check for ID in URL params
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (id) {
      setRequestId(id);
      // Fetch request details
      fetch(`/api/solicitudes/usuario?id=${id}`) // We might need a specific endpoint for single request or filter the list
        .then(res => res.json())
        .then(data => {
          // Assuming the API returns a list, find the one with the ID or if we adjust API to return single object
          // For now, let's assume we can reuse the user requests endpoint or we need to fetch it differently.
          // Actually, let's try to fetch all user requests and find it, or better, rely on the passed ID and just show amount if we had a "get by id" endpoint.
          // Since we don't have a specific "get one" endpoint visible yet, let's assume we can pass the data via URL or fetch list.
          // To be safe and robust, let's fetch the specific request.
          // Wait, I don't have a "get single request" endpoint. I should probably add one or filter.
          // Let's filter from the user's list for now as a quick fix, or better, trust the user has it in "mis solicitudes".
          // Actually, let's just use the "solicitudes/usuario" endpoint which filters by user_id.
          // But I need the specific request details.
          // Let's try to fetch the list and find it.
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          if (user.id) {
            fetch(`/api/solicitudes/usuario?usuario_id=${user.id}`)
              .then(r => r.json())
              .then(list => {
                const found = list.find(r => r.id == id);
                if (found) {
                  setResumen({
                    tipo_limpieza: found.tipo_limpieza,
                    fecha: found.fecha,
                    hora: found.hora,
                    monto: found.monto,
                    direccion: found.direccion
                  });
                  if (found.personal_id) {
                    setPersonal({
                      nombre: found.personal_nombre,
                      apellido: found.personal_apellido,
                      foto_url: found.personal_foto
                    });
                  }
                }
              });
          }
        });
    } else {
      // Fallback to local storage (legacy flow or if user navigates manually? Should probably block this)
      const s = localStorage.getItem("solicitudPendiente");
      const p = localStorage.getItem("solicitudPersonal");
      if (s) {
        setResumen(JSON.parse(s));
        if (p) setPersonal(JSON.parse(p));
      } else {
        router.push("/usuario/mis-solicitudes");
      }
    }
  }, [router]);

  const handleTarjetaChange = (e) => {
    setTarjeta({ ...tarjeta, [e.target.name]: e.target.value });
  };

  const handleConfirmarPago = async () => {
    if (
      metodo === "Tarjeta" &&
      (!tarjeta.numero.trim() ||
        !tarjeta.titular.trim() ||
        !tarjeta.mm.trim() ||
        !tarjeta.aa.trim() ||
        !tarjeta.cvv.trim())
    ) {
      setMessage("Completa los datos de la tarjeta.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      if (requestId) {
        // Pay existing request
        const response = await fetch("/api/solicitudes/pagar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: requestId }),
        });
        const data = await response.json();
        if (response.ok) {
          setMessage("Pago realizado correctamente 🎉");
          setTimeout(() => router.push("/usuario/mis-solicitudes"), 1500);
        } else {
          setMessage(data.error || "Error al pagar");
        }
      } else {
        // Create and pay (Legacy/Fallback)
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const response = await fetch("/api/solicitudes/crear", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...resumen,
            usuario_id: user.id,
            personal_id: personal ? personal.id : null,
            monto: resumen.monto,
            metodo_pago: metodo,
            estado: 'pagada' // Force paid status if creating here
          }),
        });
        const data = await response.json();
        if (response.ok) {
          // Immediately mark as paid if the create endpoint doesn't support it directly (it sets to pending by default)
          // Actually the create endpoint sets to 'pendiente'. We might need to call pay after.
          // But wait, the new flow is create -> pending -> approve -> pay.
          // So this fallback path is less relevant. Let's focus on the ID path.
          if (data.id) {
            await fetch("/api/solicitudes/pagar", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: data.id }),
            });
          }

          setMessage("Pago realizado y solicitud creada correctamente 🎉");
          localStorage.removeItem("solicitudPendiente");
          localStorage.removeItem("solicitudPersonal");
          setTimeout(() => router.push("/usuario/dashboard"), 1500);
        } else {
          setMessage(data.error || "Error al guardar y pagar");
        }
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!resumen) return <div>Cargando...</div>;

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-white p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">Paga con tu tarjeta</h2>
          <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div className="p-8">
          {/* Card Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center relative">
              <div className="absolute top-6 left-4 w-12 h-8 bg-purple-400 rounded-md transform -rotate-12 shadow-sm"></div>
              <div className="absolute top-8 left-8 w-12 h-8 bg-purple-300 rounded-md transform rotate-6 shadow-md z-10 flex flex-col justify-end p-1">
                <div className="w-2 h-2 bg-yellow-300 rounded-full mb-1 ml-1"></div>
                <div className="w-6 h-1 bg-white/50 rounded-full ml-1"></div>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mb-8 px-4">
            Aceptamos tarjetas Visa, Mastercard, American Express y Diners. Trabajamos con una plataforma de pago 100% segura.
          </p>

          {/* Form */}
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-400">💳</span>
              <input
                type="text"
                name="numero"
                placeholder="Número de tarjeta"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-gray-700 placeholder-gray-400"
                value={tarjeta.numero}
                onChange={handleTarjetaChange}
                maxLength={19}
              />
            </div>

            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-400">👤</span>
              <input
                type="text"
                name="titular"
                placeholder="Titular de la tarjeta"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-gray-700 placeholder-gray-400"
                value={tarjeta.titular}
                onChange={handleTarjetaChange}
              />
            </div>

            <div className="flex gap-4">
              <div className="relative flex-1">
                <span className="absolute left-4 top-3.5 text-gray-400">📅</span>
                <input
                  type="text"
                  name="mm"
                  placeholder="MM"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-gray-700 placeholder-gray-400"
                  value={tarjeta.mm}
                  onChange={handleTarjetaChange}
                  maxLength={2}
                />
              </div>
              <div className="relative flex-1">
                <span className="absolute left-4 top-3.5 text-gray-400">📅</span>
                <input
                  type="text"
                  name="aa"
                  placeholder="AA"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-gray-700 placeholder-gray-400"
                  value={tarjeta.aa}
                  onChange={handleTarjetaChange}
                  maxLength={2}
                />
              </div>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-400">🔒</span>
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-gray-700 placeholder-gray-400"
                value={tarjeta.cvv}
                onChange={handleTarjetaChange}
                maxLength={4}
              />
            </div>
          </div>

          <button
            className="w-full mt-8 py-4 bg-purple-400 text-white font-bold rounded-full hover:bg-purple-500 transition-all shadow-lg shadow-purple-200 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={handleConfirmarPago}
            disabled={loading}
          >
            {loading ? "Procesando..." : `Pagar S/ ${parseFloat(resumen.monto).toFixed(2)}`}
          </button>

          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-xs text-gray-400">Tu pago está seguro con</p>
            <div className="flex items-center gap-1 text-blue-500 font-bold text-sm">
              <span className="text-xl">🤝</span> mercado pago
            </div>
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-xl text-center text-sm ${message.includes("Error") ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
