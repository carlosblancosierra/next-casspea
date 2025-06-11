import React from "react";

type ColoredListItem = 
  | string 
  | { text: string; colorKey: string };

type ColoredListProps = {
  items: ColoredListItem[];
  useCustomColors?: boolean;
};

const colorDict: Record<string, string> = {
  black: "text-black dark:text-white",
  red: "text-red-500 dark:text-red-400",
  orange: "text-orange-500 dark:text-orange-400",
  yellow: "text-yellow-500 dark:text-yellow-400",
  green: "text-green-500 dark:text-green-400",
  blue: "text-blue-500 dark:text-blue-400",
  pink: "text-pink-500 dark:text-pink-500",
  purple: "text-purple-500 dark:text-purple-500",
  // add more as needed
};

const defaultColorClasses = [
  colorDict.pink,
  colorDict.green,
  colorDict.red,
  colorDict.orange,
  colorDict.purple,
];

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const ColoredList: React.FC<ColoredListProps> = ({ items, useCustomColors }) => {
  const shuffledColors = React.useMemo(
    () => shuffle(defaultColorClasses),
    [items.length]
  );

  return (
    <ol className="mt-4 space-y-1 list-decimal list-inside">
      {items.map((item, idx) => {
        if (typeof item === "string" || !useCustomColors) {
          // Fallback to old behavior
          return (
            <li
              key={idx}
              className={`font-bold ${shuffledColors[idx % shuffledColors.length]}`}
            >
              {typeof item === "string" ? item : item.text}
            </li>
          );
        }
        // New: use custom colorKey
        const colorClass = colorDict[item.colorKey] || "";
        return (
          <li
            key={idx}
            className={`font-bold ${colorClass}`}
          >
            {item.text}
          </li>
        );
      })}
    </ol>
  );
};

export default ColoredList;
