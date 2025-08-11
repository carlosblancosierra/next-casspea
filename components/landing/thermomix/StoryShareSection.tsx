import Section from './Section';
import * as C from './contants';

export default function StoryShareSection() {
  return (
    <Section title={C.STORY_SHARE_TITLE} extraClass="mt-10">
      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
        {C.STORY_SHARE_STEPS.map((line: string, idx: number) => (
          <li key={idx}>{line}</li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{C.IG_DISCLAIMER}</p>
    </Section>
  );
}