import React from 'react';
import { Link } from 'react-router-dom';
// Import images
import power1 from '../../assets/images/power1.webp';
import power2 from '../../assets/images/power2.webp';
import power3 from '../../assets/images/power3.webp';
import power4 from '../../assets/images/power4.webp';
import power5 from '../../assets/images/power5.webp';
import power6 from '../../assets/images/power6.jpg';
import heroslider1 from '../../assets/images/heroslider1.webp';
import heroslider2 from '../../assets/images/heroslider2.jpg';
import heroslider3 from '../../assets/images/heroslider3.jpg';
import heroslider4 from '../../assets/images/heroslider4.webp';
import image1 from '../../assets/images/image1.jpg';

const PowerSolutions = () => {
  // Data structure for power solutions based on the image
  const topRowSolutions = [
    {
      id: 1,
      title: 'Solar Module',
      image: power1,
      link: '/products/solar-module',
    },
    {
      id: 2,
      title: 'Solar Inverter',
      image: power2,
      link: '/products/solar-inverter',
    },
    {
      id: 3,
      title: 'Li-ion Battery',
      image: power3,
      link: '/products/li-ion-battery',
    },
    {
      id: 4,
      title: 'Rooftops',
      image: power4,
      link: '/products/rooftops',
    },
    {
      id: 5,
      title: 'Radiance Solar Kit',
      image: power5,
      link: '/products/radiance-solar-kit',
    },
    {
      id: 6,
      title: 'Save More',
      image: power6,
      link: '/products/save-more',
    },
  ];

  const bottomRowSolutions = [
    {
      id: 7,
      title: 'Solar Panel',
      image: heroslider1,
      link: '/products/solar-panel',
    },
    {
      id: 8,
      title: 'Small Solar Modules',
      image: heroslider2,
      link: '/products/small-solar-modules',
    },
    {
      id: 9,
      title: 'Flexible Solar Module',
      image: heroslider3,
      link: '/products/flexible-solar-module',
    },
    {
      id: 10,
      title: 'Mono PERC Solar Modules',
      image: heroslider4,
      link: '/products/mono-perc-solar-modules',
    },
    {
      id: 11,
      title: 'Bifacial Solar Modules',
      image: image1,
      link: '/products/bifacial-solar-modules',
    },
  ];

  return (
    <div className="container mx-auto px-6 md:px-8 lg:px-10 py-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8">Power Solutions For Every Lifestyle</h2>
      
      {/* Top row solutions */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
        {topRowSolutions.map((solution) => (
          <Link 
            key={solution.id} 
            to={solution.link}
            className="rounded-lg overflow-hidden shadow-md hover:shadow-lg hover:bg-yellow-200 transition-all"
          >
            <div className="aspect-square">
              <img 
                src={solution.image} 
                alt={solution.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                }}
              />
            </div>
            <div className="p-1 sm:p-2 text-center">
              <p className="text-xs sm:text-sm font-medium text-black">{solution.title}</p>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Bottom row solutions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {bottomRowSolutions.map((solution) => (
          <Link 
            key={solution.id} 
            to={solution.link}
            className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="aspect-video">
              <img 
                src={solution.image} 
                alt={solution.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                }}
              />
            </div>
            <div className="absolute top-0 left-0 right-0 p-1 sm:p-2">
              <p className="text-xs sm:text-sm md:text-base font-medium text-center text-white bg-black bg-opacity-30 rounded py-1">{solution.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PowerSolutions;