import React from 'react';

interface PaymentMethodsProps {
  size?: number;
  lg?: number;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ size = 12, lg = 16 }) => {
  const sizeClass = `w-${size}`;
  const lgClass = `lg:w-${lg}`;

  const paymentMethods = [
    { src: "https://www.casspea.co.uk/static/images/payments/visa.png", alt: "Visa" },
    { src: "https://www.casspea.co.uk/static/images/payments/master.png", alt: "Mastercard" },
    { src: "https://www.casspea.co.uk/static/images/payments/google.png", alt: "Google Pay" },
    { src: "https://www.casspea.co.uk/static/images/payments/apple.png", alt: "Apple Pay" },
    { src: "https://www.casspea.co.uk/static/images/payments/amex.png", alt: "Amex" },
    { src: "https://www.casspea.co.uk/static/images/payments/diners.png", alt: "Diners Club" },
  ];

  return (
    <div className="flex flex-wrap gap-1">
      {paymentMethods.map((method, index) => (
        <div key={index} className={`${sizeClass} ${lgClass}`}>
          <img src={method.src} alt={method.alt} className="w-full h-auto" />
        </div>
      ))}
    </div>
  );
};

export default PaymentMethods;
