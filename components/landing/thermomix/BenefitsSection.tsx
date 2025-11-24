import Section from './Section';
import * as C from './contants';

export default function BenefitsSection() {
  return (
    <Section title={C.BENEFITS_TITLE} extraClass="mt-10">
      <ul className="grid md:grid-cols-3 gap-4 text-primary-text dark:text-primary-text">
        {C.BENEFITS_LIST.map((b: string, i: number) => (
          <li
            key={i}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow"
          >
            {b}
          </li>
        ))}
      </ul>
    </Section>
  );
}