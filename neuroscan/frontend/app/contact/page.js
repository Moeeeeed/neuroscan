"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div className="page-container">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="page-header"
            >
                <span className="section-badge">Contact</span>
                <h1 className="page-title">Get in Touch</h1>
                <p className="page-desc">
                    Have questions or want to collaborate? We'd love to hear from you.
                </p>
            </motion.div>

            <div className="contact-grid">
                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    {sent ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="contact-success"
                        >
                            <CheckCircle size={48} />
                            <h3>Message Sent!</h3>
                            <p>We'll get back to you within 24 hours.</p>
                            <button
                                className="btn-primary"
                                onClick={() => setSent(false)}
                            >
                                Send Another
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input id="name" type="text" placeholder="Dr. Jane Smith" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input id="email" type="email" placeholder="jane@hospital.com" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input id="subject" type="text" placeholder="Partnership inquiry" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    placeholder="Tell us about your project..."
                                    required
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="btn-primary contact-submit"
                            >
                                <Send size={16} /> Send Message
                            </motion.button>
                        </form>
                    )}
                </motion.div>

                {/* Info */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="contact-info"
                >
                    <div className="contact-info-card">
                        <Mail size={20} />
                        <div>
                            <h4>Email</h4>
                            <a href="mailto:hello@neuroscan.ai">hello@neuroscan.ai</a>
                        </div>
                    </div>
                    <div className="contact-info-card">
                        <MapPin size={20} />
                        <div>
                            <h4>Location</h4>
                            <p>Karachi, Pakistan</p>
                        </div>
                    </div>
                    <div className="contact-info-card">
                        <Phone size={20} />
                        <div>
                            <h4>Phone</h4>
                            <a href="tel:+1234567890">+1 (234) 567-890</a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
