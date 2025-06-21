import React from 'react';

const featuresData = [
    {
        title: 'Generador de Descripciones AI',
        description: 'Crea descripciones optimizadas para tus productos en MercadoLibre con solo subir una foto y especificaciones básicas.',
    },
    {
        title: 'Chatbot Ventas 24/7',
        description: 'Atiende a tus clientes en cualquier momento con un chatbot amigable que responde preguntas y cierra ventas automáticamente.',
    },
    {
        title: 'Análisis de Competencia',
        description: 'Monitorea precios, productos trending y estrategias de tus competidores para mantenerte siempre un paso adelante.',
    },
    {
        title: 'Optimización de Precios',
        description: 'Ajusta tus precios en tiempo real basándote en la demanda y competencia para maximizar tus ganancias.',
    },
];

const Features: React.FC = () => {
    return (
        <section className="features">
            <h2 className="text-2xl font-bold mb-4">Características Destacadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuresData.map((feature, index) => (
                    <div key={index} className="feature-card p-4 border rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                        <p className="mt-2">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;