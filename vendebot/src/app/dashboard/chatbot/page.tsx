"use client";

import React, { useState, useEffect } from 'react';
import Form from '../../../components/ui/form';
import { Button } from '../../../components/ui/button';

const ChatbotPage = () => {
    const [settings, setSettings] = useState({
        greetingMessage: '',
        responseTime: '',
        active: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Simulación de carga de settings
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setSettings({ greetingMessage: '¡Hola! ¿En qué te ayudo?', responseTime: '5', active: true });
            setLoading(false);
        }, 500);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setTimeout(() => {
            setLoading(false);
            alert('Settings updated successfully!');
        }, 500);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Chatbot Settings</h1>
            <Form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="greetingMessage">Greeting Message</label>
                    <input
                        type="text"
                        id="greetingMessage"
                        name="greetingMessage"
                        value={settings.greetingMessage}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="responseTime">Response Time (seconds)</label>
                    <input
                        type="number"
                        id="responseTime"
                        name="responseTime"
                        value={settings.responseTime}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="active"
                        name="active"
                        checked={settings.active}
                        onChange={handleChange}
                    />
                    <label htmlFor="active">Active</label>
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Settings'}
                </Button>
            </Form>
        </div>
    );
};

export default ChatbotPage;