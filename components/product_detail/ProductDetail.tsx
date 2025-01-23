import React, { Suspense } from 'react';
import { selectProductBySlug } from '@/redux/features/products/productSlice';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import ProductInfo from '@/components/product_detail/ProductInfo';
import { notFound } from 'next/navigation';
import ImageGallery from '@/components/product_detail/ImageGallery';
import ProductBreadcrumb from '@/components/product_detail/ProductBreadcrumb';
import ProductAccordion from './ProductAccordion';
import ProductFormBoxes from './ProductFormBoxes';
import ProductFormGeneral from './ProductFormGeneral';
import FlavourGrid from '../flavours/FlavourCarousel';
import Reviews from '../common/Reviews';
import ProductCard from '../store/ProductCard';
import { selectBoxes } from '@/redux/features/products/productSlice';
import { useGetProductsQuery } from '@/redux/features/products/productApiSlice';

const ProductTemplate: React.FC<{ slug: string }> = ({ slug }) => {
    const { data: productsData, isLoading: productsLoading } = useGetProductsQuery();
    const product = useAppSelector((state: RootState) => selectProductBySlug(state, slug));
    const products = useAppSelector(selectBoxes);
    const relatedProducts = products.filter(p => p.id !== product?.id);
    const galleryImagesUrls = product?.gallery_images?.map(image => image.image);
    const images = [product?.image, ...(galleryImagesUrls || [])].filter((image): image is string => !!image);

    if (productsLoading) {
        return <div>Loading products...</div>;
    }

    if (!product) {
        notFound();
    }

    // Check if the product belongs to the "Signature Boxes" category
    const isSignatureBox = product?.category?.id === 1

    return (
        <div className="max-w-[90vw] mx-auto">
            <ProductBreadcrumb product={product} />
            <div className="grid grid-cols-1 md:grid-cols-[20%,1fr,30%] gap-2 py-2 relative">
                <div>
                    <ProductInfo product={product} />

                    <div className="hidden md:block">
                        <ProductAccordion isSignatureBox={isSignatureBox} product={product} />
                    </div>
                </div>

                <div className="block w-full relative">
                    <ImageGallery images={images} />
                </div>

                <div className="flex flex-col top-48 py-0 w-full gap-y-12">
                    <Suspense fallback={"Loading..."}>
                        {isSignatureBox ? (
                            <ProductFormBoxes product={product} />
                        ) : (
                            <ProductFormGeneral product={product} />
                        )}
                    </Suspense>
                </div>

                <div className="block md:hidden mt-10">
                    <ProductAccordion isSignatureBox={isSignatureBox} product={product} />
                </div>
            </div>

            <div className="my-16">
                <h2 className="text-center text-xl font-bold">Our Flavours</h2>
                <FlavourGrid />
            </div>

            <div className="mt-10">
                <h2 className="text-center text-xl my-5 font-bold">Reviews</h2>
                <Reviews />
            </div>

            <div className="mt-5">
                <h2 className="text-center text-xl my-5 font-bold">Need More Boxes?</h2>
                <div className="flex justify-center">
                    <div className="mt-6 grid grid-cols-2 gap-x-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-3 xl:justify-center">
                        {relatedProducts.map((product) => (
                            <ProductCard key={product.name} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductTemplate;
