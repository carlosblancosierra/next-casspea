import React from 'react';
import { Product as ProductType } from '@/types/products';

interface ProductBreadcrumbProps {
    product: ProductType;
}

const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({ product }) => {
    return (
        <nav aria-label="Breadcrumb">
            <ol role="list" className="flex space-x-2 py-2">
                <li>
                    <div className="flex items-center">
                        <a href="/shop-now/" className="mr-2 text-sm text-gray-900 dark:text-gray-400">Store</a>
                        <svg
                            fill="currentColor"
                            width={16}
                            height={20}
                            viewBox="0 0 16 20"
                            aria-hidden="true"
                            className="h-5 w-4 text-gray-300 dark:text-gray-500"
                        >
                            <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                        </svg>
                    </div>
                </li>
                <li>
                    <div className="flex items-center">
                        <a href="/shop-now/" className="mr-2 text-sm text-gray-900 dark:text-gray-400">
                            {product.category?.name}
                        </a>
                        {/* <svg
                            fill="currentColor"
                            width={16}
                            height={20}
                            viewBox="0 0 16 20"
                            aria-hidden="true"
                            className="h-5 w-4 text-gray-300 dark:text-gray-500"
                        >
                            <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                        </svg> */}
                    </div>
                </li>
                {/* <li className="text-sm">
                    <a aria-current="page" className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
                        {product.name_short || product.slug.split('-').join(' ')}
                    </a>
                </li> */}
            </ol>
        </nav>
    );
};

export default ProductBreadcrumb;
