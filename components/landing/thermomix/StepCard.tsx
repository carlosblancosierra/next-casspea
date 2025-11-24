export default function StepCard({ index, text }: { index: number; text: string }) {
  return (
    <li className="relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow">
      <span className="absolute -top-3 -left-3 inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold">
        {index}
      </span>
      <p className="text-primary-text dark:text-primary-text pl-6">{text}</p>
    </li>
  );
}