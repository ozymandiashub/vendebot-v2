import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: any, res: any) {
    // Simulación de endpoint de auth para deploy
    res.status(200).json({ message: 'Auth endpoint simulado para deploy.' });
}