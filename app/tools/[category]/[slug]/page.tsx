import { Metadata } from "next";
import { notFound } from "next/navigation";
import { tools } from "@/data/tools";
import { categories } from "@/data/categories";
import { generateToolMetadata, generateJSONLD, generateFAQSchema } from "@/lib/seo";
import CalculatorLayout from "@/components/tools/CalculatorLayout";
import ToolCard from "@/components/tools/ToolCard";
import AdSlot from "@/components/ui/AdSlot";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export async function generateMetadata({ params }: { params: { category: string; slug: string } }): Promise<Metadata> {
  const tool = tools.find(t => t.slug === params.slug);
  if (!tool) return { title: "Tool Not Found" };
  return generateToolMetadata(tool);
}

export default function ToolPage({ params }: { params: { category: string; slug: string } }) {
  const tool = tools.find(t => t.slug === params.slug);
  const category = categories.find(c => c.slug === params.category);

  if (!tool) notFound();

  const relatedTools = tools.filter(t => tool.relatedTools.includes(t.slug));

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/tools" className="hover:text-primary-600">Tools</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/tools/${params.category}`} className="hover:text-primary-600 capitalize">
            {category?.title || params.category}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">{tool.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <h1 className="text-4xl font-black text-gray-900 mb-4">{tool.title}</h1>
            <p className="text-lg text-gray-600 mb-8">{tool.shortDescription}</p>

            <AdSlot slotName="tool-top" />

            <CalculatorLayout tool={tool} />

            <div className="mt-12 prose prose-blue max-w-none">
              <h2 className="text-2xl font-bold mb-4">About {tool.title}</h2>
              <p className="text-gray-600 mb-6">{tool.longDescription}</p>
              
              {tool.howToUse && (
                <>
                  <h3 className="text-xl font-bold mb-3">How to use this tool?</h3>
                  <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-600">
                    {tool.howToUse.map((step, i) => <li key={i}>{step}</li>)}
                  </ul>
                </>
              )}

              {tool.formulaDescription && (
                <>
                  <h3 className="text-xl font-bold mb-3">Formula & Logic</h3>
                  <div className="bg-gray-100 p-4 rounded-xl font-mono text-sm mb-6">
                    {tool.formulaDescription}
                  </div>
                </>
              )}
            </div>

            <AdSlot slotName="tool-middle" />

            {tool.faqs.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {tool.faqs.map((faq, i) => (
                    <div key={i} className="rounded-2xl border bg-white p-6">
                      <h4 className="font-bold text-gray-900 mb-2">{faq.question}</h4>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <AdSlot slotName="tool-sidebar" className="!my-0 mb-8" />
            
            <div className="rounded-2xl border bg-white p-6 mb-8 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Related Tools</h3>
              <div className="space-y-4">
                {relatedTools.map(t => (
                  <Link 
                    key={t.slug} 
                    href={`/tools/${t.category}/${t.slug}`}
                    className="block p-3 rounded-xl hover:bg-primary-50 transition border border-transparent hover:border-primary-100"
                  >
                    <div className="font-semibold text-gray-900">{t.title}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">{t.shortDescription}</div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-primary-600 p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Need Help?</h3>
              <p className="text-primary-100 text-sm mb-6">Can't find the tool you're looking for? Suggest a tool and we'll build it for you.</p>
              <Link href="/contact" className="inline-block w-full text-center bg-white text-primary-600 font-bold py-3 rounded-xl hover:bg-gray-100 transition">
                Contact Us
              </Link>
            </div>
          </aside>
        </div>

        <AdSlot slotName="tool-bottom" />
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJSONLD(tool)) }}
      />
      {tool.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(tool.faqs)) }}
        />
      )}
    </div>
  );
}
