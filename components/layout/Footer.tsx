import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-bold text-primary-600 mb-4">Mega Tools</h3>
            <p className="text-sm text-gray-500">
              Free online calculators and smart tools for everyday use. Accurate, fast, and easy to use.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Calculators</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/tools/health" className="hover:text-primary-600">Health</Link></li>
              <li><Link href="/tools/finance" className="hover:text-primary-600">Finance</Link></li>
              <li><Link href="/tools/math" className="hover:text-primary-600">Math</Link></li>
              <li><Link href="/tools/conversion" className="hover:text-primary-600">Conversion</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/privacy-policy" className="hover:text-primary-600">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-primary-600">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-primary-600">Disclaimer</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-primary-600">Cookie Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Connect</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-primary-600">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary-600">Contact</Link></li>
              <li><Link href="/advertise" className="hover:text-primary-600">Advertise</Link></li>
              <li><Link href="/sitemap" className="hover:text-primary-600">Sitemap</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Mega Tools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
