// import React from 'react';

// const HomePage = () => {
//  return (
//    <div className="p-2 sm:p-6 bg-gradient-to-br from-yellow-500 via-red-400 to-orange-500 ">
//      <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg sm:p-6 p-4 text-white">
//        <h1 className="text-3xl font-bold mb-4 text-yellow-300">Jay Jagannath 🙏</h1>
//        <p className="mb-4">Dear Kalinga Jyoti Community,</p>
       
//        <p className="mb-4">Let's come together and celebrate the rich culture and traditions of Odisha.</p>
//        <p className="mb-4">A big thank you to those who have already registered! We look forward to sharing a wonderful experience with you all tomorrow.</p>
//        <p className="mb-4">See you there!</p>
//        <p className="mb-4">Warmly,</p>
//        <p>The Kalinga Jyoti Community Team</p>
//      </div>
//      <div className="mt-6">
//        <img src="event_poster.jpg" alt="Event Poster" className="rounded-lg shadow-lg w-full" />
//      </div>
//    </div>
//  );
// };

// export default HomePage;



import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-orange-950 via-red-950 to-amber-950">
      
      {/* Abstract Traditional Background Patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Ambient lighting glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-500 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Main Content Card */}
      <div className="max-w-3xl w-full relative z-10 backdrop-blur-md bg-black/40 border border-orange-500/30 rounded-3xl shadow-2xl p-6 sm:p-12 text-center transform transition-all duration-700 hover:shadow-orange-900/60 hover:border-orange-500/50">
        
        {/* Decorative Top Accent */}
        <div className="flex justify-center mb-6 opacity-80">
          <svg className="w-24 sm:w-32 h-6 sm:h-8 text-orange-400" viewBox="0 0 100 20" fill="currentColor">
            <path d="M50 0L60 10L50 20L40 10L50 0ZM10 10L20 20L0 20L10 10ZM90 10L100 20L80 20L90 10ZM30 15L35 20L25 20L30 15ZM70 15L75 20L65 20L70 15Z" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 drop-shadow-lg tracking-tight">
          Jay Jagannath <span className="inline-block animate-bounce text-yellow-400" style={{ animationDuration: '3s' }}>🙏</span>
        </h1>
        
        <div className="h-1.5 w-24 sm:w-32 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto rounded-full mb-6 sm:mb-8"></div>

        {/* Message */}
        <div className="space-y-4 sm:space-y-6 text-gray-200 text-base sm:text-xl font-medium leading-relaxed">
          <p className="text-white text-2xl sm:text-3xl font-semibold font-serif italic">Dear Kalinga Jyoti Community,</p>
          <p className="px-2 sm:px-4">
            Let's come together and celebrate the rich culture and traditions of Odisha.
          </p>
          <p className="px-2 sm:px-4 text-gray-300 text-sm sm:text-base">
            A big thank you to those who have already registered! We look forward to sharing a wonderful experience with you all tomorrow.
          </p>
          <div className="pt-6 sm:pt-8 font-semibold text-orange-200">
            <p className="text-xl sm:text-2xl">See you there!</p>
            <p className="mt-3 sm:mt-4 text-yellow-500 tracking-wider uppercase text-xs sm:text-sm">Warmly,</p>
            <p className="text-base sm:text-lg text-gray-300 font-serif italic">The Kalinga Jyoti Community Team</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
          <button
            onClick={() => navigate('/admin')}
            className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:-translate-y-1 transition-all duration-300 border border-orange-400/50 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            <svg className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span className="relative z-10">Go to Admin</span>
          </button>
          <button
            onClick={() => navigate('/scan')}
            className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-black/30 backdrop-blur-sm text-amber-500 border-2 border-amber-500/50 px-8 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-400 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-300"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
            <span>Go to Scan</span>
          </button>
        </div>

        {/* Decorative Bottom Accent */}
        <div className="flex justify-center mt-8 sm:mt-10 opacity-80 rotate-180">
          <svg className="w-24 sm:w-32 h-6 sm:h-8 text-orange-400" viewBox="0 0 100 20" fill="currentColor">
            <path d="M50 0L60 10L50 20L40 10L50 0ZM10 10L20 20L0 20L10 10ZM90 10L100 20L80 20L90 10ZM30 15L35 20L25 20L30 15ZM70 15L75 20L65 20L70 15Z" />
          </svg>
        </div>

      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 w-full text-center z-20 pointer-events-none my-4">
        <p className="text-orange-300/60 text-sm tracking-wider font-serif">
          Made by Kalinga Jyoti Tech Team 2025-2026
        </p>
      </div>
    </div>
  );
};

export default HomePage;