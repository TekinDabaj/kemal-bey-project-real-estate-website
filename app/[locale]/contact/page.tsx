import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Get in touch with our team
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Info */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Get In Touch</h2>
              <p className="text-slate-600 mb-8">
                Have questions about our services? Want to discuss your real estate needs? Reach out to us through any of the channels below, or book a consultation directly.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Phone</h3>
                    <p className="text-slate-600">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Email</h3>
                    <p className="text-slate-600">info@premierrealty.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Address</h3>
                    <p className="text-slate-600">123 Main Street<br />City, State 12345</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Business Hours</h3>
                    <p className="text-slate-600">Monday - Saturday<br />8:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Book CTA */}
            <div className="bg-slate-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Book a Consultation</h2>
              <p className="text-slate-600 mb-6">
                The best way to get personalized advice is to schedule a consultation. We'll discuss your specific needs and how we can help.
              </p>
              <Link
                href="/book"
                className="inline-block w-full text-center bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-3 rounded-lg font-semibold transition"
              >
                Schedule Appointment
              </Link>

              <div className="mt-8 pt-8 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">Prefer to talk first?</h3>
                <p className="text-slate-600 text-sm">
                  Give us a call at <strong>+1 (555) 123-4567</strong> and we'll be happy to answer your questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}