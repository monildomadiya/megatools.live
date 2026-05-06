import { Shield, Zap, Calculator, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-primary-600 py-24 text-white">
        <div className="container text-center">
          <h1 className="text-5xl font-black mb-6">About Mega Tools</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Our mission is to provide the most accurate, fast, and easy-to-use 
            online tools and calculators for everyone, everywhere.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container max-w-4xl">
          <div className="prose prose-blue lg:prose-lg mx-auto text-gray-600">
            <p className="mb-8">
              Founded in 2024, Mega Tools started with a simple idea: making complex calculations accessible 
              to everyone without the need for expensive software or complicated spreadsheets.
            </p>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Do</h2>
            <p className="mb-8">
              We build a wide range of tools spanning across health, finance, mathematics, SEO, and developer 
              utilities. Every tool we build is carefully researched and verified against official formulas 
              to ensure the results you get are trustworthy.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Privacy First</h4>
                  <p className="text-sm">We process calculations in your browser, keeping your data private.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">High Performance</h4>
                  <p className="text-sm">Optimized for speed so you get results instantly on any device.</p>
                </div>
              </div>
            </div>

            <p>
              We are constantly expanding our library of tools. If you have a suggestion for a tool 
              that would make your life easier, please don't hesitate to contact us.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
