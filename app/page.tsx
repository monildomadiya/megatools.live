import Link from "next/link";
import { ArrowRight, Calculator, Activity, DollarSign, RefreshCw, Search, ShieldCheck, Zap } from "lucide-react";
import { categories } from "@/data/categories";
import { tools } from "@/data/tools";
import ToolCard from "@/components/tools/ToolCard";
import AdSlot from "@/components/ui/AdSlot";

export default function Home() {
  const popularTools = tools.slice(0, 8);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="container text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            Free Online Calculators & <br />
            <span className="text-primary-600">Smart Tools</span> for Everyone
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
            Access a collection of 1000+ precise, easy-to-use tools for health, finance, 
            mathematics, and more. All tools are free and mobile-friendly.
          </p>
          <div className="mx-auto max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="What do you want to calculate today?" 
                className="h-14 w-full rounded-2xl border bg-white pl-12 pr-4 text-lg shadow-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
              />
            </div>
          </div>
        </div>
      </section>

      <AdSlot slotName="home-top" />

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Explore by Category</h2>
              <p className="mt-2 text-gray-500">Find the right tool for your specific needs</p>
            </div>
            <Link href="/tools" className="flex items-center gap-1 text-primary-600 font-semibold hover:underline">
              View all tools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link 
                key={category.id}
                href={`/tools/${category.slug}`}
                className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-primary-100"
              >
                <div className="mb-4 text-primary-600 font-bold">{category.title}</div>
                <p className="text-sm text-gray-500">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="bg-gray-50 py-16">
        <div className="container">
          <h2 className="mb-12 text-3xl font-bold text-center">Most Popular Tools</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popularTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      <AdSlot slotName="home-middle" />

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-xl font-bold">100% Secure</h3>
              <p className="text-gray-500">All calculations are performed locally on your device. We never store your personal data.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-xl font-bold">Lightning Fast</h3>
              <p className="text-gray-500">No page reloads. Get instant results as you type. Optimized for speed and performance.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                <Calculator className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-xl font-bold">Always Accurate</h3>
              <p className="text-gray-500">Our formulas are verified by experts to ensure you get the most accurate results every time.</p>
            </div>
          </div>
        </div>
      </section>

      <AdSlot slotName="home-bottom" />
    </div>
  );
}
