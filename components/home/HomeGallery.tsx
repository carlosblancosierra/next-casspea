import React from 'react';
import Image from 'next/image';

const HomeGallery: React.FC = () => {
  const images = [
    "/home/gallery/1.jpg",
    "/home/gallery/2.jpg",
    "/home/gallery/3.jpg",
    "/home/gallery/4.jpg",
    "/home/gallery/5.jpg",
    "/home/gallery/6.jpg",
    "/home/gallery/7.jpg",
    "/home/gallery/8.jpg",
    "/home/gallery/9.jpg",
    "/home/gallery/10.jpg",
    "/home/gallery/11.jpg",
    "/home/gallery/12.jpg",
  ];

  // Group images in sets of 3 for each grid item
  const groupedImages = [];
  for (let i = 0; i < images.length; i += 3) {
    groupedImages.push(images.slice(i, i + 3));
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {groupedImages.map((group, groupIndex) => (
        <div key={groupIndex} className="grid gap-4">
          {group.map((src, index) => (
            <div key={index}>
              <Image
                src={src}
                alt={`Gallery image ${groupIndex * 3 + index + 1}`}
                className="h-auto w-full rounded-lg"
                width={0}
                height={0}
                sizes='100vw'
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HomeGallery;
