import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 pt-10 pb-6 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">GOING</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Buy and sell products using Solana and other payment methods.
              Online marketplace with cryptocurrency support.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary hover:text-primary-dark">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Offers
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Sell
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Help & Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/claims" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Claims
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/solana" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Solana Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            &copy; {new Date().getFullYear()} GOING. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;