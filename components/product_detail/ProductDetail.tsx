import React, { Suspense } from 'react';
import { useGetProductsQuery } from '@/redux/features/products/productApiSlice';
import { notFound } from 'next/navigation';
import ProductInfo from '@/components/product_detail/ProductInfo';
import ImageGallery from '@/components/product_detail/ImageGallery';
import ProductBreadcrumb from '@/components/product_detail/ProductBreadcrumb';
import ProductAccordion from './ProductAccordion';
import ProductFormBoxes from './ProductFormBoxes';
import ProductFormGeneral from './ProductFormGeneral';
import FlavourGrid from '../flavours/FlavourCarousel';
import Reviews from '../common/Reviews';
import ProductCard from '../store/ProductCard';
import { Product } from '@/types/products';

const ProductTemplate: React.FC<{ slug: string }> = ({ slug }) => {
	// Explicitly provide the type for the query result
	const { data, isLoading, error } = useGetProductsQuery();
	// Default to an empty array if data is undefined
	const products: Product[] = data ?? [];

	if (isLoading) {
		return <div>Loading products...</div>;
	}

	if (error) {
		return <div>Error loading products.</div>;
	}

	const product = products.find((p) => p.slug === slug);

	if (!product) {
		notFound();
	}

	// Check if the product belongs to the "Signature Boxes" category
	const isSignatureBox = product.category?.id === 1;

	const galleryImagesUrls = product.gallery_images?.map((image) => image.image);
	const images = [product.image, ...(galleryImagesUrls || [])].filter(
		(image): image is string => !!image
	);

	const relatedProducts = products.filter((p) => p.id !== product.id);

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
					<Suspense fallback="Loading...">
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
						{relatedProducts.map((prod) => (
							<ProductCard key={prod.name} product={prod} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductTemplate;
