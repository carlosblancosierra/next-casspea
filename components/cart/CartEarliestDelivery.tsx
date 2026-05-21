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

  // Spring Bank Holiday + high temperature delay: all orders ship on 26 May 2026
  const HOLIDAY_SHIP_DATE = new Date('2026-05-26T00:00:00+01:00');
  const isHolidayPeriod = now < HOLIDAY_SHIP_DATE;

  const shippingDate = isHolidayPeriod
    ? HOLIDAY_SHIP_DATE
    : ukHour < SHIPPING_CUTOFF_HOUR ? now : addBusinessDays(now, 1);
  const earliestDelivery = addBusinessDays(shippingDate, fastest.estimated_days_min);
  const formattedDate = format(earliestDelivery, 'EEEE, d MMM');

  const orderByCutoff = ukHour < SHIPPING_CUTOFF_HOUR
    ? 'Order before 10am today'
    : 'Order now';

  return (
    <div className={`space-y-2 ${className}`}>
      {isHolidayPeriod && (
        <div className="rounded-md border border-amber-200 dark:border-amber-700 p-3 bg-amber-50 dark:bg-amber-900/20 flex items-start gap-2">
          <svg className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-amber-800 dark:text-amber-200">
            Due to the Spring Bank Holiday &amp; high temperatures, all orders placed before 26 May will ship on <strong>Tuesday 26 May</strong>.
          </p>
        </div>
      )}
      <div className="rounded-md border p-4 bg-main-bg dark:bg-main-bg-dark">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <div>
            <p className="text-sm font-medium text-primary-text dark:text-primary-text-light">
              {orderByCutoff} for delivery as early as <span className="font-extrabold">{formattedDate}</span>
            </p>
            <p className="text-xs text-primary-text/70 dark:text-primary-text-light/70 mt-0.5">
              With {fastest.name} shipping option
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartEarliestDelivery;
