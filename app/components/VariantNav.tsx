import Link from "next/link";

const VARIANTS = [
  { href: "/", label: "Home" },
  { href: "/home1", label: "Home 1" },
  { href: "/home2", label: "Home 2" },
  { href: "/home3", label: "Home 3" },
];

export default function VariantNav({ active }: { active: string }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-black/90 backdrop-blur-md px-3 py-2 rounded-full border border-white/15 shadow-2xl">
      {VARIANTS.map(v => (
        <Link
          key={v.href}
          href={v.href}
          className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
            active === v.href
              ? "bg-white text-black"
              : "text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          {v.label}
        </Link>
      ))}
      <div className="w-px h-4 bg-white/20 mx-1" />
      <Link
        href="/compare"
        className="text-xs font-bold px-3 py-1.5 rounded-full text-blue-400 hover:text-blue-300 hover:bg-white/10 transition-all"
      >
        Vergelijk ↗
      </Link>
    </div>
  );
}
