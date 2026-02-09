'use client';

import React from 'react';
import { addBusinessDays, format } from 'date-fns';
import { useGetShippingOptionsQuery } from '@/redux/features/shipping/shippingApiSlice';

type Props = { className?: string };

const CartEarliestDelivery: React.FC<Props> = ({ className = '' }) => {
  const { data: shippingCompanies, isLoading, error } = useGetShippingOptionsQuery();

  if (isLoading || error || !shippingCompanies) return null;

  // Flatten all shipping options, exclude store pickup (id 34) and disabled options
  const shippingOptions = shippingCompanies.flatMap(company =>
    company.shipping_options.filter(opt => opt.id !== 34 && !opt.disabled)
  );

  if (shippingOptions.length === 0) return null;

  // Find the option with the smallest estimated_days_min
  const fastest = shippingOptions.reduce((best, opt) =>
    opt.estimated_days_min < best.estimated_days_min ? opt : best
  );

  // Calculate earliest delivery using 10 AM UK cutoff logic
  const now = new Date();
  const ukHour = parseInt(
    new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Europe/London' }).format(now)
  );
  const SHIPPING_CUTOFF_HOUR = 10;
  const shippingDate = ukHour < SHIPPING_CUTOFF_HOUR ? now : addBusinessDays(now, 1);
  const earliestDelivery = addBusinessDays(shippingDate, fastest.estimated_days_min);
  const formattedDate = format(earliestDelivery, 'EEEE, d MMM');

  const orderByCutoff = ukHour < SHIPPING_CUTOFF_HOUR
    ? 'Order before 10am today'
    : 'Order now';

  return (
    <div className={`rounded-md border p-4 bg-main-bg dark:bg-main-bg-dark ${className}`}>
      <div className="flex items-start gap-2">
        <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <div>
          <p className="text-sm font-medium text-primary-text dark:text-primary-text-light">
            {orderByCutoff} for delivery as early as <span className="font-extrabold text-transparent">{formattedDate}</span>
          </p>
          <p className="text-xs text-primary-text/70 dark:text-primary-text-light/70 mt-0.5">
            With {fastest.name} shipping option
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartEarliestDelivery;
