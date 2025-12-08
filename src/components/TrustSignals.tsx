import React from 'react';
import { Star, Users, DollarSign, Clock, Award, Shield, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
const TrustSignals = () => {
  const stats = [{
    icon: DollarSign,
    value: '$2.5B+',
    label: 'Total Funded',
    color: 'text-emerald-500'
  }, {
    icon: Users,
    value: '15,000+',
    label: 'Businesses Helped',
    color: 'text-blue-500'
  }, {
    icon: Clock,
    value: '24hrs',
    label: 'Avg. Pre-Approval',
    color: 'text-amber-500'
  }, {
    icon: Award,
    value: '98%',
    label: 'Client Satisfaction',
    color: 'text-purple-500'
  }];
  const testimonials = [{
    quote: "Halo Business Finance helped us secure a $500K SBA loan in just 3 weeks. Their team was professional and responsive throughout the entire process.",
    author: "Michael Chen",
    role: "CEO, TechStart Solutions",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  }, {
    quote: "The marketplace approach saved us countless hours. We received multiple competitive offers and chose the best terms for our equipment financing.",
    author: "Sarah Rodriguez",
    role: "Owner, Rodriguez Manufacturing",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  }, {
    quote: "Outstanding service! They understood our unique needs as a healthcare provider and found us the perfect financing solution.",
    author: "Dr. James Wilson",
    role: "Medical Director, Wilson Health Group",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  }];
  const partners = [{
    name: 'SBA',
    icon: Building2
  }, {
    name: 'FDIC',
    icon: Shield
  }, {
    name: 'BBB A+',
    icon: Award
  }];
  return <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {stats.map((stat, index) => <Card key={index} className="group bg-white/80 backdrop-blur-sm border-border/50 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-default">
              <CardContent className="p-6 text-center">
                <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>)}
        </div>

        {/* Testimonials Section */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
            What Our Clients Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => <Card key={index} className="group bg-white border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
                  </div>
                  
                  {/* Quote */}
                  <blockquote className="text-muted-foreground mb-6 leading-relaxed italic">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <img src={testimonial.image} alt={testimonial.author} className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" />
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>

        {/* Partner Badges */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6 text-lg">Trusted & Certified</p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {partners.map((partner, index) => <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-border/50 hover:shadow-md transition-shadow duration-300">
                <partner.icon className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">{partner.name}</span>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default TrustSignals;