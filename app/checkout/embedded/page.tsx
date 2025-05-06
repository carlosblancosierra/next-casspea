"use client";
import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useCreateEmbeddedCheckoutSessionMutation } from "@/redux/features/checkout/checkoutApiSlice";

// Note: Use your actual publishable key
const stripePromise = loadStripe("pk_live_51MBMy0JiuFqKKcn6HYrAh3qBJz7x1Ajr5aqcKNzuKVQkr8xSYMdJVlQAV6uZ25HYRJ6kEsRyivTezDroICC3VeBq00q7edrNzB");

export default function CheckoutPage() {
  const [createEmbeddedCheckoutSession] = useCreateEmbeddedCheckoutSessionMutation();

  // Create a function to fetch the client secret.
  const fetchClientSecret = useCallback(() => {
    return createEmbeddedCheckoutSession()
      .then((res) => res.data.clientSecret);
  }, [createEmbeddedCheckoutSession]);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}