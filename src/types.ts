export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
}

export interface Product {
    id: string;
    name: string;
    type: 'equipamento' | 'epi' | 'tecnologia' | 'outros';
    category: string;
    status: 'available' | 'rented' | 'maintenance';
}

export interface Rental {
    id: string;
    userId: string;
    productId: string;
    startTime: string;
    endTime: string;
    depositPaid: boolean;
    remainingPaid: boolean;
    status: 'active' | 'returned' | 'overdue';
    price: number;
}