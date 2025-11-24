import { FaCheckCircle } from 'react-icons/fa';

export default function Badge({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-main-bg dark:bg-main-bg-dark p-3 shadow">
      <FaCheckCircle className="text-green-600 dark:text-green-400" />
      <span className="text-primary-text dark:text-primary-text">{text}</span>
    </div>
  );
}