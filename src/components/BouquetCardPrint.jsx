import { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import { motion } from "framer-motion";

export default function BouquetCardPrint({ onClose, secretWord = "secret" }) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [customNote, setCustomNote] = useState(
    "To the one who brings color into my world: nestled in this bouquet are ten blossoms from my heart. Scan the code to unlock your secret garden."
  );
  const [websiteUrl, setWebsiteUrl] = useState("");

  useEffect(() => {
    const currentUrl = typeof window !== "undefined" ? window.location.origin : "https://secret-garden.vercel.app";
    setWebsiteUrl(currentUrl);

    QRCode.toDataURL(currentUrl, {
      width: 320,
      margin: 1,
      color: {
        dark: "#3D3226", // ink color
        light: "#FAF5ED", // parchment background
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Code error:", err));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/50 backdrop-blur-sm p-4 flex flex-col items-center justify-center">
      {/* Non-printed Controls Bar */}
      <div className="w-full max-w-md flex justify-between items-center mb-4 print:hidden">
        <button
          onClick={onClose}
          className="text-xs uppercase tracking-wider text-parchment hover:text-white px-3 py-1.5 rounded-full border border-white/20 transition-colors"
        >
          ✕ Close Preview
        </button>
        <button
          onClick={handlePrint}
          className="text-xs uppercase tracking-wider font-semibold bg-sage text-white px-5 py-2 rounded-full shadow-lg hover:bg-sage/90 transition-all flex items-center gap-1.5"
        >
          🖨️ Print Companion Card
        </button>
      </div>

      {/* The Printable Card Canvas */}
      <div
        id="printable-bouquet-card"
        className="w-full max-w-sm bg-[#FAF5ED] rounded-3xl p-6 sm:p-8 border border-ink/15 shadow-2xl relative text-center text-ink print:shadow-none print:border-ink/30 print:m-0 print:max-w-none print:w-[3.75in] print:h-[5.5in]"
        style={{
          boxShadow: "0 25px 50px -12px rgba(61, 50, 38, 0.25)",
        }}
      >
        {/* Botanical corner flourish */}
        <div className="absolute top-3 left-3 text-sage/40 text-lg select-none">❧</div>
        <div className="absolute top-3 right-3 text-sage/40 text-lg select-none">☙</div>
        <div className="absolute bottom-3 left-3 text-sage/40 text-lg select-none">☙</div>
        <div className="absolute bottom-3 right-3 text-sage/40 text-lg select-none">❧</div>

        {/* Card Header */}
        <div className="mb-4">
          <p className="text-[10px] font-sans uppercase tracking-widest text-ink/40">
            A Birthday Keepsake
          </p>
          <h2 className="font-hand text-3xl sm:text-4xl text-dusk mt-0.5">
            The Secret Garden
          </h2>
          <div className="w-12 h-0.5 bg-blush mx-auto mt-2 rounded-full" />
        </div>

        {/* Personalized Message */}
        <div className="my-4">
          <p className="font-serif italic text-sm sm:text-base leading-relaxed text-ink/80">
            "{customNote}"
          </p>
        </div>

        {/* QR Code Container */}
        <div className="my-5 flex flex-col items-center justify-center">
          <div className="p-2 bg-white rounded-2xl shadow-sm border border-ink/10 inline-block">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Secret Garden QR Code"
                className="w-36 h-36 object-contain rounded-lg"
              />
            ) : (
              <div className="w-36 h-36 bg-parchment animate-pulse rounded-lg" />
            )}
          </div>
          <p className="text-[11px] font-sans tracking-wide text-ink/50 mt-2">
            scan with your camera to begin
          </p>
        </div>

        {/* Whisper Secret Word Hint Box */}
        <div className="bg-sage/10 rounded-xl py-2 px-3 border border-sage/20 inline-block max-w-[90%]">
          <p className="text-[10px] uppercase font-sans tracking-wider text-ink/50">
            gate whisper code
          </p>
          <p className="font-hand text-xl text-ink font-semibold mt-0.5">
            "{secretWord}"
          </p>
        </div>

        <p className="font-hand text-lg text-dusk/60 mt-4">
          with all my love, always
        </p>
      </div>

      {/* Optional Note Edit field for the gift giver */}
      <div className="w-full max-w-sm mt-4 bg-parchment/90 backdrop-blur-md rounded-2xl p-3 border border-ink/10 print:hidden text-xs text-ink/70">
        <label className="block font-medium mb-1 text-ink/60">Edit Note for Card:</label>
        <textarea
          value={customNote}
          onChange={(e) => setCustomNote(e.target.value)}
          rows={2}
          className="w-full p-2 bg-white/70 rounded-lg border border-ink/20 text-xs text-ink focus:outline-none focus:border-sage"
        />
      </div>
    </div>
  );
}
