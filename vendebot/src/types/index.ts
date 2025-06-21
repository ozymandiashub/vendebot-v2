export interface User {
    id: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Description {
    id: string;
    productId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatbotMessage {
    id: string;
    userId: string;
    content: string;
    createdAt: Date;
}

export interface AnalyticsData {
    totalUsers: number;
    totalSales: number;
    totalProducts: number;
    salesByDate: Record<string, number>;
}