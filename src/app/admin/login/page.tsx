'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                setError('Incorrect password');
            }
        } catch (_err) {
            console.error(_err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bone/30 flex flex-col items-center pt-20 px-4">
            <div className="mb-8 text-center">
                <h1 className="font-serif text-4xl font-bold text-cedar tracking-tight">
                    RevFactor
                </h1>
                <p className="text-onyx/50 text-sm font-medium uppercase tracking-widest mt-2">
                    Admin Access
                </p>
            </div>

            <Card className="w-full max-w-sm bg-white border-onyx/10 shadow-sm">
                <CardHeader>
                    <CardTitle className="font-sans text-lg text-center text-onyx">
                        Enter Password
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="text-center tracking-widest"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-destructive text-sm text-center font-medium animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading || !password}
                            className="w-full bg-cedar hover:bg-cedar/90 text-bone uppercase font-sans font-bold tracking-widest text-xs py-2"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Access"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
