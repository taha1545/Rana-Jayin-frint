"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from '@/hooks/useTranslation';
import { Mail, Phone, MapPin, User } from "lucide-react";

export default function Contact() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <section className="w-full py-20 px-4 bg-secondary dark:bg-gray-900">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left - Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-secondary-foreground"
                    >
                        <h2 className="text-4xl font-bold mb-4">
                            {t("contact.title") || "Contact Us"}
                        </h2>
                        <p className="text-secondary-foreground/70 mb-8 text-lg">
                            {"Get in touch with us for any questions or assistance you might need."}
                        </p>

                        {/* Contact Information */}
                        <div className="space-y-6 mb-8">
                            <div className="flex items-center space-x-4">
                                <Phone className="w-6 h-6 text-primary" />
                                <span className="text-secondary-foreground">
                                    {t("contact.phone") || "+1 (234) 567-890"}
                                </span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Mail className="w-6 h-6 text-primary" />
                                <span className="text-secondary-foreground">
                                    {t("contact.email") || "info@example.com"}
                                </span>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                            <div className="text-center text-secondary-foreground/60">
                                <MapPin className="w-12 h-12 mx-auto mb-2 text-primary" />
                                <p className="text-sm font-medium">Interactive Map</p>
                                <p className="text-xs text-secondary-foreground/50">San Francisco, CA</p>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex space-x-4 mt-6">
                            {["f", "in", "📷"].map((icon, idx) => (
                                <div
                                    key={idx}
                                    className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors duration-200 cursor-pointer font-bold text-sm"
                                >
                                    {icon}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-background dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6 ">
                            {/* Name */}
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder={t("contact.form.fullName") || "Full Name"}
                                    className="pl-10 bg-background border border-gray-300 dark:border-gray-700 text-secondary-foreground"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder={t("contact.form.email") || "Email Address"}
                                    className="pl-10 bg-background border border-gray-300 dark:border-gray-700 text-secondary-foreground"
                                    required
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <Textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder={t("contact.form.message") || "Your Message"}
                                    className="bg-background border border-gray-300 dark:border-gray-700 text-secondary-foreground h-58 resize-none"
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                            >
                                {t("contact.form.send") || "Send Message"}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
