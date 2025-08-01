import { TrendingUp, Users, DollarSign, CheckCircle, Building, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  {
    title: '$1.5B+',
    description: 'Total Loans Funded',
    icon: <DollarSign className="h-8 w-8" />,
    color: 'text-green-600'
  },
  {
    title: '15,000+',
    description: 'Businesses Helped',
    icon: <Building className="h-8 w-8" />,
    color: 'text-blue-600'
  },
  {
    title: '92%',
    description: 'Approval Rate',
    icon: <CheckCircle className="h-8 w-8" />,
    color: 'text-emerald-600'
  },
  {
    title: '7 Days',
    description: 'Average Processing',
    icon: <Clock className="h-8 w-8" />,
    color: 'text-orange-600'
  },
  {
    title: '500+',
    description: 'Lending Partners',
    icon: <Users className="h-8 w-8" />,
    color: 'text-purple-600'
  },
  {
    title: '15+',
    description: 'Years Experience',
    icon: <TrendingUp className="h-8 w-8" />,
    color: 'text-red-600'
  }
];

export const LendingStatsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-financial-navy/5 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Thousands of Businesses
          </h2>
          <p className="text-xl text-foreground max-w-3xl mx-auto">
            Our track record speaks for itself. See why businesses choose us for their financing needs.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-0">
                <div className={`${stat.color} mb-3 flex justify-center`}>
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-2">{stat.title}</div>
                <div className="text-sm text-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-foreground">
            *Statistics based on data from 2019-2024. Individual results may vary.
          </p>
        </div>
      </div>
    </section>
  );
};