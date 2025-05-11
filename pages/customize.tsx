import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { customizationCopy } from '../constants/customization';
import ProductCard from '../components/store/ProductCard';

// Define the steps configuration
const steps = [
  {
    category: 'signature-boxes',
    title: customizationCopy.step1.heading,
    subheading: customizationCopy.step1.subheading,
  },
  {
    category: 'chocolate-bark',
    title: customizationCopy.step2.heading,
    subheading: customizationCopy.step2.subheading,
  },
  {
    category: 'hot-chocolates',
    title: customizationCopy.step3.heading,
    subheading: customizationCopy.step3.subheading,
  },
  {
    category: 'cards',
    title: customizationCopy.step4.heading,
    subheading: customizationCopy.step4.subheading,
  }
];

const Customize = () => {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // selectedProducts will store product id selections for each step
  const [selectedProducts, setSelectedProducts] = useState({});

  // Fetch products when the step changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products?category=${steps[currentStep].category}`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentStep]);

  const handleSelect = (product) => {
    setSelectedProducts({ ...selectedProducts, [currentStep]: product.id });
  };

  const handleNext = () => {
    // If we're not on the last step, move to next
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step: assemble selected product ids and redirect to checkout
      const selectedIds = Object.values(selectedProducts);
      // Redirect with IDs as query parameters, e.g. ?products=1,2,3,4
      router.push(`/checkout?products=${selectedIds.join(',')}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <p>Step {currentStep + 1} of {steps.length}</p>
        <h1>{steps[currentStep].title}</h1>
        <p>{steps[currentStep].subheading}</p>
      </div>
      {loading && <p>Loading products...</p>}
      {error && <p>Error: {error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {products.map((product) => (
          <div key={product.id} onClick={() => handleSelect(product)} style={{
            border: selectedProducts[currentStep] === product.id ? '2px solid blue' : '1px solid #ccc',
            borderRadius: '8px',
            cursor: 'pointer',
            padding: '0.5rem'
          }}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        {currentStep > 0 && (
          <button onClick={handleBack}>Back</button>
        )}
        <button
          onClick={handleNext}
          disabled={!selectedProducts[currentStep]}
        >
          {currentStep === steps.length - 1 ? 'Continue to Checkout' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Customize; 