"use client";

import { useRef } from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function MarketingFooter() {
    const hbTriggerRef = useRef<HTMLDivElement>(null);

    const handleOpenPopup = () => {
        // Trigger the HoneyBook widget by clicking the placement div
        if (hbTriggerRef.current) {
            hbTriggerRef.current.click();
        }
    };

    return (
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
        </footer>
    );
}
