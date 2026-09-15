'use client';

import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useCreateRoyalMailOrderMutation } from '@/redux/features/royalmail/royalmailApiSlice';

function getCookie(name: string) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Royal Mail actions shared by the classic order cards and the new table's
 * drawer, so both behave identically.
 *
 * The label download is a raw fetch rather than an RTK Query endpoint because
 * it streams a PDF back and needs the Content-Disposition filename.
 */
export function useOrderActions() {
    const [createRoyalMailOrder] = useCreateRoyalMailOrderMutation();

    const handleCreate = useCallback(
        async (order_id: string) => {
            try {
                await createRoyalMailOrder({ order_id }).unwrap();
                toast.success('Envío creado');
            } catch {
                toast.error('Error al crear envío');
            }
        },
        [createRoyalMailOrder],
    );

    const handleDownload = useCallback(async (order_id: string) => {
        try {
            const token = localStorage.getItem('access');
            const csrf = getCookie('csrftoken') || '';
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_HOST}/api/royalmail/orders/${order_id}/label/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'X-CSRFToken': csrf,
                    },
                },
            );
            if (!res.ok) throw new Error();
            const blob = await res.blob();
            const cd = res.headers.get('Content-Disposition') || '';
            const fn = cd.match(/filename="(.+)"/)?.[1] || `label_${order_id}.pdf`;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fn;
            document.body.append(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            toast.success('Descarga iniciada');
        } catch {
            toast.error('Error al descargar etiqueta');
        }
    }, []);

    return { handleCreate, handleDownload };
}

export default useOrderActions;
