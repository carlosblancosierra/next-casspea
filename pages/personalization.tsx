import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProductCard from '../components/store/ProductCard';
import { customizationCopy } from '../constants/customization';

const Personalization = () => {
  const router = useRouter();
  const { products } = router.query; // expecting a comma-separated list of product ids
  const [boxProducts, setBoxProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!router.isReady || !products) return;
    const productIds = typeof products === 'string' ? products.split(',') : [];
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Assuming an endpoint that can fetch multiple products by ids
        const res = await fetch(`/api/products?ids=${productIds.join(',')}`);
        if (!res.ok) throw new Error('Failed to fetch product details');
        const data = await res.json();
        setBoxProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [router.isReady, products]);

  const handleSaveMessage = async () => {
    if (message.length > 200) return;
    try {
      const res = await fetch('/api/personalization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });
      if (!res.ok) throw new Error('Failed to save message');
      setSuccessMessage('Message saved successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <h1>{customizationCopy.postPurchase.heading}</h1>
      <p>{customizationCopy.postPurchase.subheading}</p>
      {loading && <p>Loading preview...</p>}
      {error && <p>Error: {error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        {boxProducts.map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </div>
      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={200}
          placeholder={customizationCopy.postPurchase.messagePlaceholder}
          rows={4}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>
      <button onClick={handleSaveMessage} disabled={message.length > 200} style={{ marginTop: '1rem' }}>
        Save Message
      </button>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default Personalization; 