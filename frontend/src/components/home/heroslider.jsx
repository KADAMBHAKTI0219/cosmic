import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
// Note: Navigation is not imported as we're removing navigation buttons

// Import hero slider images
import heroslider1 from '../../assets/images/heroslider1.webp';
import heroslider2 from '../../assets/images/heroslider2.jpg';
import heroslider3 from '../../assets/images/heroslider3.jpg';
import heroslider4 from '../../assets/images/heroslider4.webp';

// Slider data - removed green and blue sliders
const sliderData = [
  {
    id: 1,
    image: heroslider1,
    alt: "Solar panels on house roof",
    heading1: "YOUR SATISFACTION",
    heading2: "OUR PROMISE",
    description: "COSMIC POWERTECH - LETS BUILD A GREENER INDIA TOGETHER",
    buttonText: "Learn More"
  },
  {
    id: 4,
    image: heroslider4,
    alt: "Solar installation on house",
    heading1: "YOUR SATISFACTION",
    heading2: "OUR PROMISE",
    description: "COSMIC POWERTECH #LETSBUILDAGREENERINDIATOGETHER",
    buttonText: "Contact Us"
  }
];

const HeroSlider = () => {
  return (
    <div className="relative w-full">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        effect={'fade'}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={false}
        modules={[Autoplay, Pagination, EffectFade]}
        className="mySwiper h-[400px] sm:h-[450px] md:h-[550px] lg:h-[650px] xl:h-[700px]"
      >
        {sliderData.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              <img 
                src={slide.image} 
                alt={slide.alt} 
                className="w-full h-full object-cover"
              />
              {/* <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-24">
                <h2 className="text-white text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-4">{slide.heading1}</h2>
                <h2 className="text-white text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-6">{slide.heading2}</h2>
                <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium mb-4 sm:mb-8">{slide.description}</p>
                <button 
                  className="bg-main hover:bg-main-dark text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg w-fit transition duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base"
                >
                  {slide.buttonText}
                </button>
              </div> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom pagination styles */}
      <style>{`
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: white;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          background: var(--main-color);
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;