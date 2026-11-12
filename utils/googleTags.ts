/**
 * Google tag ids, in one place.
 *
 * G-5VDK8X7CHR is the Google tag the old agency's GTM container used to load.
 * It is more than GA4: its settings (managed in Google, not here) link Google
 * Ads AW-11208730912 and define the "page load /checkout/success" conversion
 * that Ads currently bids on. Loading it directly keeps all of that while
 * removing the container we have no access to.
 */
export const GOOGLE_TAG_ID = 'G-5VDK8X7CHR';

export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;

/** The "Google Ads Purchase" conversion action (label from the old GTM tag). */
export const GOOGLE_ADS_PURCHASE_LABEL = 'eqyOCMKevcYaEKDS3uAp';
