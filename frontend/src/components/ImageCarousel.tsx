import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import Carousel CSS
import { Image } from "@nextui-org/react";

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  return (
    <div className="w-full h-full">
      <Carousel
        showArrows
        infiniteLoop
        autoPlay
        interval={3000}
        showThumbs={false}
        showStatus={false}
        className="rounded-lg shadow-md"
      >
        {images.map((image, index) => (
          <div key={index} className="w-full h-64 flex justify-center items-center">
            <Image
              src={image}
              alt={`Carousel Image ${index + 1}`}
              className="object-contain w-auto h-full max-h-full rounded-lg"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
