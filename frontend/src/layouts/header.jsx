import React, { useState } from 'react';

const Header = () => {
  const [cartCount, setCartCount] = useState(0);

  return (
    <header className="w-full">
      {/* Notification Banner */}
      <div style={{backgroundColor: 'var(--main-color)', opacity: 0.3}} className="text-black font-bold text-xs sm:text-sm md:text-base py-2 px-4 text-center">
        Due To Severe Weather Conditions In Certain Regions, There May Be Disruptions In Delivery Services. We Appreciate Your Understanding And Patience During This Time.
      </div>
    </header>
  );
};

export default Header;