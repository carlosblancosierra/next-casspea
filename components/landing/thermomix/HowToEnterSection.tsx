import Section from './Section';
import StepCard from './StepCard';
import { FaShareSquare } from 'react-icons/fa';
import * as C from './contants';

const IG_URL_UTM = `${C.INSTAGRAM_URL}?utm_source=website&utm_medium=landing&utm_campaign=tm7_giveaway`;

export default function HowToEnterSection() {
  return (
    <Section title={C.HOW_TO_ENTER_TITLE} extraClass="mt-10">
      <ol className="grid md:grid-cols-3 gap-4">
        {C.HOW_TO_ENTER_STEPS.map((step: string, idx: number) => (
          <StepCard key={idx} index={idx + 1} text={step} />
        ))}
      </ol>
      <p className="mt-3 text-sm secondary-text dark:secondary-text">{C.HOW_TO_ENTER_NOTE}</p>

      <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={IG_URL_UTM}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          <FaShareSquare className="mr-2" />
          {C.BUTTON_VIEW_STORY_TEXT}
        </a>
        <a
          href={IG_URL_UTM}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100"
        >
          <FaShareSquare className="mr-2" />
          {C.BUTTON_SHARE_STORY_TEXT}
        </a>
      </div>

      <p className="mt-4 text-xs secondary-text dark:secondary-text">{C.TAGGING_NOTE}</p>
    </Section>
  );
}