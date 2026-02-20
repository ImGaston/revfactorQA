"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

function HoneyBookModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [widgetKey, setWidgetKey] = useState(0);

    useEffect(() => {
        if (isOpen && typeof window !== "undefined") {
            setWidgetKey((prev) => prev + 1);

            if (window._HB_) delete window._HB_;

            window._HB_ = {};
            window._HB_.pid = "67ba14b91d48d905d8fb0732";

            const script = document.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            script.src =
                "https://widget.honeybook.com/assets_users_production/websiteplacements/placement-controller.min.js";

            const firstScript = document.getElementsByTagName("script")[0];
            if (firstScript?.parentNode) {
                firstScript.parentNode.insertBefore(script, firstScript);
            }
        }
    }, [isOpen]);

    useEffect(() => {
        return () => {
            if (!isOpen && window._HB_) {
                delete window._HB_;
                document
                    .querySelectorAll('script[src*="honeybook.com"]')
                    .forEach((s) => s.remove());
            }
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                    <X className="h-5 w-5 text-gray-600" />
                </button>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="font-serif text-3xl text-cedar mb-2">
                            Schedule a Free Strategy Call
                        </h2>
                        <p className="font-sans text-sm text-gray-600">
                            Complete the form below and we&apos;ll be in touch shortly.
                        </p>
                    </div>

                    {/* HoneyBook inline form */}
                    <div key={widgetKey} className="hb-p-67ba14b91d48d905d8fb0732-1" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        height="1"
                        width="1"
                        style={{ display: "none" }}
                        src="https://www.honeybook.com/p.png?pid=67ba14b91d48d905d8fb0732"
                        alt=""
                    />
                </div>
            </div>
        </div>
    );
}

declare global {
    interface Window {
        _HB_?: { pid?: string };
    }
}

export function MarketingFooter() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <footer className="bg-cedar text-bone py-12 px-4">
            <div className="container max-w-2xl mx-auto text-center">
                <h2 className="font-serif text-2xl text-bone">
                    Want to maximize your rental revenue?
                </h2>
                <p className="font-sans text-sm text-bone/70 mt-2">
                    Book a free 30-minute strategy call with RevFactor and find out
                    exactly how much you&apos;re leaving on the table.
                </p>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-bone text-cedar font-sans font-bold uppercase tracking-widest text-xs px-8 py-3 rounded-full mt-6 hover:bg-bone/90 transition-all active:scale-95"
                >
                    SCHEDULE A FREE CALL
                </button>
        <footer className="bg-cedar text-bone pt-16 pb-8 px-4 border-t border-onyx/10">
            <div className="container max-w-5xl mx-auto">
                {/* HoneyBook Embed Requirements */}
                <div
                    ref={hbTriggerRef}
                    className="hb-p-67ba14b91d48d905d8fb0732-2"
                    style={{ display: "none" }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    height="1"
                    width="1"
                    style={{ display: "none" }}
                    src="https://www.honeybook.com/p.png?pid=67ba14b91d48d905d8fb0732"
                    alt=""
                />

                {/* Main Section: Brand and CTA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-16">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <h3 className="text-3xl font-serif tracking-tight text-bone">RevFactor</h3>
                        </div>
                        <p className="text-base text-bone/70 max-w-md leading-relaxed">
                            Your Short Term Rental is leaving money on the table.
                            We fix that.
                            Revenue management for short-term rental hosts. Flat monthly fee designed to pay for itself — seriously.
                        </p>
                        <div className="flex space-x-5 pt-2">
                            <a href="https://www.linkedin.com/company/revfactor/" target="_blank" className="text-bone/50 hover:text-bone transition-colors"><Linkedin size={20} /></a>
                            <a href="http://instagram.com/revfactor" target="_blank" className="text-bone/50 hover:text-bone transition-colors"><Instagram size={20} /></a>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="space-y-6 md:pl-8 md:border-l border-bone/10 pt-8 md:pt-0 border-t md:border-t-0">
                        <h2 className="font-serif text-2xl md:text-3xl text-bone">
                            Want to maximize your rental revenue?
                        </h2>
                        <p className="font-sans text-sm md:text-base text-bone/70 max-w-sm">
                            Book a free 30-minute strategy call with RevFactor and find out
                            exactly how much you&apos;re leaving on the table.
                        </p>
                        <button
                            onClick={handleOpenPopup}
                            className="bg-bone text-cedar font-sans font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full hover:bg-bone/90 transition-all active:scale-95 shadow-lg w-full sm:w-auto mt-2"
                        >
                            SCHEDULE A FREE CALL
                        </button>
                    </div>
                </div>

                <div className="w-full h-px bg-bone/10 mb-8" />

                {/* Bottom Section: Copyright and Legal */}
                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-bone/50 space-y-4 md:space-y-0">
                    <p>&copy; {new Date().getFullYear()} RevFactor. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <Link href="#" className="hover:text-bone transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-bone transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>

            <HoneyBookModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </footer>
    );
}
