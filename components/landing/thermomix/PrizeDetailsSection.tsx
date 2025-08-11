import Section from './Section';
import * as C from './contants';

export default function PrizeDetailsSection() {
  return (
    <Section title={C.PRIZE_DETAILS_TITLE} extraClass="mt-10">
      <p className="text-gray-700 dark:text-gray-300">{C.PRIZE_DETAILS_PARAGRAPH}</p>
      <ul className="list-disc list-inside space-y-1 mt-2 text-gray-700 dark:text-gray-300">
        {C.PRIZE_DETAILS_LIST.map((line: string, idx: number) => (
          <li key={idx}>{line}</li>
        ))}
      </ul>
    </Section>
  );
}