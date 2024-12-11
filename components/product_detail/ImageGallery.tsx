"use client"
import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";

interface ImageGalleryProps {
    images: string[];
    className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, className }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const controls = useAnimation();

    const slideImage = (direction: number) => {
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < images.length) {
            setCurrentIndex(newIndex);
            controls.start({
                x: `${-newIndex * 100}%`,
                transition: { duration: 0.5 }
            });
        }
    };

    const handleDragEnd = (event: any, info: any) => {
        const swipeThreshold = 50;
        if (Math.abs(info.offset.x) > swipeThreshold) {
            if (info.offset.x > 0 && currentIndex > 0) {
                slideImage(-1);
            } else if (info.offset.x < 0 && currentIndex < images.length - 1) {
                slideImage(1);
            } else {
                controls.start({ x: `${-currentIndex * 100}%` });
            }
        } else {
            controls.start({ x: `${-currentIndex * 100}%` });
        }
    };

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <motion.div
                drag="x"
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                animate={controls}
                className="flex cursor-grab active:cursor-grabbing"
                style={{ x: 0 }}
            >
                {images.map((url, idx) => (
                    <motion.div
                        key={idx}
                        className="min-w-[calc(100%-8px)] pr-2 box-border"
                    >
                        <div className="aspect-[4/5] relative rounded-lg shadow overflow-hidden">
                            <Image
                                src={url}
                                priority={idx <= 2}
                                className="rounded-lg"
                                alt={`Product image ${idx + 1}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="mt-4 flex w-full justify-center gap-2">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setCurrentIndex(idx);
                            controls.start({
                                x: `${-idx * 100}%`,
                                transition: { duration: 0.5 }
                            });
                        }}
                        className={`h-3 w-3 rounded-full transition-colors ${idx === currentIndex ? "bg-indigo-600" : "bg-indigo-200"
                            }`}
                        aria-label={`Go to image ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;
