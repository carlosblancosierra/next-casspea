import React from "react";
import { motion, useAnimation } from "framer-motion";
import { wrap } from "popmotion";

const CAROUSEL_LENGTH = 8;
const GAP = 25;
const gapSum = (CAROUSEL_LENGTH - 1) * GAP;

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function Carousel() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [page, setPage] = React.useState(0);

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

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        overflowX: "hidden",
        backgroundColor: "pink"
      }}
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

          console.clear();

          const swipe = swipePower(offset.x, velocity.x);
          const isRightDirection = offset.x > 45 && velocity.x >= 0;

          /*
            https://github.com/framer/motion/issues/1087
            when touch event by y axis, point is 0 by all axis,
            therfore offset calculates wrong numbers.
          */
          const isPointOkay = point.x !== 0 && point.y !== 0;
          const isLeftDirection =
            offset.x < -45 && velocity.x <= 0 && isPointOkay;

          const childW =
            (carouselRef.current.offsetWidth - gapSum) / CAROUSEL_LENGTH;

          const carouselDiments = carouselRef.current.getBoundingClientRect();
          const containerDiments = containerRef.current.getBoundingClientRect();
          console.log(containerDiments);

          console.log(containerDiments.right, carouselDiments.right, childW);

          const isPassedBoundaries =
            containerDiments.right > carouselDiments.right - childW;

          let newCurrIndex = currIndex;
          let switchSlideBy = Math.ceil(-offset.x / (childW + GAP));

          if (swipe > swipeConfidenceThreshold || isRightDirection) {
            switchSlideBy = switchSlideBy - 1;

            newCurrIndex =
              currIndex > 0 ? currIndex + switchSlideBy : currIndex;
            if (newCurrIndex < 0) newCurrIndex = 0;

            console.log("swipe to right", `${currIndex} to ${newCurrIndex}`);

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

            console.log("swipe to left", `${currIndex} to ${newCurrIndex}`);

            const indexDiff = newCurrIndex - currIndex;
            if (switchSlideBy > indexDiff) {
              switchSlideBy = indexDiff;
            }

            if (currIndex < newCurrIndex) {
              paginate(switchSlideBy);
            }
          }

          // if carousel has passed the boundaries of a container
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
        style={{
          display: "flex",
          gap: GAP,
          backgroundColor: "yellow"
        }}
      >
        {Array(CAROUSEL_LENGTH)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "red",
                width: 300,
                height: 400,
                borderRadius: 20,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "56px"
              }}
            >
              {index}
            </div>
          ))}
      </motion.div>
    </div>
  );
}
