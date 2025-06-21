"use client";

import React, { useEffect, useState } from 'react';
import LegacyCard from '../../../components/ui/card';

const ProductsPage = () => {
    const [products, setProducts] = useState<any[]>([
        { id: 1, title: 'Producto 1', description: 'Descripción del producto 1' },
        { id: 2, title: 'Producto 2', description: 'Descripción del producto 2' }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Simulación de carga
    // useEffect(() => {
    //     setLoading(true);
    //     setTimeout(() => {
    //         setProducts([
    //             { id: 1, title: 'Producto 1', description: 'Descripción del producto 1' },
    //             { id: 2, title: 'Producto 2', description: 'Descripción del producto 2' }
    //         ]);
    //         setLoading(false);
    //     }, 500);
    // }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="products-page">
            <h1 className="text-2xl font-bold mb-4">Manage Your Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product: any) => (
                    <LegacyCard key={product.id} title={product.title} description={product.description} />
                ))}
            </div>
        </div>
    );
};

export default ProductsPage;