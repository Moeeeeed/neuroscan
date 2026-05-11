"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Menu, X } from "lucide-react";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/solutions", label: "Solutions" },
    { href: "/how-to-use", label: "How to Use" },
    { href: "/docs", label: "Docs" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    return (
        <motion.nav
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}
        >
            <div className="navbar-inner">
                <Link href="/" className="navbar-logo">
                    <div className="navbar-logo-icon">
                        <Brain size={22} />
                    </div>
                    <span className="navbar-logo-text">NeuroScan</span>
                </Link>

                {/* Desktop links */}
                <div className="navbar-links">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`navbar-link ${isActive ? "navbar-link-active" : ""}`}
                            >
                                {link.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        className="navbar-link-indicator"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile toggle */}
                <button
                    className="navbar-toggle"
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="navbar-mobile"
                    >
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`navbar-mobile-link ${isActive ? "navbar-mobile-link-active" : ""}`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
