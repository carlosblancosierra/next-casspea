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

	const SLUG_SIGNATURE_BOXES = 'signature-boxes';
	const SLUG_CHOCOLATE_BARKS = 'chocolate-barks';
	const SLUG_HOT_CHOCOLATE = 'hot-chocolate';
	
	// const otherBoxes = products.filter((p) => 
	// 	p.category?.slug === SLUG_SIGNATURE_BOXES ||
	// 	p.category?.slug === SLUG_CHOCOLATE_BARKS
	// );

	const boxes = products.filter((p) => 
		p.category?.slug === SLUG_SIGNATURE_BOXES
	);

	const otherBoxes = boxes.filter((p) => p.id !== product.id);

	const hotChocolate = products.filter((p) => 
		p.category?.slug === SLUG_HOT_CHOCOLATE
	);

	const chocolateBarks = products.filter((p) => 
		p.category?.slug === SLUG_CHOCOLATE_BARKS
	);
	
	return (
		<div className="max-w-[95vw] mx-auto">
			<ProductBreadcrumb product={product} />
			<div className="grid grid-cols-1 md:grid-cols-[30%,1fr,30%] gap-2 md:gap-4 py-2 relative">
				<div className="">
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

			{/* Other Boxes */}
			<div className="mt-5">
				<h2 className="text-center text-xl my-5 font-bold">Need More Boxes?</h2>
				<div className="flex justify-center">
					<div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-3 xl:justify-center">
						{otherBoxes.map((prod: Product) => (
							<ProductCard key={prod.name} product={prod} />
						))}
					</div>
				</div>
			</div>

			{/* Chocolate Barks */}
			<div className="mt-5">
				<h2 className="text-center text-xl my-5 font-bold">Introducing our Chocolate Barks</h2>
				<div className="flex justify-center">
					<div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
						{chocolateBarks.map((prod: Product) => (
							<ProductCard key={prod.name} product={prod} />
						))}
					</div>
				</div>
			</div>

			{/* Hot Chocolate */}
			<div className="mt-5">
				<h2 className="text-center text-xl my-5 font-bold">Try Our Hot Chocolate</h2>
				<div className="flex justify-center">
					<div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
						{hotChocolate.map((prod: Product) => (
							<ProductCard key={prod.name} product={prod} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductTemplate;
