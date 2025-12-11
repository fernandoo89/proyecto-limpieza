"use client";

import { useState } from 'react';

const FAQS = [
    {
        question: "1. ¿Cómo sé que el personal de limpieza está verificado?",
        answer: "Todo nuestro personal pasa por un proceso de verificación que incluye revisión de DNI, antecedentes policiales y validación manual. Solo quienes cumplen con todos los requisitos pueden ofrecer servicios en la plataforma."
    },
    {
        question: "2. ¿Qué pasa si no estoy satisfecho con el servicio?",
        answer: "Después de cada limpieza, puedes calificar al personal y dejar un comentario. Si tu experiencia no fue satisfactoria, nuestro equipo de soporte evaluará el caso y tomará las medidas necesarias, incluyendo reembolsos o sanciones."
    },
    {
        question: "3. ¿Qué métodos de pago aceptan?",
        answer: "Aceptamos pagos con tarjeta de débito/crédito, Yape, Plin y efectivo. El pago se procesa de forma segura y solo se libera al finalizar el servicio."
    },
    {
        question: "4. ¿Puedo elegir al personal que vendrá a mi casa?",
        answer: "Sí. La app te mostrará perfiles disponibles en tu zona, con sus calificaciones, experiencia y horarios. Tú decides a quién contratar."
    },
    {
        question: "5. ¿Qué tipo de limpieza puedo solicitar?",
        answer: "Puedes elegir entre limpieza básica, profunda, por horas o por ambientes específicos (cocina, baño, etc.). También puedes dejar instrucciones personalizadas al momento de hacer la solicitud."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
                    <p className="text-gray-600">Resolvemos tus dudas principales para que confíes plenamente en nosotros.</p>
                </div>

                <div className="space-y-4">
                    {FAQS.map((faq, idx) => (
                        <div
                            key={idx}
                            className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === idx ? 'border-purple-500 shadow-md ring-1 ring-purple-100' : 'border-gray-200 hover:border-purple-200'
                                }`}
                        >
                            <button
                                onClick={() => toggleFAQ(idx)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <h3 className={`font-semibold text-lg transition-colors ${openIndex === idx ? 'text-purple-700' : 'text-gray-900'}`}>
                                    {faq.question}
                                </h3>
                                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${openIndex === idx ? 'bg-purple-100 text-purple-600 rotate-180' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>

                            <div
                                className={`transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
