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

  useEffect(() => {
    const s = localStorage.getItem("solicitudPendiente");
    const p = localStorage.getItem("solicitudPersonal");
    if (!s || !p) {
      router.push("/solicitar");
      return;
    }
    setResumen(JSON.parse(s));
    setPersonal(JSON.parse(p));
  }, [router]);

  const handleTarjetaChange = (e) => {
    setTarjeta({ ...tarjeta, [e.target.name]: e.target.value });
  };

  const handleConfirmarPago = async () => {
    // Simulación: solo validamos campos localmente
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
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await fetch("/api/solicitudes/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...resumen,
          usuario_id: user.id,
          personal_id: personal.id,
          metodo_pago: metodo, // lo puedes guardar si agregas el campo en la BD
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Pago realizado y solicitud creada correctamente 🎉");
        localStorage.removeItem("solicitudPendiente");
        localStorage.removeItem("solicitudPersonal");
        setTimeout(() => router.push("/usuario/dashboard"), 1500);
      } else {
        setMessage(data.error || "Error al guardar y pagar");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!resumen || !personal) return <div>Cargando...</div>;

  return (
    <main className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Confirmar servicio</h2>
      <div className="bg-white shadow rounded p-6 mb-6">
        <div className="mb-2"><b>Resumen:</b></div>
        <div>
          {resumen.tipo_limpieza} - {personal.nombre} {personal.apellido} - {resumen.fecha} {resumen.hora}
        </div>
        <div className="my-3 text-xl"><b>Costo estimado</b></div>
        <div className="text-3xl font-bold mb-4">S/ {resumen.monto}</div>
        <div className="mb-3"><b>Método de pago</b></div>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {["Tarjeta", "Yape"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMetodo(m)}
              className={`border rounded p-2 flex flex-col items-center ${metodo === m ? "bg-purple-100 border-purple-500" : "bg-gray-50"}`}
            >
              {m}
            </button>
          ))}
        </div>
        {/* Formulario SIMULADO SOLO si elige "Tarjeta" */}
        {metodo === "Tarjeta" && (
          <div className="rounded bg-violet-50 border p-4 mb-3">
            <p className="mb-2 text-center">Aceptamos tarjetas Visa, Mastercard, AMEX y Diners.</p>
            <input
              type="text"
              name="numero"
              placeholder="Número de tarjeta"
              className="w-full mb-2 p-2 rounded border"
              value={tarjeta.numero}
              onChange={handleTarjetaChange}
              maxLength={19}
            />
            <input
              type="text"
              name="titular"
              placeholder="Titular de la tarjeta"
              className="w-full mb-2 p-2 rounded border"
              value={tarjeta.titular}
              onChange={handleTarjetaChange}
            />
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                name="mm"
                placeholder="MM"
                className="w-1/2 p-2 rounded border"
                value={tarjeta.mm}
                onChange={handleTarjetaChange}
                maxLength={2}
              />
              <input
                type="text"
                name="aa"
                placeholder="AA"
                className="w-1/2 p-2 rounded border"
                value={tarjeta.aa}
                onChange={handleTarjetaChange}
                maxLength={2}
              />
            </div>
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              className="w-full mb-2 p-2 rounded border"
              value={tarjeta.cvv}
              onChange={handleTarjetaChange}
              maxLength={4}
            />
          </div>
        )}
        <button
          className="w-full py-3 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 transition"
          onClick={handleConfirmarPago}
          disabled={loading}
        >
          {loading ? "Procesando..." : metodo === "Tarjeta" ? `Pagar S/ ${resumen.monto}` : "Confirmar pago"}
        </button>
        <button
          className="w-full py-2 mt-3 border rounded text-purple-700 hover:bg-purple-50"
          onClick={() => router.push("/solicitar/confirmar")}
        >
          Cancelar
        </button>
        {message && <div className="mt-3 p-2 bg-gray-100 text-center rounded">{message}</div>}
      </div>
    </main>
  );
}
