import { FaCheckCircle } from 'react-icons/fa';

export default function Badge({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow">
      <FaCheckCircle className="text-green-600 dark:text-green-400" />
      <span className="text-gray-700 dark:text-gray-200">{text}</span>
    </div>
  );
}