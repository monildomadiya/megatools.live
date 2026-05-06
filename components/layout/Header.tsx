import Link from "next/link";
import { Search, Menu, Calculator } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
            <Calculator className="h-6 w-6" />
            <span>Mega Tools</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/tools" className="hover:text-primary-600 transition">All Tools</Link>
          <Link href="/blog" className="hover:text-primary-600 transition">Blog</Link>
          <Link href="/about" className="hover:text-primary-600 transition">About</Link>
          <Link href="/contact" className="hover:text-primary-600 transition">Contact</Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search tools..." 
              className="h-9 w-64 rounded-full border bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <button className="md:hidden">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
