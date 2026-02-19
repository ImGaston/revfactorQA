import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (password === adminPassword) {
            cookies().set('rf_admin', adminPassword!, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                // Set expiry for 1 day
                maxAge: 60 * 60 * 24
            });

            return NextResponse.json({ ok: true });
        }

        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
