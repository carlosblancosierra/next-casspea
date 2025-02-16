'use client'

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image';

const navigation = [
  { name: 'Store', href: '/shop-now', current: false },
  { name: 'Flavours', href: '/flavours', current: false },
  { name: 'Personalised', href: '/personalised', current: false },
  { name: 'Track', href: 'https://www.royalmail.com/track-your-item', current: false, external: true },
  { name: 'Help', href: '/help', current: false },
  { name: 'About Us', href: '/about-us', current: false },
]

const mobileNav = [
  ...navigation,
  { name: 'Log in', href: '/orders', current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Nav() {
  // const cart = useSelector(selectCart);

  return (
    <Disclosure as="nav" className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-screen-2xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-2">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>

              {/* Logo */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0">
                  <Link href="/">
                    <Image
                      alt="CassPea Chocolates"
                      src="/logos/casspea_red.png"
                      width={0}
                      height={0}
                      sizes="100vw"
                      priority
                      className='w-36 h-auto block dark:hidden'
                    />
                  </Link>
                  <Link href="/">
                    <Image
                      alt="CassPea Chocolates"
                      src="/logos/casspea_red.png"
                      width={0}
                      height={0}
                      sizes="100vw"
                      priority
                      className='w-36 h-auto dark:block hidden'
                    />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className={classNames(
                          item.current
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cart */}
              <div className="absolute inset-y-0 right-0 flex items-center space-x-4 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Link href="/cart" className="group relative -m-2 flex items-center p-2">
                  <ShoppingBagIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-gray-400 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-white"
                  />
                  {/* <span className="ml-2 text-xs font-medium text-gray-700 group-hover:text-gray-800 dark:text-gray-300 dark:group-hover:text-white">
                    {totalItems} (£{totalValue.toFixed(2)})
                  </span> */}
                  <span className="sr-only">items in cart, view bag</span>
                </Link>

              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {mobileNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                >
                  <DisclosureButton
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                      'block w-full rounded-md px-3 py-2 text-base font-medium text-left'
                    )}
                  >
                    {item.name}
                  </DisclosureButton>
                </Link>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  )
}
