"use client";

import { useState, useEffect, useRef } from 'react';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [messages, setMessages] = useState<Array<{ type: 'bot' | 'user', text: string }>>([]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const toggleChat = () => {
        if (!isOpen && messages.length === 0) {
            // Initialize chat with welcome message
            setMessages([
                { type: 'bot', text: "¡Hola! 👋 Bienvenido a PeruLimpio." },
                { type: 'bot', text: "¿En qué podemos ayudarte hoy?" }
            ]);
        }
        setIsOpen(!isOpen);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // Add user message
        const userMsg = inputValue;
        setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
        setInputValue("");

        // Simulate bot response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                type: 'bot',
                text: "Gracias por escribirnos. Un asesor se conectará contigo en breve a través de WhatsApp para continuar la conversación."
            }]);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Chat Window */}
            {isOpen && (
                <div className="w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300 mb-2">
                    {/* Header */}
                    <div className="bg-[#075E54] p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold backdrop-blur-sm">
                                    P
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#075E54] rounded-full"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Soporte PeruLimpio</h3>
                                <p className="text-xs text-green-100">En línea</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="h-[350px] bg-[#E5DDD5] p-4 overflow-y-auto flex flex-col gap-3">
                        <div className="text-center text-xs text-gray-500 my-2 bg-yellow-50 py-1 px-2 rounded-lg self-center shadow-sm">
                            🔒 Los mensajes están cifrados de extremo a extremo
                        </div>

                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`max-w-[80%] p-3 rounded-lg text-sm shadow-sm relative ${msg.type === 'user'
                                        ? 'bg-[#DCF8C6] self-end rounded-tr-none'
                                        : 'bg-white self-start rounded-tl-none'
                                    }`}
                            >
                                {msg.text}
                                <div className="text-[10px] text-gray-400 text-right mt-1">
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Escribe un mensaje..."
                            className="flex-1 bg-gray-100 text-sm px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-[#075E54]/20"
                        />
                        <button
                            onClick={handleSend}
                            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${inputValue.trim() ? 'bg-[#075E54] text-white hover:bg-[#128C7E]' : 'bg-gray-200 text-gray-400'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>

                    {/* WhatsApp Direct Link */}
                    <a
                        href="https://wa.me/51999999999"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center py-2 bg-gray-50 text-xs text-[#128C7E] font-medium hover:underline border-t border-gray-100"
                    >
                        ¿Prefieres hablar por WhatsApp oficial? Clic aquí
                    </a>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={toggleChat}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-16 h-16 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 relative group"
            >
                <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>

                {/* Tooltip or Badge for attention */}
                {(!isOpen) && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
            </button>

            {/* Tooltip Text */}
            {isHovered && !isOpen && (
                <div className="absolute right-20 bottom-4 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg animate-in fade-in slide-in-from-right-2">
                    ¿Necesitas ayuda? Chatea aquí
                </div>
            )}
        </div>
    );
}
