"use client";

import { useEffect, useRef } from "react";

export default function CoupangBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    if (!containerRef.current) return;

    const sdk = document.createElement("script");
    sdk.src = "https://ads-partners.coupang.com/g.js";
    sdk.async = true;
    sdk.onload = () => {
      const init = document.createElement("script");
      init.textContent = `new PartnersCoupang.G({"id":966819,"template":"carousel","trackingCode":"AF8817271","width":"320","height":"100","tsource":""});`;
      containerRef.current?.appendChild(init);
    };
    containerRef.current.appendChild(sdk);
    loaded.current = true;
  }, []);

  return (
    <div ref={containerRef} className="flex justify-center" />
  );
}
