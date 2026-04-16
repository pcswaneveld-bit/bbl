'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  naam: string;
  categorie: string;
  prijs: number;
  prijs_oud?: number;
  badge?: string;
  icon: string;
  bg: string;
  kleuren: string[];
  maten: string[];
  info: string;
}

const PRODUCTS: Product[] = [
  // ── TENUE ──────────────────────────────────────────────────
  {
    id: 1, naam: "Game Jersey — Thuis", categorie: "Tenue",
    prijs: 49.99, badge: "Bestseller", icon: "👕",
    bg: "linear-gradient(135deg,#0D2566,#1a3a8a)",
    kleuren: ["#FFFFFF","#0D2566","#D31F30"],
    maten: ["XS","S","M","L","XL","XXL"],
    info: "Officieel thuisshirt Dames 1 — lichtgewicht mesh",
  },
  {
    id: 2, naam: "Game Jersey — Uit", categorie: "Tenue",
    prijs: 49.99, icon: "👕",
    bg: "linear-gradient(135deg,#D31F30,#8b0f20)",
    kleuren: ["#D31F30","#0D2566"],
    maten: ["XS","S","M","L","XL","XXL"],
    info: "Officieel uitshirt Dames 1 — rood/navy",
  },
  {
    id: 3, naam: "Wedstrijdshorts", categorie: "Tenue",
    prijs: 34.99, icon: "🩳",
    bg: "linear-gradient(135deg,#0D2566,#071440)",
    kleuren: ["#0D2566","#D31F30","#FFFFFF"],
    maten: ["XS","S","M","L","XL","XXL"],
    info: "Bijpassende shorts met logo-band",
  },
  {
    id: 4, naam: "Wedstrijdpak Set", categorie: "Tenue",
    prijs: 79.99, prijs_oud: 84.98, badge: "Voordeel",
    icon: "🏀", bg: "linear-gradient(135deg,#111,#2a2a2a)",
    kleuren: ["#0D2566","#D31F30"],
    maten: ["XS","S","M","L","XL","XXL"],
    info: "Jersey + Shorts — samen €5 goedkoper",
  },

  // ── TRAINING ───────────────────────────────────────────────
  {
    id: 5, naam: "Training T-Shirt", categorie: "Training",
    prijs: 24.99, icon: "👕",
    bg: "linear-gradient(135deg,#222,#555)",
    kleuren: ["#0D2566","#D31F30","#222222"],
    maten: ["XS","S","M","L","XL","XXL"],
    info: "Technisch trainingsshirt met ventilatie-mesh",
  },
  {
    id: 6, naam: "Training Hoodie", categorie: "Training",
    prijs: 54.99, badge: "Nieuw", icon: "🧥",
    bg: "linear-gradient(135deg,#1a1a2e,#16213e)",
    kleuren: ["#0D2566","#222222"],
    maten: ["XS","S","M","L","XL","XXL"],
    info: "Warme clubhoodie met kangoeroe-zak",
  },
  {
    id: 7, naam: "Joggingbroek", categorie: "Training",
    prijs: 39.99, icon: "👖",
    bg: "linear-gradient(135deg,#0D2566,#071440)",
    kleuren: ["#0D2566","#222222"],
    maten: ["XS","S","M","L","XL","XXL"],
    info: "Comfortabele trainingbroek met logo-bies",
  },
  {
    id: 8, naam: "Warming-up Jack", categorie: "Training",
    prijs: 64.99, icon: "🧥",
    bg: "linear-gradient(135deg,#8b0f20,#D31F30)",
    kleuren: ["#D31F30","#0D2566","#222222"],
    maten: ["XS","S","M","L","XL","XXL"],
    info: "Winddicht jack voor voor/na de wedstrijd",
  },
  {
    id: 9, naam: "Trainingspak Complete", categorie: "Training",
    prijs: 94.99, prijs_oud: 94.98, badge: "Set Deal", icon: "🧥",
    bg: "linear-gradient(135deg,#0a1628,#1a3a8a)",
    kleuren: ["#0D2566","#222222"],
    maten: ["XS","S","M","L","XL","XXL"],
    info: "Hoodie + Joggingbroek — volledig trainingspak",
  },

  // ── ACCESSOIRES ────────────────────────────────────────────
  {
    id: 10, naam: "Teamsjaal", categorie: "Accessoires",
    prijs: 19.99, icon: "🧣",
    bg: "linear-gradient(90deg,#0D2566 50%,#D31F30 50%)",
    kleuren: ["#0D2566"],
    maten: ["One Size"],
    info: "Gebreide sjaal in clubkleuren",
  },
  {
    id: 11, naam: "Beanie", categorie: "Accessoires",
    prijs: 16.99, icon: "🧢",
    bg: "linear-gradient(135deg,#222,#444)",
    kleuren: ["#0D2566","#D31F30","#222222"],
    maten: ["One Size"],
    info: "Gebreide muts met geborduurde logo",
  },
  {
    id: 12, naam: "Team Sokken 2-pack", categorie: "Accessoires",
    prijs: 12.99, icon: "🧦",
    bg: "linear-gradient(135deg,#e8e8e8,#f5f5f5)",
    kleuren: ["#FFFFFF","#0D2566"],
    maten: ["35–38","39–42","43–46"],
    info: "Sportsokken met clubstrepen en logo",
  },
  {
    id: 13, naam: "Snapback Cap", categorie: "Accessoires",
    prijs: 22.99, badge: "Nieuw", icon: "🧢",
    bg: "linear-gradient(135deg,#0D2566,#1a3a8a)",
    kleuren: ["#0D2566","#D31F30","#222222"],
    maten: ["One Size"],
    info: "Verstelbare snapback met geborduurd logo",
  },
  {
    id: 14, naam: "Sporttas / Rugzak", categorie: "Accessoires",
    prijs: 44.99, icon: "🎒",
    bg: "linear-gradient(135deg,#1a1a1a,#3a3a3a)",
    kleuren: ["#0D2566","#222222"],
    maten: ["25L"],
    info: "Ruime sporttas met logo-patch en schoenvak",
  },
  {
    id: 15, naam: "Sport Bidon 750ml", categorie: "Accessoires",
    prijs: 14.99, icon: "🧴",
    bg: "linear-gradient(135deg,#D31F30,#8b0f20)",
    kleuren: ["#0D2566","#D31F30"],
    maten: ["750ml"],
    info: "BPA-vrije drinkfles met BBL club-print",
  },
  {
    id: 16, naam: "Polsbandjes 2-pack", categorie: "Accessoires",
    prijs: 9.99, icon: "🏅",
    bg: "linear-gradient(135deg,#0D2566,#D31F30)",
    kleuren: ["#FFFFFF","#0D2566","#D31F30"],
    maten: ["One Size"],
    info: "Stretch polsband met geborduurde logo",
  },
];

const CATEGORIEEN = ["Alles", "Tenue", "Training", "Accessoires"];

const BADGE_STYLE: Record<string, string> = {
  "Bestseller": "bg-amber-400 text-amber-900",
  "Voordeel":   "bg-green-500 text-white",
  "Nieuw":      "bg-[#D31F30] text-white",
  "Set Deal":   "bg-violet-600 text-white",
};

export default function ShopPage() {
  const [actief, setActief] = useState("Alles");
  const [cart, setCart] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedMaten, setSelectedMaten] = useState<Record<number, string>>({});

  const filtered = actief === "Alles" ? PRODUCTS : PRODUCTS.filter(p => p.categorie === actief);

  function addToCart(product: Product) {
    setCart(c => c + 1);
    setToast(product.naam);
    setTimeout(() => setToast(null), 2500);
  }

  function selectMaat(pid: number, maat: string) {
    setSelectedMaten(prev => ({ ...prev, [pid]: maat }));
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5]" style={{ fontFamily: "var(--font-geist-sans)" }}>

      {/* Toast */}
      <div className={`fixed top-20 right-5 z-50 transition-all duration-300 ${toast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
        <div className="bg-[#0D2566] text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-bold flex items-center gap-2.5">
          <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs">✓</span>
          <span>{toast} toegevoegd aan winkelwagen</span>
        </div>
      </div>

      {/* Cart button */}
      <button
        className="fixed bottom-24 right-5 z-50 bg-[#D31F30] hover:bg-[#b01828] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-colors"
        title="Winkelwagen"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {cart > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#0D2566] text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
            {cart > 9 ? "9+" : cart}
          </span>
        )}
      </button>

      {/* Hero */}
      <section className="bg-[#0D2566] text-white">
        <div className="max-w-7xl mx-auto px-8 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Link href="/" className="text-[#a0b4d0] hover:text-white text-sm transition-colors">← Terug</Link>
            </div>
            <div className="text-[#D31F30] text-xs font-black uppercase tracking-widest mb-2">Binnenland Barendrecht</div>
            <h1 className="text-5xl sm:text-6xl font-black leading-none mb-3">
              Team<span className="text-[#D31F30]">shop</span>
            </h1>
            <p className="text-[#b0c4dc] max-w-md leading-relaxed">
              Draag de club. Officiële kleding en merchandise van Binnenland Barendrecht — met het logo op elk product.
            </p>
          </div>
          <div className="flex items-center gap-6 text-center shrink-0">
            {[
              { v: `${PRODUCTS.length}`, l: "Producten" },
              { v: "Gratis", l: "Verzending >€50" },
              { v: "14d", l: "Retourrecht" },
            ].map(s => (
              <div key={s.l} className="border border-white/15 rounded-xl px-5 py-4">
                <div className="text-2xl font-black text-[#D31F30]">{s.v}</div>
                <div className="text-[#a0b4d0] text-xs mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-1 bg-[#D31F30]" />
      </section>

      {/* Category filter */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-1 py-3 overflow-x-auto">
            {CATEGORIEEN.map(cat => (
              <button
                key={cat}
                onClick={() => setActief(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  actief === cat
                    ? "bg-[#0D2566] text-white shadow-sm"
                    : "text-gray-500 hover:text-[#0D2566] hover:bg-gray-100"
                }`}
              >
                {cat}
                <span className="ml-1.5 text-xs opacity-60">
                  ({cat === "Alles" ? PRODUCTS.length : PRODUCTS.filter(p => p.categorie === cat).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        {CATEGORIEEN.filter(c => c !== "Alles").map(cat => {
          const items = filtered.filter(p => p.categorie === cat);
          if (items.length === 0) return null;
          return (
            <div key={cat} className="mb-14">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl font-black text-[#0D2566] uppercase tracking-tight">{cat}</h2>
                <div className="flex-1 h-px bg-gray-200" />
                <div className="w-4 h-0.5 bg-[#D31F30]" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {items.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    selectedMaat={selectedMaten[product.id] ?? null}
                    onSelectMaat={(m) => selectMaat(product.id, m)}
                    onAdd={() => addToCart(product)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="bg-[#0D2566] text-[#a0b4d0] text-center py-8 px-4 text-sm">
        <div className="font-black text-white mb-1">Binnenland Barendrecht Teamshop</div>
        * Webshop in ontwikkeling — bestellingen worden binnenkort mogelijk. Interesse? Mail{" "}
        <a href="mailto:shop@binnenlandbarendrecht.nl" className="text-[#D31F30] hover:underline font-semibold">
          shop@binnenlandbarendrecht.nl
        </a>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  selectedMaat,
  onSelectMaat,
  onAdd,
}: {
  product: Product;
  selectedMaat: string | null;
  onSelectMaat: (m: string) => void;
  onAdd: () => void;
}) {
  const hasMaat = selectedMaat !== null;
  const singleSize = product.maten.length === 1;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col">
      {/* Visual */}
      <div className="relative h-52 flex items-center justify-center overflow-hidden" style={{ background: product.bg }}>
        {/* Product icon */}
        <span
          className="text-7xl sm:text-8xl select-none transition-transform duration-300 group-hover:scale-110"
          style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.4))" }}
        >
          {product.icon}
        </span>

        {/* BBL Logo badge */}
        <div className="absolute bottom-3 right-3 w-12 h-12 bg-white rounded-full shadow-lg p-1 relative">
          <Image src="/logo.png" alt="BBL" fill className="object-contain p-0.5" />
        </div>

        {/* Badge */}
        {product.badge && (
          <div className={`absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide ${BADGE_STYLE[product.badge] ?? "bg-gray-800 text-white"}`}>
            {product.badge}
          </div>
        )}

        {/* Old price ribbon */}
        {product.prijs_oud && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-full">
            Bespaar €{(product.prijs_oud - product.prijs).toFixed(2)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="text-[10px] font-black uppercase tracking-widest text-[#D31F30] mb-1">{product.categorie}</div>
        <h3 className="font-black text-[#0D2566] leading-tight mb-1 text-sm sm:text-base">{product.naam}</h3>
        <p className="text-gray-400 text-xs mb-3 leading-relaxed flex-1">{product.info}</p>

        {/* Kleuren */}
        <div className="flex items-center gap-1.5 mb-3">
          {product.kleuren.map(k => (
            <span
              key={k}
              className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
              style={{ background: k }}
              title={k}
            />
          ))}
        </div>

        {/* Maten */}
        {!singleSize && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.maten.map(m => (
              <button
                key={m}
                onClick={() => onSelectMaat(m)}
                className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${
                  selectedMaat === m
                    ? "bg-[#0D2566] text-white border-[#0D2566]"
                    : "border-gray-200 text-gray-500 hover:border-[#0D2566] hover:text-[#0D2566]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <div>
            <span className="font-black text-lg text-[#0D2566]">€{product.prijs.toFixed(2)}</span>
            {product.prijs_oud && (
              <span className="text-xs text-gray-400 line-through ml-1.5">€{product.prijs_oud.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={onAdd}
            disabled={!singleSize && !hasMaat}
            title={!singleSize && !hasMaat ? "Kies eerst een maat" : ""}
            className={`px-3 py-2 text-xs font-black rounded-lg transition-all ${
              singleSize || hasMaat
                ? "bg-[#0D2566] hover:bg-[#0a1d4f] text-white active:scale-95"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {singleSize || hasMaat ? "+ Winkelwagen" : "Kies maat"}
          </button>
        </div>
      </div>
    </div>
  );
}
