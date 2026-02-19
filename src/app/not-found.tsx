import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-bone/30 flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-4">
                <h2 className="font-serif text-4xl text-cedar">404</h2>
                <p className="text-xl text-onyx/80">Page Not Found</p>
                <p className="text-onyx/60 max-w-md mx-auto pb-4">
                    The page you are looking for does not exist or has been moved.
                </p>
                <Button
                    asChild
                    className="bg-cedar hover:bg-cedar/90 text-bone uppercase rounded-full font-bold tracking-widest text-xs px-6 py-2"
                >
                    <Link href="/">Return Home</Link>
                </Button>
            </div>
        </div>
    );
}
