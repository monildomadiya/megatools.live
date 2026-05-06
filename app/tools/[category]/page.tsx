import { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/data/categories";
import { tools } from "@/data/tools";
import { generateCategoryMetadata } from "@/lib/seo";
import ToolCard from "@/components/tools/ToolCard";
import AdSlot from "@/components/ui/AdSlot";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = categories.find(c => c.slug === params.category);
  if (!category) return { title: "Category Not Found" };
  return generateCategoryMetadata(category);
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = categories.find(c => c.slug === params.category);
  if (!category) notFound();

  const categoryTools = tools.filter(t => t.category === params.category);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/tools" className="hover:text-primary-600">Tools</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">{category.title}</span>
        </nav>

        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">{category.title}</h1>
          <p className="text-xl text-gray-600 max-w-3xl">{category.description}</p>
        </div>

        <AdSlot slotName="category-top" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categoryTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        <AdSlot slotName="category-bottom" />
        
        {/* Category SEO Content */}
        <div className="mt-20 p-10 rounded-3xl bg-white border shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Why use {category.title}?</h2>
          <div className="prose prose-blue max-w-none text-gray-600">
            <p className="mb-4">
              Our {category.title} are designed to provide professional-grade accuracy with the ease of use you'd expect from a modern web application. Whether you're a professional, a student, or just someone looking for a quick calculation, our tools are here to help.
            </p>
            <p>
              Every tool in the {category.title.toLowerCase()} collection is mobile-responsive, meaning you can perform complex calculations on the go, right from your smartphone or tablet. No downloads required, just instant results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
