import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-amber-400 font-semibold text-lg mb-4">Premier Realty</h3>
            <p className="text-sm">Professional real estate consultation services to help you make informed decisions.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <a href="/services" className="block hover:text-amber-400">Services</a>
              <a href="/about" className="block hover:text-amber-400">About Us</a>
              <a href="/contact" className="block hover:text-amber-400">Contact</a>
              <a href="/book" className="block hover:text-amber-400">Book Consultation</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><Phone size={16} /> +1 (555) 123-4567</p>
              <p className="flex items-center gap-2"><Mail size={16} /> info@premierrealty.com</p>
              <p className="flex items-center gap-2"><MapPin size={16} /> 123 Main Street, City</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm">
          © {new Date().getFullYear()} Premier Realty. All rights reserved.
        </div>
      </div>
    </footer>
  )
}