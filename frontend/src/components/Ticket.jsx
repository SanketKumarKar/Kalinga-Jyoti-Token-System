import React, { memo } from "react";
import { QRCode } from "react-qr-code";

const FALLBACK_BANNER = "/Navy Yellow Retro Night Party Ticket.jpg";

const Ticket = memo(({ name, uuid, bannerUrl }) => {
  const banner = bannerUrl || FALLBACK_BANNER;

  return (
    <div
      className="relative w-full aspect-[3/1] max-w-4xl mx-auto rounded-xl overflow-hidden shadow-md"
      style={{
        backgroundImage: `url('${banner}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* QR/Name Container specifically positioned over the black stub */}
      <div 
        className="absolute top-0 bottom-0 flex flex-col justify-center items-center"
        style={{ right: "1.5%", width: "27.5%" }}
      >
        <p 
          className="text-center text-white font-bold drop-shadow-lg mb-1 sm:mb-2 w-full px-1 leading-tight"
          style={{ fontSize: "clamp(8px, 1.6vw, 22px)", wordWrap: "break-word" }}
        >
          {name}
        </p>
        <div className="bg-white p-1 md:p-1.5 rounded-lg w-[75%] max-w-[140px] aspect-square flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          <QRCode
            level="L"
            style={{ width: "100%", height: "100%" }}
            value={JSON.stringify({ name, uuid })}
          />
        </div>
      </div>
    </div>
  );
});

export default Ticket;
