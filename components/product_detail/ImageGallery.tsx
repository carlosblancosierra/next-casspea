import Image from "next/image";

type ImageGalleryProps = {
    images: string[];
};

const ImageGallery = ({ images }: ImageGalleryProps) => {
    return (
        <div className="flex items-start relative">
            <div className="flex flex-col flex-1 gap-y-4 md:px-10">
                {images.map((url, index) => {
                    return (
                        <div
                            className="relative aspect-[4/5] w-full overflow-hidden rounded-lg shadow" key={index}
                        >
                            <Image
                                src={url}
                                priority={index <= 2 ? true : false}
                                className="absolute inset-0 rounded-rounded"
                                width={0}
                                height={0}
                                sizes="100vw"
                                alt={`Product image ${index + 1}`}
                                fill
                                style={{
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ImageGallery;
