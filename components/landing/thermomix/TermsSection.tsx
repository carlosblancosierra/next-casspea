import Link from 'next/link';
import Section from './Section';
import * as C from './contants';

export default function TermsSection() {
  return (
    <Section title={C.TERMS_TITLE} extraClass="mt-10 mb-10">
      {C.TERMS_PARAGRAPHS.map((para: string, idx: number) => {
        if (para.toLowerCase().includes('privacy policy')) {
          const [before, after] = para.split(/Privacy Policy/i);
          return (
            <p key={idx} className="text-gray-700 dark:text-gray-300">
              {before}
              <Link href={C.PRIVACY_POLICY_PATH} className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              {after}
            </p>
          );
        }
        return (
          <p key={idx} className="text-gray-700 dark:text-gray-300">
            {para}
          </p>
        );
      })}
      <p className="text-gray-700 dark:text-gray-300">
        8. Contact us at{' '}
        <a href="mailto:hello@casspea.co.uk" className="text-blue-600 hover:underline">
          hello@casspea.co.uk
        </a>{' '}
        for questions.
      </p>
    </Section>
  );
}