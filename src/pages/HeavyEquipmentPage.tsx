import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Wrench, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const HeavyEquipmentPage = () => {
  return (
    <>
      <SEO 
        title="Heavy Equipment Financing | $50K-$10M | Halo Business Finance"
        description="Finance heavy machinery and construction equipment from $50K to $10M. Excavators, bulldozers, cranes, trucks, and agricultural equipment. New and used."
        keywords="heavy equipment financing, construction equipment loans, machinery financing, excavator financing, bulldozer loans, crane financing, agricultural equipment loans"
        canonical="https://halobusinessfinance.com/heavy-equipment"
      />
      <div className="min-h-screen bg-background">
        <Header />
      
      <section className="relative py-20 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9" 
          alt="Heavy machinery and construction equipment"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-financial-navy/80 to-primary/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <Badge className="bg-white text-primary mb-4">Heavy Machinery</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Heavy Equipment Financing</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Finance heavy machinery and construction equipment with competitive rates and flexible terms. From excavators to cranes, we fund the equipment that builds America.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild><a href="https://preview--hbf-application.lovable.app/auth?loan=heavy-equipment">Finance Heavy Equipment</a></Button>
              <Button size="lg" variant="ghost" className="border border-white text-white hover:bg-white/10" asChild><Link to="/contact-us">Get Rates</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">$50K - $10M</h3>
                <p className="text-muted-foreground">Financing amounts</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">New & Used</h3>
                <p className="text-muted-foreground">All equipment conditions</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Wrench className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Expert Support</h3>
                <p className="text-muted-foreground">Industry specialists</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Heavy Equipment We Finance</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Construction Equipment</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Excavators</li>
                    <li>• Bulldozers</li>
                    <li>• Cranes</li>
                    <li>• Loaders</li>
                    <li>• Graders</li>
                    <li>• Compactors</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Transportation</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Semi-Trucks</li>
                    <li>• Trailers</li>
                    <li>• Dump Trucks</li>
                    <li>• Delivery Vehicles</li>
                    <li>• Specialty Vehicles</li>
                    <li>• Fleet Equipment</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Agricultural</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Tractors</li>
                    <li>• Combines</li>
                    <li>• Tillers</li>
                    <li>• Planters</li>
                    <li>• Harvesters</li>
                    <li>• Irrigation Systems</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Industrial</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Forklifts</li>
                    <li>• Generators</li>
                    <li>• Air Compressors</li>
                    <li>• Manufacturing Equipment</li>
                    <li>• Material Handling</li>
                    <li>• Warehouse Equipment</li>
                  </ul>
                </div>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Financing Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Loan Features</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Interest Rates:</span>
                      <span className="font-semibold">Starting at 6.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Terms:</span>
                      <span className="font-semibold">2-10 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Down Payment:</span>
                      <span className="font-semibold">10-20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Approval Time:</span>
                      <span className="font-semibold">24-72 hours</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Why Choose Us?</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Industry expertise</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Competitive rates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Fast approvals</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Flexible terms</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

        <Footer />
      </div>
    </>
  );
};

export default HeavyEquipmentPage;