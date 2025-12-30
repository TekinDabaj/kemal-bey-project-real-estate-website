import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-[#080716] dark:border-t dark:border-[#2d2a4a] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-amber-400 font-semibold text-lg mb-4">Premier Realty</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500">Professional real estate consultation services to help you make informed decisions.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <a href="/services" className="block hover:text-amber-400 transition">Services</a>
              <a href="/about" className="block hover:text-amber-400 transition">About Us</a>
              <a href="/contact" className="block hover:text-amber-400 transition">Contact</a>
              <a href="/book" className="block hover:text-amber-400 transition">Book Consultation</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Contact Info</h4>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><Phone size={16} className="text-amber-500" /> +1 (555) 123-4567</p>
              <p className="flex items-center gap-2"><Mail size={16} className="text-amber-500" /> info@premierrealty.com</p>
              <p className="flex items-center gap-2"><MapPin size={16} className="text-amber-500" /> 123 Main Street, City</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 dark:border-[#2d2a4a] mt-8 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Premier Realty. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
