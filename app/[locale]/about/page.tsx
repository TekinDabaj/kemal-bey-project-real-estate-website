import { Award, Users, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Trusted real estate consultants dedicated to helping you make informed decisions
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
            <p className="text-slate-600 mb-4">
              Premier Realty was founded with a simple mission: to provide honest, expert real estate guidance that puts clients first. With years of experience in the local market, we've helped hundreds of families and investors make confident property decisions.
            </p>
            <p className="text-slate-600">
              We believe that buying or selling property should be an informed decision, not a stressful gamble. That's why we focus on education, transparency, and personalized service for every client.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, value: '500+', label: 'Clients Served' },
              { icon: Award, value: '15+', label: 'Years Experience' },
              { icon: CheckCircle, value: '98%', label: 'Satisfaction Rate' },
              { icon: Clock, value: '24h', label: 'Response Time' },
            ].map((stat, i) => (
              <div key={i}>
                <stat.icon className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Integrity',
                description: 'We provide honest assessments and advice, even when it\'s not what you want to hear. Your trust is our priority.'
              },
              {
                title: 'Expertise',
                description: 'Our team stays current with market trends, regulations, and best practices to give you informed guidance.'
              },
              {
                title: 'Client Focus',
                description: 'Your goals are our goals. We take time to understand your needs and tailor our advice accordingly.'
              }
            ].map((value, i) => (
              <div key={i} className="text-center p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-slate-300 mb-6">Schedule a consultation and see how we can help.</p>
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