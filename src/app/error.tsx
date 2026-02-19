'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-bone/30 flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-4">
                <h2 className="font-serif text-3xl text-cedar">Something went wrong</h2>
                <p className="text-onyx/60 max-w-md mx-auto">
                    We apologized for the inconvenience. Please try again.
                </p>
                <Button
                    onClick={reset}
                    className="bg-cedar hover:bg-cedar/90 text-bone uppercase rounded-full font-bold tracking-widest text-xs px-6 py-2"
                >
                    Try again
                </Button>
            </div>
        </div>
    );
}
