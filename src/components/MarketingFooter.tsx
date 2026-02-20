"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

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
            </div>

            <HoneyBookModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </footer>
    );
}
