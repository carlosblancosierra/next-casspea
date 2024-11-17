export interface CartItem {
    id: number;
    quantity: number;
    product_data: {
        id: number;
        name: string;
        price: number;
    };
}

export interface Cart {
    id: number;
    items: CartItem[];
    total: number;
}
