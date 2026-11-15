/** CassPea's WhatsApp, used by the floating button and any "get in touch" link. */
export const WHATSAPP_NUMBER = '447859790386';

export const whatsAppUrl = (message: string) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
