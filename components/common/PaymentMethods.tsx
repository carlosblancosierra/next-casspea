import React from 'react';
import Image from 'next/image';

interface PaymentMethodsProps {
  size?: number;
  lg?: number;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = () => {
  const paymentMethods = [
    { src: "https://www.casspea.co.uk/static/images/payments/visa.png", alt: "Visa" },
    { src: "https://www.casspea.co.uk/static/images/payments/master.png", alt: "Mastercard" },
    { src: "https://www.casspea.co.uk/static/images/payments/google.png", alt: "Google Pay" },
    { src: "https://www.casspea.co.uk/static/images/payments/apple.png", alt: "Apple Pay" },
    { src: "https://www.casspea.co.uk/static/images/payments/amex.png", alt: "Amex" },
    { src: "https://www.casspea.co.uk/static/images/payments/diners.png", alt: "Diners Club" },
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
