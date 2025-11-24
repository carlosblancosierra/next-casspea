"use client";
export const dynamic = "force-dynamic"; // Disable prerendering so search params work dynamically

import React, { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetEmbeddedCheckoutSessionResultQuery } from "@/redux/features/checkout/checkoutApiSlice";

const CheckoutResult = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams?.get("session_id");

  const { data, error, isLoading, isUninitialized } =
    useGetEmbeddedCheckoutSessionResultQuery(sessionId || "", {
      skip: !sessionId,
    });

  useEffect(() => {
    if (!sessionId) {
      router.replace("/checkout/cancel");
      return;
    }
    if (error) {
      router.replace("/checkout/error");
      return;
    }
    if (!isLoading && !isUninitialized) {
      if (data?.status === "complete") {
        router.replace(`/checkout/success?session_id=${sessionId}`);
      } else {
        router.replace("/checkout/cancel");
      }
    }
  }, [sessionId, isLoading, isUninitialized, data, error, router]);

  return <div className="text-primary-text">Redirecting…</div>;
};

export default function CheckoutResultPage() {
  return (
    <Suspense fallback={<div className="text-primary-text">Loading…</div>}>
      <CheckoutResult />
    </Suspense>
  );
}