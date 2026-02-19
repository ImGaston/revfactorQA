"use client";

import { useRef } from "react";

export function MarketingFooter() {
    const hbTriggerRef = useRef<HTMLDivElement>(null);

    const handleOpenPopup = () => {
        // Trigger the HoneyBook widget by clicking the placement div
        if (hbTriggerRef.current) {
            hbTriggerRef.current.click();
        }
    };

    return (
        <footer className="bg-cedar text-bone py-12 px-4">
            <div className="container max-w-2xl mx-auto text-center">
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

                <h2 className="font-serif text-2xl text-bone">
                    Want to maximize your rental revenue?
                </h2>
                <p className="font-sans text-sm text-bone/70 mt-2">
                    Book a free 30-minute strategy call with RevFactor and find out
                    exactly how much you&apos;re leaving on the table.
                </p>

                <button
                    onClick={handleOpenPopup}
                    className="bg-bone text-cedar font-sans font-bold uppercase tracking-widest text-xs px-8 py-3 rounded-full mt-6 hover:bg-bone/90 transition-all active:scale-95"
                >
                    SCHEDULE A FREE CALL
                </button>
            </div>
        </footer>
    );
}
