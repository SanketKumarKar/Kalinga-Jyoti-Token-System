import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-red-950 text-orange-200/80 py-6 border-t border-orange-900 mt-auto w-full z-10 relative">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm font-medium mb-1">
          Developed & Maintained by <span className="font-bold text-orange-300">Kalinga Jyoti Tech Team</span>
        </p>
        <p className="text-xs text-orange-400/60 mt-2 font-serif tracking-wide">
          &copy; {new Date().getFullYear()} Kalinga Jyoti. All Rights Reserved. Intellectual Property of Kalinga Jyoti.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
