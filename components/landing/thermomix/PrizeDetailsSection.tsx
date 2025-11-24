import Section from './Section';
import * as C from './contants';
import ColoredList from '@/components/common/ColoredList';

export default function PrizeDetailsSection() {
  return (
    <Section title={C.PRIZE_DETAILS_TITLE} extraClass="mt-10">
      <p className="secondary-text dark:secondary-text">{C.PRIZE_DETAILS_PARAGRAPH}</p>
      <ColoredList items={C.PRIZE_DETAILS_LIST} />
    </Section>
  );
}