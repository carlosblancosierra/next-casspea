"use client";
import React from "react";
import { motion, useAnimation } from "framer-motion";
import { wrap } from "popmotion";
import { useGetFlavoursQuery } from '@/redux/features/flavour/flavourApiSlice';
import FlavourCard from "./FlavourCard";
import Spinner from "@/components/common/Spinner";
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function FlavourCarousel() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [page, setPage] = React.useState(0);
  const { data: flavours, isLoading, error } = useGetFlavoursQuery();
  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
        <Spinner md />
    </div>
  );
  if (error) return <div>Error:</div>;

  const CAROUSEL_LENGTH = flavours?.length ?? 0;
  const GAP = 15;
  const gapSum = (CAROUSEL_LENGTH - 1) * GAP;

  const currIndex = wrap(0, CAROUSEL_LENGTH, page);

  const paginate = (newDirection: number) => {
    setPage((p) => p + newDirection);
  };

  const calcX = (index: number): number => {
    if (!carouselRef.current) return 0;

    const childWidth =
      (carouselRef.current.offsetWidth - gapSum) / CAROUSEL_LENGTH;
    return index * childWidth + index * GAP;
  };

  if (flavours?.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="flex overflow-x-hidden py-5 bg-main-bg dark:bg-main-bg-dark" // Background adjusted for dark mode
    >
      <motion.div
        ref={carouselRef}
        drag="x"
        animate={controls}
        transition={{
          type: "spring",
          damping: 40,
          stiffness: 400
        }}
        onDragEnd={(e, { velocity, offset, point }) => {
          if (!carouselRef.current || !containerRef.current) return;

          const swipe = swipePower(offset.x, velocity.x);
          const isRightDirection = offset.x > 45 && velocity.x >= 0;

          const isPointOkay = point.x !== 0 && point.y !== 0;
          const isLeftDirection =
            offset.x < -45 && velocity.x <= 0 && isPointOkay;

          const childW =
            (carouselRef.current.offsetWidth - gapSum) / CAROUSEL_LENGTH;

          const carouselDiments = carouselRef.current.getBoundingClientRect();
          const containerDiments = containerRef.current.getBoundingClientRect();

          const isPassedBoundaries =
            containerDiments.right > carouselDiments.right - childW;

          let newCurrIndex = currIndex;
          let switchSlideBy = Math.ceil(-offset.x / (childW + GAP));

          if (swipe > swipeConfidenceThreshold || isRightDirection) {
            switchSlideBy = switchSlideBy - 1;

            newCurrIndex =
              currIndex > 0 ? currIndex + switchSlideBy : currIndex;
            if (newCurrIndex < 0) newCurrIndex = 0;

            const indexDiff = newCurrIndex - currIndex;
            if (indexDiff < 0) {
              switchSlideBy = indexDiff;
            }

            if (currIndex > newCurrIndex) {
              paginate(switchSlideBy);
            }
          } else if (swipe > swipeConfidenceThreshold || isLeftDirection) {
            const lastIndex = CAROUSEL_LENGTH - 1;

            newCurrIndex =
              currIndex < lastIndex ? currIndex + switchSlideBy : currIndex;
            if (newCurrIndex > lastIndex) newCurrIndex = lastIndex;
            if (isPassedBoundaries) {
              const childrenOnScreen = Math.floor(
                containerRef.current.offsetWidth / childW
              );
              newCurrIndex = CAROUSEL_LENGTH - childrenOnScreen;
            }

            const indexDiff = newCurrIndex - currIndex;
            if (switchSlideBy > indexDiff) {
              switchSlideBy = indexDiff;
            }

            if (currIndex < newCurrIndex) {
              paginate(switchSlideBy);
            }
          }

          if (isPassedBoundaries && currIndex <= newCurrIndex) {
            const rightEdge =
              -carouselRef.current.offsetWidth +
              containerRef.current.offsetWidth;

            controls.start({ x: rightEdge });
          } else {
            controls.start({ x: -calcX(newCurrIndex) });
          }
        }}
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        className="flex gap-4"
      >
        {Array(CAROUSEL_LENGTH)
          .fill(0)
          .map((_, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 w-56 h-96 flex flex-col items-center justify-center bg-main-bg dark:bg-main-bg-dark text-black dark:text-white rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {flavours?.[index] && <FlavourCard flavour={flavours?.[index]} />}
            </motion.div>
          ))}
      </motion.div>
    </div>
  );
}
