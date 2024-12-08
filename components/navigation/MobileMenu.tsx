"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CiShoppingCart, CiShoppingTag, CiShoppingBasket, CiHome } from "react-icons/ci";
import { PiPaintBrushThin } from "react-icons/pi";

import { IconType } from 'react-icons';
import { useEffect, useState } from 'react';

interface MenuItem {
    name: string;
    href: string;
    icon: IconType;
}

const menuItems: MenuItem[] = [
    {
        name: 'Home',
        href: '/',
        icon: CiHome,
    },
    {
        name: '10% off',
        href: '/subscribe',
        icon: CiShoppingTag,
    },
    {
        name: 'Store',
        href: '/store',
        icon: CiShoppingCart,
    },
    // {
    //     name: 'Personalise',
    //     href: '/personalise',
    //     icon: PiPaintBrushThin,
    // },
    {
        name: 'Cart',
        href: '/cart',
        icon: CiShoppingBasket,
    },
];

const accentColor = 'text-pink-600 dark:text-pink-500';

const MobileMenu = () => {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > lastScrollY); // true when scrolling down
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    if (pathname && pathname.startsWith('/checkout')) {
        return null;
    }

    const isActive = (path: string) => pathname === path;

    const getActiveClass = (isCurrentActive: boolean) =>
        isCurrentActive
            ? accentColor
            : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500';

    return (
        <div className={`fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600 md:hidden ${isScrolled ? 'bg-opacity-80 dark:bg-opacity-80' : 'bg-opacity-100 dark:bg-opacity-100'
            }`}>
            <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
                {menuItems.map(({ name, href, icon: Icon }) => (
                    <Link
                        key={name}
                        href={href}
                        className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group ${isActive(href) ? 'text-blue-600 dark:text-blue-500' : ''
                            }`}
                    >
                        <Icon
                            className={`w-6 h-6 mb-1 ${getActiveClass(isActive(href))}`}
                        />
                        <span className={`text-xs ${getActiveClass(isActive(href))}`}>
                            {name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MobileMenu;
