"use client";

export default function CoupangBanner() {
  return (
    <div className="flex justify-center">
      <iframe
        src="/coupang-ad.html"
        width="320"
        height="100"
        style={{ border: "none", overflow: "hidden" }}
        scrolling="no"
      />
    </div>
  );
}
