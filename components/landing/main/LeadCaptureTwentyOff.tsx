import { useState } from 'react';
import { toast } from 'react-toastify';
import { FormCode, useSubscribeGenericLeadMutation } from '@/redux/features/subscribe/subscribeApiSlice';
import { useRouter } from 'next/navigation';

interface LeadCaptureTwentyOffProps {
  config: typeof import('../constants').LANDING_CONFIG.gold;
}

export default function LeadCaptureTwentyOff({ config }: LeadCaptureTwentyOffProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subscribeGenericLead, { isLoading: apiLoading, isError, error }] = useSubscribeGenericLeadMutation();
  const router = useRouter();

  // Gold and blue theme classes
  const themeClasses = config.leadCaptureTheme === 'gold'
    ? {
        section: 'border-yellow-200 dark:border-yellow-700',
        heading: 'text-3xl md:text-4xl font-extrabold text-white mb-2 text-center',
        subheading: 'text-lg text-white/90 mb-2 text-center',
        note: 'text-base text-white/80 mb-4 text-center font-medium',
        input: 'w-full sm:w-auto flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-50',
        button: 'px-6 py-3 rounded-lg bg-yellow-600 text-white font-semibold shadow hover:bg-yellow-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed',
        privacy: 'text-xs text-white/80 mt-3 text-center',
        privacyLink: 'underline hover:text-yellow-200 dark:hover:text-yellow-300',
      }
    : {
        section: 'border-blue-200 dark:border-gray-700',
        heading: 'text-3xl md:text-4xl font-extrabold text-white mb-2 text-center',
        subheading: 'text-lg text-white/90 mb-2 text-center',
        note: 'text-base text-white/80 mb-4 text-center font-medium',
        input: 'w-full sm:w-auto flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:bg-main-bg-dark dark:border-gray-600 dark:text-white',
        button: 'px-6 py-3 rounded-lg bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed',
        privacy: 'text-xs text-white/80 mt-3 text-center',
        privacyLink: 'underline hover:text-blue-200 dark:hover:text-blue-300',
      };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const code = config.leadCaptureTheme === 'gold' ? 'GOLD' : 'BLUE';
    try {
      await subscribeGenericLead({ email, lead_type: 'landing_page', form_code: code }).unwrap();
      // toast.success('Brilliant! Check your inbox for your 20% off code.');
      setEmail('');
      if (code === 'GOLD') {
        router.push('/landing/gold/thank-you');
      } else {
        router.push('/landing/blue/thank-you');
      }
    } catch (error) {
      toast.error('Sorry, something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="enter-form"
      className={`scroll-mt-32 rounded-xl shadow-lg p-6 md:p-10 mb-8 mx-auto max-w-2xl border ${config.leadCaptureBgClass || themeClasses.section}`}
    >
      <h2 className={themeClasses.heading}>
        Get 20% Off Your First Order
      </h2>
      <p className={themeClasses.subheading}>
        Subscribe to our newsletter and enjoy 20% off your first purchase. 
        Exclusive offers, new launches, and chocolate inspiration straight to your inbox.
      </p>
      <p className={themeClasses.note}>
        You must be subscribed to receive and use your discount code.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-center justify-center">
        <label htmlFor="lead-email" className="sr-only">Email address</label>
        <input
          type="email"
          id="lead-email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={themeClasses.input}
          placeholder="Enter your email address"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className={themeClasses.button}
        >
          {isLoading ? 'Signing you up...' : 'Claim 20% Off'}
        </button>
      </form>
      <p className={themeClasses.privacy}>
        We respect your privacy. <a href="/privacy-policy" className={themeClasses.privacyLink}>Read our Privacy Policy</a>.
      </p>
    </section>
  );
} 