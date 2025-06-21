import React from 'react';

const pricingPlans = [
    {
        name: 'Freemium',
        price: 'Free',
        features: [
            '10 AI-generated descriptions per month',
            'Basic chatbot functionality',
            'Access to community support'
        ],
    },
    {
        name: 'Basic',
        price: '$19.990 CLP/month',
        features: [
            '100 AI-generated descriptions per month',
            'Basic WhatsApp chatbot',
            'Competitor analysis for 5 products'
        ],
    },
    {
        name: 'Professional',
        price: '$49.990 CLP/month',
        features: [
            '500 AI-generated descriptions per month',
            'Multichannel chatbot',
            'Comprehensive analytics',
            'MercadoLibre API access'
        ],
    },
    {
        name: 'Enterprise',
        price: '$149.990 CLP/month',
        features: [
            'Unlimited AI-generated descriptions',
            'Advanced AI chatbot',
            'ERP/CRM integration',
            'Dedicated account manager'
        ],
    },
];

const Pricing = () => {
    return (
        <section className="pricing-section">
            <h2 className="text-2xl font-bold mb-4">Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {pricingPlans.map((plan) => (
                    <div key={plan.name} className="border rounded-lg p-4 shadow-lg">
                        <h3 className="text-xl font-semibold">{plan.name}</h3>
                        <p className="text-lg font-bold">{plan.price}</p>
                        <ul className="mt-2">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="text-sm">{feature}</li>
                            ))}
                        </ul>
                        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                            Select Plan
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Pricing;