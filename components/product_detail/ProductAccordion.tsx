import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiChevronDown, FiChevronUp } from "react-icons/fi";
import PaymentMethods from '../common/PaymentMethods';
import { Product } from '@/types/products';
const AccordionItem = ({ i, expanded, setExpanded, title, content }: {
  i: number;
  expanded: false | number;
  setExpanded: (value: false | number) => void;
  title: string;
  content: React.ReactNode;
}) => {
  const isOpen = i === expanded;

  return (
    <>
      <motion.header
        initial={false}
        className={`
        border-grey-20 group border-t last:mb-0 last:border-b py-3
        ${isOpen ? "bg-[#f9f9f9] dark:bg-main-bg-dark" : "main-bg dark:bg-main-bg-dark"}
        `}
        onClick={() => setExpanded(isOpen ? false : i)}
      >
        <h3 className="px-1">
          <div className="flex flex-col">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="font-normal font-sans txt-medium text-sm text-primary-text dark:text-primary-text-light">{title}</p>
              </div>
              <div className="text-grey-90 hover:bg-grey-5 bg-transparent disabled:bg-transparent rounded-rounded group relative p-[6px]">
                {isOpen ? <FiChevronUp /> : <FiChevronDown />}
              </div>
            </div>
          </div>
        </h3>
      </motion.header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="px-1"
          >
            <div className="inter-base-regular group-radix-state-closed:animate-accordion-close">
              <div className="w-full">
                <div className="text-small-regular">
                  {content}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
};

export const Example = ({ isSignatureBox, product }: { isSignatureBox: boolean, product: Product }) => {
  const [expanded, setExpanded] = useState<false | number>(2);

  const accordionItems = [
    {
      title: "Product Information",
      content: (
        <div className="grid grid-cols-2 gap-8 px-2 pt-2 pb-4">
          <div>
            <span className="font-semibold text-xs text-primary-text dark:text-primary-text-light">Pieces</span>
            <p className='text-sm text-primary-text dark:text-primary-text-light'>{product.units_per_box} {isSignatureBox ? 'Bonbons' : 'units'}</p>
          </div>
          {product.weight && (
            <div>
              <span className="font-semibold text-xs text-primary-text dark:text-primary-text-light">Weight</span>
              <p className='text-sm text-primary-text dark:text-primary-text-light'>{product.weight} grams</p>
            </div>
          )}
          <div>
            <span className="font-semibold text-xs text-primary-text dark:text-primary-text-light">City of origin</span>
            <p className='text-sm text-primary-text dark:text-primary-text-light'>London</p>
          </div>
          {/* <div>
            <span className="font-semibold text-xs">Dimensions</span>
            <p className='text-sm'>10x10 cm</p>
          </div> */}
        </div>
      )
    },
  ];

  // Add shipping or pickup section based on product type
  if (product.pickup_only) {
    accordionItems.push({
      title: "Store Pickup",
      content: (
        <div className="grid grid-cols-1 gap-y-8 pt-2 pb-4">
          <div className="flex items-start gap-x-2">
            <FiCheckCircle />
            <div>
              <span className="font-semibold text-sm text-primary-text dark:text-primary-text-light">In-Store Collection</span>
              <p className="text-xs text-primary-text dark:text-primary-text-light">
                This product is available for in-store pickup only and cannot be shipped.
              </p>
              {product.pickup_from_date && (
                <p className="text-xs text-primary-text dark:text-primary-text-light mt-2">
                  <strong>Available from:</strong> {new Date(product.pickup_from_date).toLocaleDateString('en-GB')}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-x-2">
            <FiCheckCircle />
            <div>
              <span className="font-semibold text-sm text-primary-text dark:text-primary-text-light">Store Location</span>
              <p className="text-xs text-primary-text dark:text-primary-text-light">
                CassPea Chocolates<br />
                London, UK
              </p>
            </div>
          </div>
          <div className="flex items-start gap-x-2">
            <FiCheckCircle />
            <div>
              <span className="font-semibold text-sm text-primary-text dark:text-primary-text-light">Collection Process</span>
              <p className="text-xs text-primary-text dark:text-primary-text-light">
                After placing your order, you'll receive a confirmation email with pickup instructions and store hours.
              </p>
            </div>
          </div>
        </div>
      )
    });
  } else {
    accordionItems.push({
      title: "Shipping",
      content: (
        <div className="grid grid-cols-1 gap-y-8 pt-2 pb-4">
          <div className="flex items-start gap-x-2">
            <FiCheckCircle />
            <div>
              <span className="font-semibold text-sm text-primary-text dark:text-primary-text-light">Royal Mail Tracked 48®</span>
              <p className="text-xs text-primary-text dark:text-primary-text-light">Shipping within 24 hours, Aims to deliver in two to three working days</p>
            </div>
          </div>
          <div className="flex items-start gap-x-2">
            <FiCheckCircle />
            <div>
              <span className="font-semibold text-sm text-primary-text dark:text-primary-text-light">Royal Mail Tracked 24®</span>
              <p className="text-xs text-primary-text dark:text-primary-text-light">Shipping within 24 hours, Next working day delivery aim</p>
            </div>
          </div>
          <div className="flex items-start gap-x-2">
            <FiCheckCircle />
            <div>
              <span className="font-semibold text-sm text-primary-text dark:text-primary-text-light">Royal Mail Special Delivery</span>
              <p className="text-xs text-primary-text dark:text-primary-text-light">Shipping same day for orders placed before 11 am. Delivery within 24 hours</p>
            </div>
          </div>
        </div>
      )
    });
  }

  // Conditionally add the "How to Order" accordion item if isSignatureBox is true
  if (isSignatureBox) {
    accordionItems.push({
      title: "How to Order",
      content: (
        <div className="grid grid-cols-1 mt-2 gap-y-6 pt-2 pb-4">
          <div className="flex items-start gap-x-2">
            <FiCheckCircle />
            <div>
              <span className="font-semibold text-sm text-primary-text dark:text-primary-text-light">Customize Your Box</span>
              <p className="text-xs text-primary-text dark:text-primary-text-light">
                Choose your box size, select any allergens to avoid, and pick your favourite flavours. Can't decide? Let us choose for you with our curated selection!
              </p>
            </div>
          </div>
          <div className="flex items-start gap-x-2">
            <FiCheckCircle />
            <div>
              <span className="font-semibold text-sm text-primary-text dark:text-primary-text-light">Review Your Order</span>
              <p className="text-xs text-primary-text dark:text-primary-text-light">
                Double-check your order details, pick a preferred shipping date, and add a personal message for that extra touch.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-x-2">
            <FiCheckCircle />
            <div>
              <span className="font-semibold text-sm text-primary-text dark:text-primary-text-light">Secure Checkout</span>
              <p className="text-xs mb-2 text-primary-text dark:text-primary-text-light">
                Pay safely and easily through Stripe, using your preferred payment method. Fast and secure.
              </p>
              <PaymentMethods size={10} lg={10}/>
            </div>
          </div>
          <div className="flex items-start gap-x-2">
            <FiCheckCircle />
            <div>
              <span className="font-semibold text-sm text-primary-text dark:text-primary-text-light">Savor the Moment</span>
              <p className="text-xs text-primary-text dark:text-primary-text-light">
                Receive your chocolates and indulge in every bite. Share the joy or keep them all for yourself!
              </p>
            </div>
          </div>
        </div>
      )
    });
  }

  return (
    <>
      {accordionItems.map((item, i) => (
        <AccordionItem
          key={i}
          i={i}
          expanded={expanded}
          setExpanded={setExpanded}
          title={item.title}
          content={item.content}
        />
      ))}
    </>
  );
};

export default Example;
