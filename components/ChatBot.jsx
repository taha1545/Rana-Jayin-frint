'use client';

import { useState, useRef, useEffect } from 'react';
import { X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

export default function Chatbot() {
    //
    const { t } = useTranslation();
    //
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [streaming, setStreaming] = useState(false);
    //
    const scrollRef = useRef(null);
    //
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages, streaming]);
    //
    const handleSend = async () => {
        if (!input.trim()) return;

        const userText = input.trim();
        setInput('');

        setMessages(prev => [...prev, { from: 'user', text: userText }]);
        setMessages(prev => [...prev, { from: 'bot', text: '' }]);

        setStreaming(true);

        try {
            const res = await fetch('https://chatbot-js-cndg.onrender.com/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText, userTier: 'premium' }),
            });

            if (!res.body) throw new Error('ReadableStream not supported');

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            const readChunk = async () => {
                const { done, value } = await reader.read();
                if (done) {
                    setStreaming(false);
                    return;
                }
                //
                const chunk = decoder.decode(value, { stream: true });
                // 
                const parts = chunk.split('data:').map(p => p.trim()).filter(Boolean);
                for (const part of parts) {
                    try {
                        const obj = JSON.parse(part);
                        if (obj.done) {
                            setStreaming(false);
                            return;
                        }
                        if (obj.content) {
                            fullText += obj.content;
                            setMessages(prev => {
                                const updated = [...prev];
                                const lastBotIndex = [...updated].reverse().findIndex(m => m.from === 'bot');
                                if (lastBotIndex !== -1) {
                                    updated[updated.length - 1 - lastBotIndex].text = fullText;
                                }
                                return updated;
                            });
                        }
                    } catch (e) {
                        console.error('Chunk JSON parse error:', e);
                    }
                }
                readChunk();
            };
            readChunk();
        } catch (e) {
            setMessages(prev => [...prev, { from: 'bot', text: '⚠ Error, please try again.' }]);
            setStreaming(false);
            console.error(e);
        }
    };

    const Typing = () => (
        <motion.div
            className="flex gap-1 px-3 py-2 rounded-lg bg-card shadow w-fit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {[0, 0.2, 0.4].map((delay, i) => (
                <motion.span
                    key={i}
                    className="w-2 h-2 bg-card-foreground rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay }}
                />
            ))}
        </motion.div>
    );

    return (
        <>
            {!isOpen && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-4 right-4 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg cursor-pointer"
                >
                    <MessageSquare className="w-6 h-6 animate-bounce" />
                </motion.div>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed inset-0 z-50 flex flex-col bg-background sm:w-full sm:h-full md:max-w-md md:right-4 md:bottom-4 md:rounded-lg md:border"
                    >
                        <div className="flex justify-between items-center p-4 border-b bg-primary text-primary-foreground">
                            <h2 className="text-lg font-semibold">{t('chatbot.title')}</h2>
                            <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-primary/80">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-[80%] px-3 py-2 rounded-lg text-sm bg-card text-card-foreground shadow">
                                {t('chatbot.greeting')}
                            </motion.div>

                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                    className={`max-w-[80%] px-3 py-2 rounded-lg text-sm shadow leading-relaxed ${msg.from === 'user' ? 'bg-muted text-muted-foreground self-end' : 'bg-card text-card-foreground self-start'
                                        }`}
                                >
                                    {msg.text}
                                </motion.div>
                            ))}

                            {streaming && <Typing />}
                        </div>

                        <div className="p-4 border-t flex gap-2">
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                placeholder={t('chatbot.inputPlaceholder')}
                                className="flex-1 border rounded-md p-2 focus:outline-none focus:ring focus:ring-primary/50 bg-background text-foreground"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                            >
                                {t('chatbot.send')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
