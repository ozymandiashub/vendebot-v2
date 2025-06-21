import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Rutas públicas que no requieren autenticación
    const publicApiRoutes = [
        '/api/chatbot/webhook',
        '/api/chatbot/test',
        '/api/auth',
        '/api/health'
    ];

    const publicRoutes = [
        '/',
        '/auth/login',
        '/auth/register'
    ];

    // Verificar si es una ruta API pública
    const isPublicApiRoute = publicApiRoutes.some(route => 
        pathname.startsWith(route)
    );

    // Verificar si es una ruta pública
    const isPublicRoute = publicRoutes.some(route => 
        pathname === route || pathname.startsWith(route)
    );

    // Solo verificar autenticación en rutas protegidas del dashboard
    if (pathname.startsWith('/dashboard')) {
        // En desarrollo, permitir acceso sin autenticación estricta
        if (process.env.NODE_ENV === 'development') {
            return NextResponse.next();
        }
        
        // En producción, verificar token (esto se puede mejorar con NextAuth.js)
        const token = req.cookies.get('auth-token');
        if (!token) {
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }
    }

    // Solo verificar autenticación en APIs protegidas
    if (pathname.startsWith('/api') && !isPublicApiRoute) {
        const token = req.cookies.get('auth-token');
        if (!token && process.env.NODE_ENV === 'production') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/api/:path*'],
};