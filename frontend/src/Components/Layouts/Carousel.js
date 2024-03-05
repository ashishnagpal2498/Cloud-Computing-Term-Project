import React, { useRef, useEffect } from 'react';
import '../../Stylesheets/carousel.css'; // Import your CSS file for styling

const Carousel = ({ images }) => {
  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    let scrollLeft = 0;

    const animateCarousel = () => {
      // Check if the carousel has reached the end
      if (scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
        scrollLeft = 0; // Reset back to the beginning
      } else {
        scrollLeft += 1; // Increment scroll position
      }

      // Apply smooth transition using CSS animation
      carousel.style.transition = 'transform 0.05s ease-in-out';
      carousel.style.transform = `translateX(-${scrollLeft}px)`;

      // Queue the next animation frame
      requestAnimationFrame(animateCarousel);
    };

    // Start the animation
    animateCarousel();

    // Cleanup function
    return () => {
      // Stop the animation when the component unmounts
      cancelAnimationFrame(animateCarousel);
    };
  }, []); // Run only once on component mount

  return (
    <div className="carousel-container">
      <div className='carousel-text'>
        <h2 className='carousel-heading'> Sort your images Automatically </h2>
        <p className='carousel-desc'>Need to provide images to your friends and family, but they only want their specific images. Get your images segregated automatically and share among others. </p>
      </div>
      <div className="carousel" ref={carouselRef}>
        {images.map((image, index) => (
          <div key={index} className="carousel-item">
            <img src={image} alt={`Image ${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
