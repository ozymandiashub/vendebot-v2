import { NextApiRequest, NextApiResponse } from 'next';

export default async function webhook(req: any, res: any) {
    // Simulación de endpoint de webhook para deploy
    res.status(200).json({ message: 'Webhook endpoint simulado para deploy.' });
}