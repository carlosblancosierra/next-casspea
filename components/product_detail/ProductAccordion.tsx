import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiChevronDown, FiChevronUp } from "react-icons/fi";
import PaymentMethods from '../common/PaymentMethods';

const AccordionItem = ({ i, expanded, setExpanded, title, content }) => {
  const isOpen = i === expanded;

  return (
    <>
      <motion.header
        initial={false}
        className={`
        border-grey-20 group border-t last:mb-0 last:border-b py-3
        ${isOpen ? "bg-[#f9f9f9] dark:bg-gray-800" : "bg-white dark:bg-gray-900"}
        `}
        onClick={() => setExpanded(isOpen ? false : i)}
      >
        <h3 className="px-1">
          <div className="flex flex-col">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="font-normal font-sans txt-medium text-sm">{title}</p>
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

export const Example = ({ isSignatureBox }: { isSignatureBox: boolean }) => {
  const [expanded, setExpanded] = useState<false | number>(2);

  const accordionItems = [
    {
      title: "Product Information",
      content: (
        <div className="grid grid-cols-2 gap-8 px-2 pt-2 pb-4">
          <div>
            <span className="font-semibold text-xs">Pieces</span>
            <p className='text-sm'>9 Bonbons</p>
          </div>
          <div>
            <span className="font-semibold text-xs">Weight</span>
            <p className='text-sm'>135 grams</p>
          </div>
          <div>
            <span className="font-semibold text-xs">City of origin</span>
            <p className='text-sm'>London</p>
          </div>
          <div>
            <span className="font-semibold text-xs">Dimensions</span>
            <p className='text-sm'>10x10 cm</p>
          </div>
        </div>
      )
    },
    {
      title: "Shipping",
      content: (
        <div className="grid grid-cols-1 gap-y-8 pt-2 pb-4">
          <div className="flex items-start gap-x-2">
            <FiCheckCircle />
            <div>
              <span className="font-semibold text-sm">Regular</span>
              <p className="text-xs">Just return your product and we&apos;ll refund your money. No questions asked – we&apos;ll do our best to make sure your return is hassle-free.</p>
            </div>
          </div>
          <div className="flex items-start gap-x-2">
            <FiCheckCircle />
            <div>
              <span className="font-semibold text-sm">Priority</span>
              <p className="text-xs">Get priority shipping with faster processing times.</p>
            </div>
          </div>
          <div className="flex items-start gap-x-2">
            <FiCheckCircle />
            <div>
              <span className="font-semibold text-sm">Next Day Guaranteed</span>
              <p className="text-xs">Guaranteed next-day delivery.</p>
            </div>
          </div>
        </div>
      )
    },
  ];

  // Conditionally add the "How to Order" accordion item if isSignatureBox is true
  if (isSignatureBox) {
    accordionItems.push({
      title: "How to Order",
      content: (
        <div className="grid grid-cols-1 mt-2 gap-y-6 pt-2 pb-4">
          <div className="flex items-start gap-x-2">
            <FiCheckCircle />
            <div>
              <span className="font-semibold text-sm">Customize Your Box</span>
              <p className="text-xs">
                Choose your box size, select any allergens to avoid, and pick your favourite flavours. Can’t decide? Let us choose for you with our curated selection!
              </p>
            </div>
          </div>
          <div className="flex items-start gap-x-2">
            <FiCheckCircle />
            <div>
              <span className="font-semibold text-sm">Review Your Order</span>
              <p className="text-xs">
                Double-check your order details, pick a preferred shipping date, and add a personal message for that extra touch.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-x-2">
            <FiCheckCircle />
            <div>
              <span className="font-semibold text-sm">Secure Checkout</span>
              <p className="text-xs mb-2">
                Pay safely and easily through Stripe, using your preferred payment method. Fast and secure.
              </p>
              <PaymentMethods size={10} lg={10}/>
            </div>
          </div>
          <div className="flex items-start gap-x-2">
            <FiCheckCircle />
            <div>
              <span className="font-semibold text-sm">Savor the Moment</span>
              <p className="text-xs">
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
