'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from '@/hooks/useTranslation';
import { Mail, Phone, User } from "lucide-react";
import ContactServices from '@/services/ContactServices';

export default function Contact() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await ContactServices.sendMessage(formData);
            if (response?.success) {
                setSuccess("✅✅✅");
                setFormData({ name: '', email: '', message: '' });
            } else {
                setError("❌❌❌");
            }
        } catch (err) {
            setError("❌❌❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full py-10 md:py-20 px-4 bg-secondary dark:bg-gray-900">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-secondary-foreground"
                    >
                        <h2 className="text-4xl font-bold mb-4">{t("contact.title") || "Contact Us"}</h2>
                        <p className="text-secondary-foreground/70 mb-8 text-lg">
                            {t('contact.description') || "Get in touch with us for any questions or assistance you might need."}
                        </p>

                        <div className="space-y-6 mb-8">
                            <div className="flex items-center space-x-4">
                                <Phone className="w-6 h-6 text-primary" />
                                <span className="text-secondary-foreground ltr">{t("contact.phone") || "+1 (234) 567-890"}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Mail className="w-6 h-6 text-primary" />
                                <span className="text-secondary-foreground">{t("contact.email") || "info@example.com"}</span>
                            </div>
                        </div>

                        <div className="w-full h-64 rounded-lg overflow-hidden shadow-md">
                            <iframe
                                title="Bab Ezzouar Map"
                                src="https://www.google.com/maps?q=Bab%20Ezzouar%2C%20Algeria&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-background dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {success && <div className="text-green-600 text-sm">{success}</div>}
                            {error && <div className="text-red-600 text-sm">{error}</div>}

                            <div className="relative">
                                <User className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder={t("contact.form.fullName") || "Full Name"}
                                    className="pl-10 rtl:pl-3 rtl:pr-10 bg-background border border-gray-300 dark:border-gray-700 text-secondary-foreground"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Mail className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder={t("contact.form.email") || "Email Address"}
                                    className="pl-10 rtl:pl-3 rtl:pr-10 bg-background border border-gray-300 dark:border-gray-700 text-secondary-foreground"
                                    required
                                />
                            </div>

                            <Textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder={t("contact.form.message") || "Your Message"}
                                className="bg-background border border-gray-300 dark:border-gray-700 text-secondary-foreground h-40 resize-none"
                                required
                            />

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                            >
                                {loading ? "Sending..." : t("contact.form.send") || "Send Message"}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
