import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CreditCard, PiggyBank, Building2, TrendingUp } from "lucide-react";

const FastProductGrid = () => {
  const products = [
    {
      icon: CreditCard,
      title: "SBA 7(a) Loans",
      description: "Versatile financing for working capital, equipment, and real estate purchases.",
      rate: "Prime + 2.75%",
      amount: "Up to $5M",
      link: "/sba-7a-loans"
    },
    {
      icon: Building2,
      title: "Commercial Real Estate",
      description: "Financing for office buildings, retail spaces, and investment properties.",
      rate: "Starting at 6.5%",
      amount: "Up to $10M",
      link: "/conventional-loans"
    },
    {
      icon: PiggyBank,
      title: "Equipment Financing",
      description: "Fund new equipment purchases with competitive rates and flexible terms.",
      rate: "Starting at 7.0%",
      amount: "Up to $2M",
      link: "/equipment-financing"
    },
    {
      icon: TrendingUp,
      title: "Working Capital",
      description: "Quick access to capital for inventory, payroll, and operational expenses.",
      rate: "Starting at 8.0%",
      amount: "Up to $500K",
      link: "/working-capital"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Financing Solutions for Every Business
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access competitive rates and flexible terms through our network of top lenders
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const IconComponent = product.icon;
            return (
              <Card key={product.title} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{product.title}</h3>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                  <div className="space-y-2">
                    <div className="text-lg font-semibold text-primary">{product.rate}</div>
                    <div className="text-sm text-muted-foreground">{product.amount}</div>
                  </div>
                  <Button asChild className="w-full">
                    <Link to={product.link}>Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FastProductGrid;