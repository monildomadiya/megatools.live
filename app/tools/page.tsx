import { tools } from "@/data/tools";
import { categories } from "@/data/categories";
import ToolCard from "@/components/tools/ToolCard";
import AdSlot from "@/components/ui/AdSlot";
import Link from "next/link";

export const metadata = {
  title: "All Online Calculators & Tools - Mega Tools Directory",
  description: "Browse our complete directory of 1000+ free online calculators and smart tools. Filter by category to find exactly what you need.",
};

export default function ToolsDirectory() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-gray-900 mb-6">Tools Directory</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need in one place. Browse our collection of tools organized by category.
          </p>
        </div>

        <AdSlot slotName="directory-top" />

        <div className="space-y-20">
          {categories.map((category) => {
            const categoryTools = tools.filter(t => t.category === category.id);
            if (categoryTools.length === 0) return null;

            return (
              <section key={category.id}>
                <div className="flex items-end justify-between mb-8 border-b pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                    <p className="text-gray-500">{category.description}</p>
                  </div>
                  <Link 
                    href={`/tools/${category.slug}`}
                    className="text-primary-600 font-semibold hover:underline"
                  >
                    View Category
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {categoryTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <AdSlot slotName="directory-bottom" />
      </div>
    </div>
  );
}
