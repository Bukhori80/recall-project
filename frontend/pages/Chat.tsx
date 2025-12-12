import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useLanguage } from '../contexts/LanguageContext';

// --- Interfaces ---
interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
    type?: 'text' | 'data-card'; // Tipe pesan untuk menampilkan UI khusus
    data?: any; // Data tambahan jika type='data-card'
}

const Chat: React.FC = () => {
    const backendUrl = import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:3001';
    // Pastikan Anda sudah membuat API Key di Google AI Studio dan menambahkannya ke .env
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const navigate = useNavigate();
    const { translations, language } = useLanguage(); // Tambahkan language agar refresh saat ganti bahasa

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Inisialisasi Pesan Awal (Reset jika bahasa berubah)
    useEffect(() => {
        setMessages([
            {
                id: '1',
                role: 'model',
                content: translations.chat.initialMessage,
                type: 'text'
            }
        ]);
    }, [translations, language]);

    // Auto scroll ke bawah
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    // --- 1. FUNGSI "AGENTIC": EKSEKUSI AKSI ---
    const handleAgentAction = async (actionCode: string) => {
        const token = localStorage.getItem('accessToken');
        const customerId = localStorage.getItem('customer_id');

        switch (actionCode) {
            case 'CHECK_USAGE':
                if (!token || !customerId) return "Silakan login terlebih dahulu untuk melihat data.";
                try {
                    const res = await fetch(`${backendUrl}/api/v1/customers/${customerId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();

                    // Tambahkan pesan kartu data ke chat
                    const usageMsg: Message = {
                        id: Date.now().toString(),
                        role: 'model',
                        content: "Berikut adalah ringkasan data profil Anda:",
                        type: 'data-card',
                        data: {
                            quota: data.data.profile.avg_data_usage_gb,
                            spend: data.data.profile.monthly_spend,
                            plan: data.data.plan_type
                        }
                    };
                    setMessages(prev => [...prev, usageMsg]);
                    return "Apakah ada hal lain yang ingin ditanyakan mengenai paket Anda?";
                } catch (e) {
                    return "Maaf, saya gagal mengambil data profil Anda saat ini.";
                }

            case 'GO_TO_RECOMMENDATION':
                setTimeout(() => navigate('/recommendation'), 1500); // Delay sedikit biar user baca chat dulu
                return "Baik, saya akan mengarahkan Anda ke halaman rekomendasi...";

            case 'GO_TO_PACKAGES':
                setTimeout(() => navigate('/categories'), 1500);
                return "Membuka katalog paket untuk Anda...";

            default:
                return null;
        }
    };

    // --- 2. LOGIKA KIRIM PESAN KE GEMINI ---
    const handleSend = async (textOverride?: string) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim()) return;

        if (!geminiApiKey) {
            alert("API Key Gemini belum dipasang");
            return;
        }

        // Tambahkan pesan user ke UI
        const userMessage: Message = { id: Date.now().toString(), role: 'user', content: textToSend };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const genAI = new GoogleGenerativeAI(geminiApiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-robotics-er-1.5-preview" });

            // A. System Prompt Engineering (Instruksi Agen)
            const username = localStorage.getItem('username') || 'Pelanggan';
            const systemPrompt = `
          Kamu adalah asisten AI ramah untuk aplikasi Telco bernama "Recall".
          Nama user: ${username}.
          Bahasa saat ini: ${language === 'id' ? 'Indonesia' : 'Inggris'}.
          
          Instruksi:
          1. Jawab singkat, ramah, dan membantu.
          2. PENTING: Jika user bertanya tentang sisa kuota, pemakaian data, atau profil, akhiri jawabanmu dengan tag: [ACTION:CHECK_USAGE]
          3. PENTING: Jika user ingin rekomendasi paket baru, prediksi churn, atau saran paket, akhiri jawabanmu dengan tag: [ACTION:GO_TO_RECOMMENDATION]
          4. PENTING: Jika user ingin melihat daftar produk/paket, akhiri jawabanmu dengan tag: [ACTION:GO_TO_PACKAGES]
          
          Jangan buat data palsu. Gunakan tag ACTION untuk mengambil data asli.
        `;

            const prompt = `${systemPrompt}\n\nUser: ${textToSend}\nAI:`;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            // C. Deteksi Action Tag di respons AI
            let cleanText = responseText;

            // Logika routing aksi
            if (responseText.includes('[ACTION:CHECK_USAGE]')) {
                cleanText = responseText.replace('[ACTION:CHECK_USAGE]', '');
                // Jalankan aksi async, lalu tambahkan balasan tambahannya jika ada
                await handleAgentAction('CHECK_USAGE');
            } else if (responseText.includes('[ACTION:GO_TO_RECOMMENDATION]')) {
                cleanText = responseText.replace('[ACTION:GO_TO_RECOMMENDATION]', '');
                const navMsg = await handleAgentAction('GO_TO_RECOMMENDATION');
                if (navMsg) cleanText += `\n${navMsg}`;
            } else if (responseText.includes('[ACTION:GO_TO_PACKAGES]')) {
                cleanText = responseText.replace('[ACTION:GO_TO_PACKAGES]', '');
                const navMsg = await handleAgentAction('GO_TO_PACKAGES');
                if (navMsg) cleanText += `\n${navMsg}`;
            }

            // Tampilkan balasan teks AI
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: cleanText.trim()
            };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Gemini Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                content: "Maaf, sedang ada gangguan pada server AI. Silakan coba lagi nanti."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // List Aksi Cepat (Dari file asli Anda, diintegrasikan kembali)
    const quickActions = [
        { label: translations.chat.actions.checkBest, action: "Berikan rekomendasi paket terbaik untuk saya" },
        { label: translations.chat.actions.analyze, action: "Cek profil dan penggunaan data saya" },
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 dark:bg-background-dark"> {/* Adjusted height logic */}

            {/* Header Chat */}
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-card-dark border-b border-slate-200 dark:border-border-dark shadow-sm">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary relative">
                    <span className="material-symbols-outlined">smart_toy</span>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-card-dark rounded-full"></div>
                </div>
                <div>
                    <h2 className="font-bold text-slate-900 dark:text-white">{translations.chat.botName}</h2>
                    <p className="text-xs text-slate-500 dark:text-gray-400">Powered by Gemini AI</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
                        <div className={`max-w-[85%] lg:max-w-[70%] p-4 rounded-2xl shadow-sm ${msg.role === 'user'
                                ? 'bg-primary text-white rounded-br-none'
                                : 'bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-200 rounded-bl-none border border-slate-100 dark:border-gray-700'
                            }`}>
                            {/* Teks Biasa (Markdown-like simple rendering) */}
                            {msg.content && (
                                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                            )}

                            {/* UI Khusus: Data Card (Hasil dari Agent Action) */}
                            {msg.type === 'data-card' && msg.data && (
                                <div className="mt-3 bg-slate-50 dark:bg-gray-900 p-3 rounded-xl border border-slate-200 dark:border-gray-700">
                                    <div className="flex items-center gap-2 mb-3 border-b border-slate-200 dark:border-gray-700 pb-2">
                                        <span className="material-symbols-outlined text-primary text-sm">analytics</span>
                                        <span className="font-bold text-xs uppercase text-slate-500 tracking-wider">Live Data</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-xs text-slate-400">Rata-rata Kuota</p>
                                            <p className="font-bold text-slate-800 dark:text-white">{msg.data.quota} GB</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400">Pengeluaran</p>
                                            <p className="font-bold text-slate-800 dark:text-white">Rp {msg.data.spend.toLocaleString('id-ID')}</p>
                                        </div>
                                        <div className="col-span-2 pt-1">
                                            <p className="text-xs text-slate-400">Tipe Plan</p>
                                            <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded uppercase">
                                                {msg.data.plan}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-none border border-slate-100 dark:border-gray-700 flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></div>
                            <span className="text-xs text-slate-400 ml-1">{translations.chat.typing}</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Footer: Quick Actions & Input */}
            <div className="p-4 bg-white dark:bg-card-dark border-t border-slate-200 dark:border-border-dark lg:mb-0 mb-16"> {/* mb-16 for mobile nav spacing */}

                {/* Quick Actions (Horizontal Scroll) */}
                <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                    {quickActions.map((qa, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSend(qa.action)}
                            disabled={isLoading}
                            className="flex-shrink-0 px-4 py-2 text-xs font-medium rounded-full bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all whitespace-nowrap"
                        >
                            {qa.label}
                        </button>
                    ))}
                </div>

                {/* Input Bar */}
                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={translations.chat.inputPlaceholder}
                        disabled={isLoading}
                        className="flex-1 h-12 pl-5 pr-12 rounded-full border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
                    />
                    <button
                        onClick={() => handleSend()}
                        className="absolute right-1.5 top-1.5 w-9 h-9 flex items-center justify-center bg-primary text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95"
                        disabled={!input.trim() || isLoading}
                    >
                        <span className="material-symbols-outlined text-lg">send</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;