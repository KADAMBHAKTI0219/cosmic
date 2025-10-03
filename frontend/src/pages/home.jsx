import React from 'react';
import HeroSlider from '../components/home/heroslider';
import MostLoved from '../components/home/mostLoved';
import PowerSolutions from '../components/home/powerSolutions';
import WhySwitchingToSolar from '../components/home/whyswitchingtosolar';
import CertifiedAndBanner from '../components/home/certifiedandbanner';
import CosmicEnergies from '../components/home/cosmicenergies';
import KnowYourNeed from '../components/home/knowyourneed';
import SolarConsiderations from '../components/home/SolarConsiderations';
import Testimonial from '../components/home/testimonial';
import Blogs from '../components/blogs';

const Home = () => {
  return (
    <div>
      <HeroSlider/>
      <MostLoved/>
      <PowerSolutions/>
      <WhySwitchingToSolar/>
      <CertifiedAndBanner/>
      <CosmicEnergies/>
      <KnowYourNeed/>
      <SolarConsiderations/>
      <Testimonial/>
      <Blogs/>
    </div>
  );
};

export default Home;