
const Footer = () => {
  return (
    <footer className="root bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container max-w-container mx-auto px-6 py-12">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="flex flex-col">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-black dark:text-white mb-2">LAVA</h3>
              <p className="text-sm report-helper-text mb-2">Report Helper</p>
              <p className="text-sm text-text-secondary">
                AI-powered report generation tool that helps you create professional reports in minutes.
              </p>
            </div>
            {/* Social Media Links */}
            <div className="flex gap-4 mt-4">
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/vijay-prasad-2bb6a4308?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-blue-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>

              {/* GitHub */}
              <a href="https://github.com/Vijayprasad2006?tab=repositories" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-gray-900 dark:hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
              </a>

              {/* Instagram */}
              <a href="https://www.instagram.com/prasadvjay?igsh=ZW91OWFpa3BrZno=" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-pink-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>

              {/* Portfolio (Globe) */}
              <a href="https://68c5605258aae294cbf1c348--wondrous-faun-ab19c6.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-cyan-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              </a>

              {/* Mail */}
              <a href="mailto:vijayprasad.h2006@gmail.com" className="text-text-secondary hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold text-black dark:text-white mb-4 uppercase tracking-wide">Product</h4>
            <ul className="space-y-3">
              <li>
                <a href="/features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Features</a>
              </li>
              <li>
                <a href="/pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Pricing</a>
              </li>
              <li>
                <a href="/templates" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Report Templates</a>
              </li>
              <li>
                <a href="/examples" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Examples</a>
              </li>
              <li>
                <a href="/integrations" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Integrations</a>
              </li>
              <li>
                <a href="/api" className="text-sm text-text-secondary hover:text-text-primary transition-colors">API Documentation</a>
              </li>
              <li>
                <a href="/changelog" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Changelog</a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold text-black dark:text-white mb-4 uppercase tracking-wide">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="/docs" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Documentation</a>
              </li>
              <li>
                <a href="/blog" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Blog</a>
              </li>
              <li>
                <a href="/tutorials" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Tutorials</a>
              </li>
              <li>
                <a href="/guides" className="text-sm text-text-secondary hover:text-text-primary transition-colors">User Guides</a>
              </li>
              <li>
                <a href="/webinars" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Webinars</a>
              </li>
              <li>
                <a href="/community" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Community</a>
              </li>
              <li>
                <a href="/case-studies" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Case Studies</a>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold text-black dark:text-white mb-4 uppercase tracking-wide">Support & Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="/support" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Help Center</a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Contact Us</a>
              </li>
              <li>
                <a href="/faq" className="text-sm text-text-secondary hover:text-text-primary transition-colors">FAQ</a>
              </li>
              <li>
                <a href="/status" className="text-sm text-text-secondary hover:text-text-primary transition-colors">System Status</a>
              </li>
              <li>
                <a href="/terms" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="/privacy" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="/cookies" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Cookie Policy</a>
              </li>
              <li>
                <a href="/gdpr" className="text-sm text-text-secondary hover:text-text-primary transition-colors">GDPR Compliance</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-black dark:text-white mb-2">Stay Updated</h4>
              <p className="text-sm text-text-secondary">Get the latest updates, tips, and exclusive offers.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 text-sm"
              />
              <button className="px-6 py-2 bg-gray-900 dark:bg-gray-800 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-text-secondary">
              <span>Copyright © 2026 LAVA Report Helper. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <a href="/sitemap" className="hover:text-text-primary transition-colors">Sitemap</a>
              <span>•</span>
              <a href="/accessibility" className="hover:text-text-primary transition-colors">Accessibility</a>
              <span>•</span>
              <a href="/security" className="hover:text-text-primary transition-colors">Security</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
