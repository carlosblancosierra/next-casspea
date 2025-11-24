import Section from './Section';
import * as C from './contants';

export default function SocialProofSection() {
  if (!C.SOCIAL_PROOF_ITEMS?.length) return null;
  return (
    <Section title={C.SOCIAL_PROOF_TITLE} extraClass="mt-10">
      <ul className="grid md:grid-cols-3 gap-4 secondary-text dark:secondary-text">
        {C.SOCIAL_PROOF_ITEMS.map((item: string, i: number) => (
          <li
            key={i}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow"
          >
            {item}
          </li>
        ))}
      </ul>
    </Section>
  );
}