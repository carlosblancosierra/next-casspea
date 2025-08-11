import Section from './Section';
import * as C from './contants';

export default function KeyTermsSection() {
  return (
    <Section title={C.GIVEAWAY_RULES_TITLE} extraClass="mt-10">
      <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
        {C.GIVEAWAY_RULES_LIST.map((rule: string, idx: number) => (
          <li key={idx}>{rule}</li>
        ))}
      </ol>
    </Section>
  );
}