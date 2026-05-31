import type { Metadata } from 'next';
import ProductDetail from '@/components/product_detail/ProductDetail';

type Props = { params: { product_slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/products/${params.product_slug}/`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return {};
    const product = await res.json();
    return {
      title: `${product.seo_title || product.name} | CassPea Chocolates`,
      description: product.seo_description || product.description || '',
      openGraph: {
        title: product.seo_title || product.name,
        description: product.seo_description || product.description || '',
        images: product.image ? [{ url: product.image }] : [],
      },
    };
  } catch {
    return {};
  }
}

export default function Page({ params }: Props) {
  return (
    <main className="mx-auto max-w-screen-2xl">
      <ProductDetail slug={params.product_slug} />
    </main>
  );
}
