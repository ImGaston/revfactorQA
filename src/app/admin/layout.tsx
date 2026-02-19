"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const handleLogout = () => {
        // Clear the cookie by setting max-age to 0
        document.cookie = "rf_admin=; path=/; max-age=0";
        router.push("/admin/login");
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-bone font-sans">
            <header className="bg-white border-b border-onyx/10 sticky top-0 z-50">
                <div className="container max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="font-serif text-xl font-bold text-cedar tracking-tight">
                        revfactor admin
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-onyx/60 hover:text-cedar hover:bg-bone/50 gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </header>
            <main className="container max-w-5xl mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
