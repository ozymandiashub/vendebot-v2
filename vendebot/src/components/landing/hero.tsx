import React from 'react';

const Hero: React.FC = () => {
    return (
        <div className="hero-container">
            <h1 className="hero-title">Bienvenido a VendeBot</h1>
            <p className="hero-subtitle">La solución inteligente para tus ventas en línea.</p>
            <div className="hero-buttons">
                <a href="/auth/register" className="btn btn-primary">Comienza Gratis</a>
                <a href="/auth/login" className="btn btn-secondary">Iniciar Sesión</a>
            </div>
        </div>
    );
};

export default Hero;