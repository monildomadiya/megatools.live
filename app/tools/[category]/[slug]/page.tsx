import { Metadata } from "next";
import { notFound } from "next/navigation";
import { tools } from "@/data/tools";
import { categories } from "@/data/categories";
import { generateToolMetadata, generateJSONLD, generateFAQSchema, generateBreadcrumbSchema } from "@/lib/seo";
import CalculatorLayout from "@/components/tools/CalculatorLayout";
import ToolCard from "@/components/tools/ToolCard";
import AdSlot from "@/components/ui/AdSlot";
import Link from "next/link";
import { ChevronRight, Clock, Star, Shield, Zap } from "lucide-react";

export async function generateStaticParams() {
  return tools.map(tool => ({ category: tool.category, slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: { category: string; slug: string } }): Promise<Metadata> {
  const tool = tools.find(t => t.slug === params.slug);
  if (!tool) return { title: "Tool Not Found" };
  return generateToolMetadata(tool);
}

export default function ToolPage({ params }: { params: { category: string; slug: string } }) {
  const tool = tools.find(t => t.slug === params.slug);
  const category = categories.find(c => c.slug === params.category);
  if (!tool) notFound();

  const relatedTools = tools.filter(t => tool.relatedTools?.includes(t.slug)).slice(0, 5);
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://megatools.live";

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Tools", url: `${SITE_URL}/tools` },
    { name: category?.title || params.category, url: `${SITE_URL}/tools/${params.category}` },
    { name: tool.title, url: `${SITE_URL}/tools/${params.category}/${params.slug}` },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-primary-600 transition">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/tools" className="hover:text-primary-600 transition">Tools</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/tools/${params.category}`} className="hover:text-primary-600 transition capitalize">
            {category?.title || params.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-900 font-medium">{tool.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main */}
          <div className="lg:col-span-8">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">{tool.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{tool.shortDescription}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Updated {tool.updatedAt}</span>
                <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-yellow-500" /> Free Forever</span>
                <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-green-500" /> No Data Stored</span>
                <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-blue-500" /> Instant Results</span>
              </div>
            </div>

            <AdSlot slotName="tool-top" />
            <CalculatorLayout tool={tool} />

            {/* About */}
            <div className="mt-10 bg-white rounded-2xl border p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">About {tool.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{tool.longDescription}</p>

              {tool.howToUse && tool.howToUse.length > 0 && (
                <>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">How to Use This Tool</h3>
                  <ol className="list-decimal pl-5 mb-6 space-y-2 text-gray-600">
                    {tool.howToUse.map((step, i) => <li key={i}>{step}</li>)}
                  </ol>
                </>
              )}

              {tool.formulaDescription && (
                <>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Formula Used</h3>
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl font-mono text-sm text-blue-900 mb-4">
                    {tool.formulaDescription}
                  </div>
                </>
              )}

              {tool.exampleCalculation && (
                <>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Example Calculation</h3>
                  <div className="bg-green-50 border border-green-100 p-4 rounded-xl text-sm text-green-900">
                    {tool.exampleCalculation}
                  </div>
                </>
              )}
            </div>

            <AdSlot slotName="tool-middle" />

            {/* FAQ */}
            {tool.faqs && tool.faqs.length > 0 && (
              <div className="mt-8 bg-white rounded-2xl border p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {tool.faqs.map((faq, i) => (
                    <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                      <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords for SEO */}
            {tool.keywords && tool.keywords.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {tool.keywords.map(kw => (
                  <span key={kw} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{kw}</span>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <AdSlot slotName="tool-sidebar" className="!my-0" />

            {relatedTools.length > 0 && (
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Related Tools</h3>
                <div className="space-y-3">
                  {relatedTools.map(t => (
                    <Link key={t.slug} href={`/tools/${t.category}/${t.slug}`}
                      className="block p-3 rounded-xl hover:bg-primary-50 transition border border-transparent hover:border-primary-100">
                      <div className="font-semibold text-gray-900 text-sm">{t.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{t.shortDescription}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-6 text-white">
              <h3 className="text-lg font-bold mb-2">💡 Suggest a Tool</h3>
              <p className="text-primary-100 text-sm mb-4">Can't find what you need? We'll build it for you — free!</p>
              <Link href="/contact" className="block text-center bg-white text-primary-600 font-bold py-2.5 rounded-xl hover:bg-gray-100 transition text-sm">
                Request Tool
              </Link>
            </div>

            <AdSlot slotName="tool-sidebar-2" className="!my-0" />
          </aside>
        </div>

        <AdSlot slotName="tool-bottom" />
      </div>

      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJSONLD(tool)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbItems)) }} />
      {tool.faqs && tool.faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(tool.faqs)) }} />
      )}
    </div>
  );
}
