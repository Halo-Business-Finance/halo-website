import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Stethoscope, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const MedicalEquipmentPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative py-20 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56" 
          alt="Medical equipment and healthcare technology"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-financial-navy/80 to-primary/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <Badge className="bg-white text-primary mb-4">Healthcare Solutions</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Medical Equipment Financing</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Finance the latest medical equipment and technology to enhance patient care. Competitive rates and flexible terms for healthcare providers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild><a href="https://preview--hbf-application.lovable.app/auth?loan=medical-equipment">Finance Medical Equipment</a></Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild><Link to="/industry-solutions">Healthcare Solutions</Link></Button>
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
                <h3 className="text-2xl font-bold mb-2">$10K - $5M</h3>
                <p className="text-muted-foreground">Equipment financing</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">100% Financing</h3>
                <p className="text-muted-foreground">No down payment options</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Stethoscope className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">All Specialties</h3>
                <p className="text-muted-foreground">Every medical practice</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Medical Equipment We Finance</h2>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Diagnostic Equipment</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>• MRI Machines</div>
                    <div>• CT Scanners</div>
                    <div>• X-Ray Systems</div>
                    <div>• Ultrasound</div>
                    <div>• EKG Machines</div>
                    <div>• Lab Equipment</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Surgical Equipment</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>• Surgical Tables</div>
                    <div>• Anesthesia Machines</div>
                    <div>• Laser Systems</div>
                    <div>• Operating Lights</div>
                    <div>• Sterilizers</div>
                    <div>• Endoscopy Equipment</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Practice Equipment</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>• Dental Chairs</div>
                    <div>• Exam Tables</div>
                    <div>• Dental X-Ray</div>
                    <div>• Optometry Equipment</div>
                    <div>• Physical Therapy</div>
                    <div>• Practice Management</div>
                  </div>
                </div>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Healthcare Financing Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Why Medical Equipment Financing?</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Preserve working capital for operations</li>
                    <li>• Tax advantages and deductions</li>
                    <li>• Keep up with medical advances</li>
                    <li>• Improve patient care quality</li>
                    <li>• Predictable monthly payments</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Interest Rates:</span>
                    <span className="font-semibold">Starting at 5.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Terms:</span>
                    <span className="font-semibold">1-10 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approval:</span>
                    <span className="font-semibold">Same day decisions</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Specialties:</span>
                    <span className="font-semibold">All medical fields</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Healthcare Practice Types</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Primary Care</div>
                    <div>• Specialists</div>
                    <div>• Dental Practices</div>
                    <div>• Veterinary</div>
                    <div>• Surgery Centers</div>
                    <div>• Urgent Care</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MedicalEquipmentPage;