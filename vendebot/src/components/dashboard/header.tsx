import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-gray-900">VendeBot Dashboard</h1>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <nav className="space-x-4">
                            <a href="/dashboard" className="text-gray-500 hover:text-gray-900">Dashboard</a>
                            <a href="/dashboard/products" className="text-gray-500 hover:text-gray-900">Products</a>
                            <a href="/dashboard/chatbot" className="text-gray-500 hover:text-gray-900">Chatbot</a>
                            <a href="/dashboard/analytics" className="text-gray-500 hover:text-gray-900">Analytics</a>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;