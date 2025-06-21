import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // Simulación de datos para deploy
        return res.status(200).json([
            { id: 1, title: 'Ventas', value: 10, trend: '+5%' },
            { id: 2, title: 'Respuestas automáticas', value: 120, trend: '+12%' },
            { id: 3, title: 'Clientes activos', value: 8, trend: '+1' }
        ]);
    }
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}