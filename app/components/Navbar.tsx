import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#05060E]/95 backdrop-blur border-b border-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">

        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 relative">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <div className="leading-tight hidden sm:block">
            <div className="font-black text-sm tracking-tight text-white">BINNENLAND</div>
            <div className="text-[10px] text-violet-400 font-bold tracking-widest uppercase">Barendrecht · Dames 1</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-400">
          <Link href="#uitslagen" className="px-3 py-2 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            Uitslagen
          </Link>
          <Link href="#team" className="px-3 py-2 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            Team
          </Link>
          <Link href="#speelschema" className="px-3 py-2 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            Speelschema
          </Link>
          <Link href="/shop" className="px-3 py-2 hover:text-white transition-colors rounded-lg hover:bg-white/5 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Webshop
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-3 text-xs text-gray-400">
          <Link href="#uitslagen" className="hover:text-white transition-colors">Scores</Link>
          <Link href="#team" className="hover:text-white transition-colors">Team</Link>
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/shop"
            className="bg-[#D31F30] hover:bg-[#b01828] text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-full transition-all flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Webshop
          </Link>
        </div>
      </div>
    </nav>
  );
}
