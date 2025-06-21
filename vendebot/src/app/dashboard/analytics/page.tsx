"use client";

import React from 'react';
import { useEffect, useState } from 'react';
import { MetricCard } from '../../../components/ui/card';

const AnalyticsPage = () => {
    const [analyticsData, setAnalyticsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulación de datos para deploy
        setAnalyticsData([
            { id: 1, title: 'Ventas', value: 10, trend: '+5%' },
            { id: 2, title: 'Respuestas automáticas', value: 120, trend: '+12%' },
            { id: 3, title: 'Clientes activos', value: 8, trend: '+1' }
        ]);
        setLoading(false);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Analytics</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analyticsData.map((item) => (
                    <MetricCard key={item.id} title={item.title} value={item.value} trend={item.trend} />
                ))}
            </div>
        </div>
    );
};

export default AnalyticsPage;