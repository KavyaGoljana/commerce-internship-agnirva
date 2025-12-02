// Simple unit tests for e-commerce functions
const { 
    calculateSubtotal, 
    calculateTax, 
    calculateTotal,
    filterProducts,
    sortProducts
} = require('./script-helpers'); // You'll need to create this

// Or test inline functions
describe('E-Commerce Functions', () => {
    
    describe('Price Calculations', () => {
        test('calculates subtotal correctly', () => {
            const cart = [
                { price: 100, quantity: 2 },
                { price: 50, quantity: 1 }
            ];
            const result = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            expect(result).toBe(250);
        });

        test('calculates 10% tax correctly', () => {
            const subtotal = 100;
            const tax = subtotal * 0.10;
            expect(tax).toBe(10);
        });
    });

    describe('Product Filtering', () => {
        const products = [
            { name: 'Laptop', price: 1000 },
            { name: 'Mouse', price: 50 },
            { name: 'Keyboard', price: 75 }
        ];

        test('filters by search term', () => {
            const term = 'lap';
            const filtered = products.filter(p => 
                p.name.toLowerCase().includes(term.toLowerCase())
            );
            expect(filtered.length).toBe(1);
            expect(filtered[0].name).toBe('Laptop');
        });

        test('returns empty array for no matches', () => {
            const filtered = products.filter(p => 
                p.name.toLowerCase().includes('xyz')
            );
            expect(filtered).toEqual([]);
        });
    });

    describe('Cart Operations', () => {
        test('adds item to cart', () => {
            const cart = [];
            const product = { id: 1, name: 'Test', price: 100 };
            cart.push(product);
            expect(cart.length).toBe(1);
            expect(cart[0].id).toBe(1);
        });

        test('removes item from cart', () => {
            let cart = [
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' }
            ];
            cart = cart.filter(item => item.id !== 1);
            expect(cart.length).toBe(1);
            expect(cart[0].id).toBe(2);
        });
    });
});