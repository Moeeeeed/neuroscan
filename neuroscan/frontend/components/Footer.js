"use client";

import Link from "next/link";
import { Brain, Github, Mail, Heart } from "lucide-react";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <Brain size={20} />
                            <span>NeuroScan</span>
                        </div>
                        <p className="footer-desc">
                            Explainable deep learning for brain tumor MRI classification.
                            Empowering clinicians with AI-driven diagnostics.
                        </p>
                    </div>

                    {/* Product */}
                    <div className="footer-col">
                        <h4>Product</h4>
                        <Link href="/">Home</Link>
                        <Link href="/solutions">Solutions</Link>
                        <Link href="/how-to-use">How to Use</Link>
                        <Link href="/docs">Documentation</Link>
                    </div>

                    {/* Company */}
                    <div className="footer-col">
                        <h4>Company</h4>
                        <Link href="/about">About Us</Link>
                        <Link href="/contact">Contact</Link>
                    </div>

                    {/* Legal */}
                    <div className="footer-col">
                        <h4>Legal</h4>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>
                        &copy; {year} NeuroScan Diagnostic Assistant. Built with{" "}
                        <Heart size={14} className="footer-heart" /> for better healthcare.
                    </p>
                    <div className="footer-social">
                        <a href="#" aria-label="GitHub">
                            <Github size={18} />
                        </a>
                        <a href="#" aria-label="Email">
                            <Mail size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
