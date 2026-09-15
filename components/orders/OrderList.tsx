// OrderList.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, format } from 'date-fns';
import { useGetOrdersQuery, OrdersQueryParams } from '@/redux/features/orders/ordersApiSlice';
import { useGetProductsQuery } from '@/redux/features/products/productApiSlice';
import { Order } from '@/types/orders';
import DaySection from './DaySection';
import { useOrderActions } from './useOrderActions';

export default function OrderList() {
  const today = useMemo(() => new Date(), []);
  const [startDate, setStartDate] = useState<Date>(addDays(today, -6));
  const [endDate, setEndDate]     = useState<Date>(today);
  const [filters, setFilters]     = useState<OrdersQueryParams>({
    start_date: format(addDays(today, -6), 'yyyy-MM-dd'),
    end_date:   format(today, 'yyyy-MM-dd'),
  });

  const { data: orders, isLoading, isFetching, error } = useGetOrdersQuery(filters);
  const { data: products } = useGetProductsQuery();
  const { handleCreate, handleDownload } = useOrderActions();
  const isBusy = isLoading || isFetching;

  const grouped: Record<string, Order[]> = useMemo(() => {
    return orders?.reduce((acc, order) => {
      const d = format(new Date(order.created), 'yyyy-MM-dd');
      (acc[d] ||= []).push(order);
      return acc;
    }, {} as Record<string, Order[]>) || {};
  }, [orders]);

  const handleSearch = useCallback(() => {
    setFilters({
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date:   format(endDate,   'yyyy-MM-dd'),
    });
  }, [startDate, endDate]);

  return (
    <div className="max-w-7xl mx-auto lg:px-8 py-6">
      {/* siempre visibles */}
      <div className="mb-2 text-center font-semibold text-primary-text dark:text-primary-text-light">
        Filtrar pedidos por fecha
      </div>
      <div className="flex justify-center space-x-4 mb-4">
        <DatePicker
          selected={startDate}
          onChange={d => d && setStartDate(d)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
          className="text-primary-text dark:text-primary-text-light bg-main-bg dark:bg-main-bg-dark border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
        />
        <DatePicker
          selected={endDate}
          onChange={d => d && setEndDate(d)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="yyyy-MM-dd"
          className="text-primary-text dark:text-primary-text-light bg-main-bg dark:bg-main-bg-dark border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleSearch}
        >
          Buscar
        </button>
      </div>

      <div className="mb-4 text-center font-semibold text-primary-text dark:text-primary-text-light">
        Mostrando de {startDate.toLocaleDateString()} a {endDate.toLocaleDateString()}
      </div>

      {/* contenido dinámico */}
      {isBusy ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
        </div>
      ) : error ? (
        <p className="text-center text-red-600">Error cargando pedidos</p>
      ) : !orders?.length ? (
        <p className="text-center text-primary-text dark:text-primary-text-light">No hay pedidos en este rango</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped)
            .sort(([a], [b]) => +new Date(b) - +new Date(a))
            .map(([date, dayOrders]) => (
              <DaySection
                key={date}
                date={date}
                orders={dayOrders}
                onCreateShipping={handleCreate}
                onDownloadLabel={handleDownload}
                products={products || []}
              />
            ))}
        </div>
      )}
    </div>
  );
}