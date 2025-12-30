import Link from 'next/link'
import { ArrowRight, Building, Users, TrendingUp, Clock } from 'lucide-react'
import Gallery from '@/components/Gallery'

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Expert Real Estate <span className="text-amber-400">Guidance</span> You Can Trust
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Whether you're buying, selling, or investing, our consultants provide personalized advice to help you make confident decisions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/book"
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
              >
                Book a Consultation <ArrowRight size={20} />
              </Link>
              <Link
                href="/services"
                className="border border-slate-500 hover:border-amber-400 hover:text-amber-400 px-6 py-3 rounded-lg font-semibold transition"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Building, title: 'Market Expertise', desc: 'Deep knowledge of local and regional real estate markets' },
              { icon: Users, title: 'Personal Approach', desc: 'Tailored advice based on your unique needs and goals' },
              { icon: TrendingUp, title: 'Data-Driven', desc: 'Decisions backed by comprehensive market analysis' },
              { icon: Clock, title: 'Flexible Hours', desc: 'Available Monday to Saturday, 8 AM to 8 PM' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 text-amber-600 mb-4">
                  <item.icon size={28} />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-slate-900">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <Gallery />

      {/* CTA */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-900">Ready to Get Started?</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Book a free consultation today and take the first step toward your real estate goals.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Schedule Appointment <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}