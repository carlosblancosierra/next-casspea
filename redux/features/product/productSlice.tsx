// slices/productSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductType } from '@/types/products';
import { RootState } from '@/redux/store';

interface ProductState {
    products: ProductType[];
}

const initialState: ProductState = {
    products: [
        {
            name: 'Premiun, Handmade Chocolate Gift Box, 9 pieces',
            name_short: '9 Piece Box',
            price: "14.99",
            slug: 'box-9',
            category: {
                name: 'Signature Boxes',
                slug: 'gift-boxes',
                short: 'Gift Boxes',
            },
            store_image: 'https://casspea-static-eu.s3-accelerate.amazonaws.com/static/box-size-img/1/CassPea-Chocolate-51.jpg',
            images: ['/box-9-2.jpg'],
            description: 'Our box of 9 offers an amazing sample of our flavours. You can select your own flavours, or permit us to make the box for you, with some of our favourites.',
            weight: "135",
            color: 'pink',
            pieces: '9',
            id: 1,
        },
        {
            name: 'Premiun, Handmade Chocolate Gift Box, 15 pieces',
            name_short: '15 Piece Box',
            price: "24.99",
            slug: 'box-15',
            category: {
                name: 'Signature Boxes',
                slug: 'gift-boxes',
                short: 'Gift Boxes',
            },
            store_image: 'https://casspea-static-eu.s3-accelerate.amazonaws.com/static/box-size-img/2/CassPea-Chocolate-52_copy.jpg',
            images: ['/box-15-color.png'],
            description: 'Our box of 15 offers an amazing sample of our flavours. You can select your own flavours, or permit us to make the box for you, with some of our favourites.',
            weight: "250",
            color: 'blue',
            pieces: '15',
            id: 2,
        },
        {
            name: 'Premiun, Handmade Chocolate Gift Box, 24 pieces',
            name_short: '24 Piece Box',
            price: "34.99",
            slug: 'box-24',
            category: {
                name: 'Signature Boxes',
                slug: 'gift-boxes',
                short: 'Gift Boxes',
            },
            store_image: 'https://casspea-static-eu.s3-accelerate.amazonaws.com/static/box-size-img/3/CassPea-Chocolate-54.jpg',
            images: ['/box-24-color.png'],
            description: 'Our box of 24 offers an amazing sample of our flavours. You can select your own flavours, or permit us to make the box for you, with some of our favourites.',
            weight: "400",
            color: 'green',
            pieces: '24',
            id: 3,
        },
        {
            name: 'Premiun, Handmade Chocolate Gift Box, 48 pieces',
            name_short: '48 Piece Box',
            price: "49.99",
            slug: 'box-48',
            category: {
                name: 'Signature Boxes',
                slug: 'gift-boxes',
                short: 'Gift Boxes',
            },
            store_image: 'https://casspea-static-eu.s3-accelerate.amazonaws.com/static/box-size-img/4/CassPea-Chocolate-53.jpg',
            images: ['/box-48-color.png'],
            description: 'Our box of 48 offers an amazing sample of our flavours. You can select your own flavours, or permit us to make the box for you, with some of our favourites.',
            weight: "800",
            color: 'purple',
            pieces: '48',
            id: 4,
        },
        {
            name: 'Popping Hazelnuts',
            name_short: 'Popping Hazelnuts',
            price: "6.50",
            slug: 'popping-hazelnuts',
            category: {
                name: 'Snacks',
                slug: 'snacks',
                short: 'Snacks',
            },
            store_image: 'https://casspea-static-eu.s3-accelerate.amazonaws.com/static/product-img/4/blue_pouch_1.jpg',
            images: ['https://casspea-static-eu.s3-accelerate.amazonaws.com/static/product-img/4/blue_pouch_1.jpg'],
            description: 'A play on the traditional hazelnuts covered in a Colombian dark milk chocolate with 40% cacao. This creation is sure to bring out your inner child.',
            weight: "100",
            color: 'blue',
            pieces: '1',
            id: 5,
        },
        {
            name: 'Crunchy Cinnamon Cookies',
            name_short: 'Crunchy Cinnamon Cookies',
            price: "6.50",
            slug: 'crunchy-cinnamon-cookies',
            category: {
                name: 'Snacks',
                slug: 'snacks',
                short: 'Snacks',
            },
            store_image: 'https://casspea-static-eu.s3-accelerate.amazonaws.com/static/product-img/None/orange_pouch.jpg',
            images: ['https://casspea-static-eu.s3-accelerate.amazonaws.com/static/product-img/None/orange_pouch.jpg'],
            description: 'A crunchy cinnamon cookie covered in white chocolate. Absolutely amazing during those cold days we know only too well!.',
            weight: "100",
            color: 'purple',
            pieces: '1',
            id: 6,
        },
        {
            name: 'Tropical Island Snack',
            name_short: 'Crunchy Cinnamon Cookies',
            price: "6.50",
            slug: 'crunchy-cinnamon-cookies',
            category: {
                name: 'Snacks',
                slug: 'snacks',
                short: 'Snacks',
            },
            store_image: 'https://casspea-static-eu.s3-accelerate.amazonaws.com/static/product-img/2/yellow-pouch.jpg',
            images: ['https://casspea-static-eu.s3-accelerate.amazonaws.com/static/product-img/2/yellow-pouch.jpg'],
            description: 'Indulge in this passionfruit and Mango gelatine with Yoghurt. It has a sweet and tangy flavour that will surely transport you to a Tropical paradise',
            weight: "100",
            color: 'purple',
            pieces: '1',
            id: 7,
        },
        {
            name: 'Luxury Festive Advent Calendar Box Of 24 Chocolates',
            name_short: 'Advent Calendar',
            price: "40.00",
            slug: 'advent-calendar',
            category: {
                name: 'Advent Calendar',
                slug: 'advent-calendar',
                short: 'Advent Calendar',
            },
            store_image: 'https://casspea-static-eu.s3-accelerate.amazonaws.com/static/box-size-img/5/CassPea-2023-JDPIX-2.jpg',
            images: ['https://casspea-static-eu.s3-accelerate.amazonaws.com/static/box-size-img/5/CassPea-2023-JDPIX-2.jpg'],
            description: 'Our Advent Calendar is a perfect way to countdown to Christmas. Each day you will receive a delicious treat to enjoy.',
            weight: "400",
            color: 'purple',
            pieces: '1',
            id: 8,
        }
    ],
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts(state, action: PayloadAction<ProductType[]>) {
            state.products = action.payload;
        },
    },
});

export const selectProductBySlug = (state: RootState, slug: string): ProductType | undefined =>
  state.products.products.find(product => product.slug === slug);
export const selectAllProducts = (state: RootState): ProductType[] => state.products.products;
export const selectBoxes = (state: RootState): ProductType[] => state.products.products.filter(p => p.category.slug === 'gift-boxes');
export const selectSnacks = (state: RootState): ProductType[] => state.products.products.filter(p => p.category.slug === 'snacks');
export const selectAdvent = (state: RootState): ProductType[] => state.products.products.filter(p => p.category.slug === 'advent-calendar');

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
