"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function VerificationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("Verificando tu correo...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Token no proporcionado.");
            return;
        }

        const verifyToken = async () => {
            try {
                const res = await fetch(`/api/auth/verificar?token=${token}`);
                const data = await res.json();

                if (res.ok) {
                    setStatus("success");
                    setMessage(data.message);
                    // Redirigir al login después de 3 segundos
                    setTimeout(() => {
                        router.push("/login");
                    }, 3000);
                } else {
                    setStatus("error");
                    setMessage(data.error || "Error al verificar el correo.");
                }
            } catch (error) {
                setStatus("error");
                setMessage("Ocurrió un error inesperado.");
            }
        };

        verifyToken();
    }, [token, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                {status === "verifying" && (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verificando...</h2>
                        <p className="text-gray-600">{message}</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Correo Verificado!</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <p className="text-sm text-gray-500">Redirigiendo al inicio de sesión...</p>
                        <Link href="/login" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            Ir al Login ahora
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error de Verificación</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <Link href="/login" className="text-blue-600 hover:underline">
                            Volver al inicio
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default function VerificationPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <VerificationContent />
        </Suspense>
    );
}
