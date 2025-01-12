import React from 'react';
import Image from 'next/image';

interface PaymentMethodsProps {
  size?: number;
  lg?: number;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = () => {
  const paymentMethods = [
    { src: "https://casspea-static-eu.s3.eu-west-1.amazonaws.com/static/images/payments/visa.png", alt: "Visa" },
    { src: "https://casspea-static-eu.s3.eu-west-1.amazonaws.com/static/images/payments/master.png", alt: "Mastercard" },
    { src: "https://casspea-static-eu.s3.eu-west-1.amazonaws.com/static/images/payments/google.png", alt: "Google Pay" },
    { src: "https://casspea-static-eu.s3.eu-west-1.amazonaws.com/static/images/payments/apple.png", alt: "Apple Pay" },
    { src: "https://casspea-static-eu.s3.eu-west-1.amazonaws.com/static/images/payments/amex.png", alt: "Amex" },
    { src: "https://casspea-static-eu.s3.eu-west-1.amazonaws.com/static/images/payments/diners.png", alt: "Diners Club" },
  ];

  return (
    <div className="grid grid-cols-3 gap-1 md:mr-8">
      {paymentMethods.map((method, index) => (
        <div key={index}>
          <Image
            src={method.src}
            alt={method.alt}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto"
          />
        </div>
      ))}
    </div>
  );
};

export default PaymentMethods;
