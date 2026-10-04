'use client';

import React, { Suspense } from 'react';
import { useGetProductsQuery } from '@/redux/features/products/productApiSlice';
import { notFound } from 'next/navigation';
import ProductInfo from '@/components/product_detail/ProductInfo';
import ImageGallery from '@/components/product_detail/ImageGallery';
import ProductBreadcrumb from '@/components/product_detail/ProductBreadcrumb';
import ProductAccordion from './ProductAccordion';
import ProductFormBoxes from './ProductFormBoxes';
import QuickBoxBuilder from './QuickBoxBuilder';
import ProductFormGeneral from './ProductFormGeneral';
import FlavourGrid from '../flavours/FlavourCarousel';
import Reviews from '../common/Reviews';
import ProductCard from '../store/ProductCard';
import { Product } from '@/types/products';
import { useExperiment } from '@/hooks/useExperiment';
import { BOX_BUILDER_EXPERIMENT, BUILDER_ADD_TO_CART } from '@/types/experiments';
import TrustStrip from '@/components/marketing/TrustStrip';

const ProductTemplate: React.FC<{ slug: string; initialProducts?: Product[] }> = ({ slug, initialProducts }) => {
	// Explicitly provide the type for the query result
	const { data, isLoading, error } = useGetProductsQuery();
	// The split point for the box-builder A/B test. Asked for on every product
	// page so the assignment resolves alongside the product query rather than
	// after it — a builder that appears and is then swapped is both a bad
	// experience and a dirty impression.
	const { variant, isLoading: variantLoading, track } = useExperiment(BOX_BUILDER_EXPERIMENT);
	// Prefer the SSR-provided products for the first render (SEO / no spinner),
	// then let the client query keep them current.
	const products: Product[] = data ?? initialProducts ?? [];

	// Only block the whole page while we genuinely have nothing to show. The A/B
	// variant only affects the builder, so it waits inside that section instead
	// of holding back the whole (server-rendered) product page.
	if (!products.length && isLoading) {
		return <div className="text-primary-text dark:text-primary-text-light">Loading products...</div>;
	}

	if (!products.length && error) {
		return <div className="text-primary-text dark:text-primary-text-light">Error loading products.</div>;
	}

	const product = products.find((p) => p.slug === slug);

	if (!product) {
		notFound();
	}

	// Categories whose products are customisable "boxes" (multi-step form with
	// allergen/flavour selection). Summer Break clearance boxes behave like
	// Signature Boxes, just Surprise-Me only.
	const BOX_CATEGORY_SLUGS = ['signature-boxes', 'summer-break-boxes'];
	const isSignatureBox =
		product.category?.id === 1 ||
		(product.category?.slug ? BOX_CATEGORY_SLUGS.includes(product.category.slug) : false);

	const galleryImagesUrls = product.gallery_images?.map((image) => image.image);
	const images = [product.image, ...(galleryImagesUrls || [])].filter(
		(image): image is string => !!image
	);

	const SLUG_SIGNATURE_BOXES = 'signature-boxes';
	const SLUG_CHOCOLATE_BARKS = 'chocolate-barks';
	const SLUG_HOT_CHOCOLATE = 'hot-chocolate';

	const available = (p: Product) => p.active !== false && !p.sold_out && p.id !== product.id;

	// Other sizes of the same thing, smallest first: the natural "or go bigger".
	const otherBoxes = products
		.filter((p) => p.category?.slug === SLUG_SIGNATURE_BOXES && available(p))
		.sort((a, b) => (a.units_per_box ?? 0) - (b.units_per_box ?? 0));

	// One row of add-ons rather than a grid per category: bark and hot
	// chocolate are both "something to go with it".
	const extras = products
		.filter((p) => (p.category?.slug === SLUG_CHOCOLATE_BARKS || p.category?.slug === SLUG_HOT_CHOCOLATE) && available(p))
		.slice(0, 4);

	// Next-day and tracked-delivery lines are wrong for a product that is
	// collected, or that is posted on one fixed day (the Advent calendar).
	const shipsNormally = !product.pickup_only && !product.fixed_dispatch_date;

	const sectionTitle = 'font-playfair text-center text-2xl md:text-3xl font-bold mb-5 text-primary-text dark:text-primary-text-light';

	return (
		<div className="max-w-[95vw] mx-auto">
			<ProductBreadcrumb product={product} />
			{/* Two columns: the pictures, and everything needed to decide and buy
			    in one column beside them. It used to be three — name and price
			    on the left, the builder on the right — so the eye crossed the
			    photos between reading the price and choosing the box. */}
			<div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr),minmax(0,1fr)] gap-4 md:gap-10 py-2">
				<div className="md:sticky md:top-24 self-start w-full">
					<ImageGallery images={images} />
				</div>

				<div className="flex flex-col gap-y-6 w-full">
					<ProductInfo product={product} showPerPiece={isSignatureBox} />

					<Suspense fallback="Loading...">
						{isSignatureBox ? (
							variantLoading ? (
								<div className="text-primary-text dark:text-primary-text-light">Loading...</div>
							) : variant === 'quick' ? (
								<QuickBoxBuilder
									product={product}
									onAddedToCart={() => track(BUILDER_ADD_TO_CART)}
								/>
							) : (
								<ProductFormBoxes
									product={product}
									onAddedToCart={() => track(BUILDER_ADD_TO_CART)}
								/>
							)
						) : (
							<ProductFormGeneral product={product} />
						)}
					</Suspense>

					<TrustStrip layout="grid" shipping={shipsNormally} className="rounded-xl bg-white/70 dark:bg-white/5 p-4" />

					<div>
						<ProductAccordion isSignatureBox={isSignatureBox} product={product} />
					</div>
				</div>
			</div>

			{/* Straight after the buy box: proof first, then the flavours. */}
			<section id="reviews" className="scroll-mt-24 mt-16">
				<h2 className={sectionTitle}>What our customers say</h2>
				<Reviews />
			</section>

			<section className="my-16">
				<h2 className={sectionTitle}>Our Flavours</h2>
				<FlavourGrid />
			</section>

			{isSignatureBox && otherBoxes.length > 0 && (
				<section className="mt-5">
					<h2 className={sectionTitle}>Other sizes</h2>
					<div className="grid grid-cols-2 gap-x-2 gap-y-5 lg:grid-cols-4">
						{otherBoxes.map((prod: Product) => (
							<ProductCard key={prod.id} product={prod} />
						))}
					</div>
				</section>
			)}

			{extras.length > 0 && (
				<section className="mt-12 mb-10">
					<h2 className={sectionTitle}>Something to go with it</h2>
					<div className="grid grid-cols-2 gap-x-2 gap-y-5 lg:grid-cols-4">
						{extras.map((prod: Product) => (
							<ProductCard key={prod.id} product={prod} />
						))}
					</div>
				</section>
			)}
		</div>
	);
};

export default ProductTemplate;
