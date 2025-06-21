import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: any, res: any) {
    // Simulación de endpoint de generación para deploy
    res.status(200).json({ message: 'Endpoint de generación simulado para deploy.' });
}