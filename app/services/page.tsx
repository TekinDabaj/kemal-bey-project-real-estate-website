import { Building2, TrendingUp, FileSearch, Scale, Home, BadgeDollarSign } from 'lucide-react'
import Link from 'next/link'

const services = [
  {
    icon: Building2,
    title: 'Property Valuation',
    description: 'Get an accurate market value assessment of your property based on current market conditions, comparable sales, and property features.'
  },
  {
    icon: TrendingUp,
    title: 'Investment Analysis',
    description: 'Comprehensive analysis of potential real estate investments including ROI projections, market trends, and risk assessment.'
  },
  {
    icon: FileSearch,
    title: 'Market Research',
    description: 'Detailed reports on local market conditions, neighborhood analysis, and future development plans that may affect property values.'
  },
  {
    icon: Scale,
    title: 'Buying Consultation',
    description: 'Expert guidance through the property buying process, from identifying suitable properties to negotiating the best deal.'
  },
  {
    icon: Home,
    title: 'Selling Strategy',
    description: 'Strategic advice on preparing your property for sale, pricing strategy, and marketing to achieve the best possible outcome.'
  },
  {
    icon: BadgeDollarSign,
    title: 'Financial Planning',
    description: 'Help understanding mortgage options, financing strategies, and long-term financial implications of real estate decisions.'
  }
]

export default function ServicesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Comprehensive real estate consultation services tailored to your needs
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-amber-100 text-amber-600 mb-4">
                  <service.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to Get Started?</h2>
          <p className="text-slate-600 mb-6">Book a free consultation to discuss your real estate needs.</p>
          <Link
            href="/book"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-3 rounded-lg font-semibold transition"
          >
            Book Consultation
          </Link>
        </div>
      </section>
    </div>
  )
}