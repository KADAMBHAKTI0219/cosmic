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
    <div className="w-full relative">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + ' custom-bullet"></span>';
          },
        }}
        navigation={false}
        className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px]"
      >
        {sliderData.map((slide, index) => (
          <SwiperSlide key={index} className="relative">
            <div className="absolute inset-0 bg-black/30 z-10"></div>
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center z-20 px-6 md:px-8 lg:px-10">
              <div className="max-w-7xl mx-auto w-full">
                <div className="max-w-xl">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                    {slide.heading1}
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-white mb-6 drop-shadow-md">
                    {slide.description}
                  </p>
                  <button className="bg-main text-white px-6 py-3 rounded-md text-base font-medium hover:bg-main-dark transition duration-300 shadow-lg">
                    {slide.buttonText}
                  </button>
                </div>
              </div>
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