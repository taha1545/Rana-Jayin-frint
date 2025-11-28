'use client';

import { useState } from 'react';
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
    const [sending, setSending] = useState(false);
    //
    const handleSend = async () => {
        if (!input.trim()) return;
        //
        const userMessage = { from: 'user', text: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setSending(true);
        //
        try {
            const response = await fetch('https://chatbot-js-cndg.onrender.com/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage.text }),
            });
            //
            const data = await response.json();
            //
            const botMessageText = Array.isArray(data)
                ? data.map(item => item.content).join(' ')
                : data.content;
            //
            const botMessage = { from: 'bot', text: botMessageText };
            setMessages(prev => [...prev, botMessage]);
            //
        } catch (err) {
            setMessages(prev => [...prev, { from: 'bot', text: "Sorry, something went wrong. || حدث خطا ما" }]);
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            {!isOpen && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className="fixed bottom-4 right-4 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg cursor-pointer"
                    onClick={() => setIsOpen(true)}
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
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b bg-primary text-primary-foreground">
                            <h2 className="text-lg font-semibold">{t('chatbot.title') || 'Chatbot'}</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-primary/80"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            <div className="max-w-[80%] px-3 py-2 rounded-lg text-sm bg-card text-card-foreground self-start">
                                {t('chatbot.greeting')}
                            </div>

                            {/* Dynamic conversation messages */}
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${msg.from === 'user'
                                        ? 'bg-muted text-muted-foreground self-end'
                                        : 'bg-card text-card-foreground self-start'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            ))}

                            {sending && (
                                <div className="text-sm text-muted-foreground">
                                    {t('chatbot.typing') || 'Bot is typing...'}
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t flex gap-2">
                            <input
                                type="text"
                                placeholder={t('chatbot.inputPlaceholder') || 'Type your message...'}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                className="flex-1 border rounded-md p-2 focus:outline-none focus:ring focus:ring-primary/50 bg-background text-foreground"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                            >
                                {t('chatbot.send') || 'Send'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
