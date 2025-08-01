import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, DollarSign, Shield, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const EquipmentLoansPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative py-20 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2" 
          alt="Construction machinery and equipment"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-financial-navy/80 to-primary/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <Badge className="bg-white text-primary mb-4">Equipment Financing</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Equipment Loans</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Finance the equipment your business needs to grow. From machinery to technology, we provide competitive rates and flexible terms for all types of business equipment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild><a href="https://preview--hbf-application.lovable.app/auth?loan=equipment">Apply for Equipment Loan</a></Button>
              <Button size="lg" variant="ghost" className="border border-white text-white hover:bg-white/10" asChild><Link to="/loan-calculator">Calculate Payment</Link></Button>
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
                <h3 className="text-2xl font-bold mb-2">$25K - $5M</h3>
                <p className="text-muted-foreground">Loan amounts</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">100% Financing</h3>
                <p className="text-muted-foreground">No down payment required</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">All Equipment</h3>
                <p className="text-muted-foreground">New and used equipment</p>
              </CardContent>
            </Card>
          </div>

          {/* Educational Content */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Equipment Financing Explained</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Equipment loans are specifically designed to help businesses purchase or lease equipment needed for operations. 
                The equipment itself serves as collateral, often allowing for 100% financing with competitive rates.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>How Equipment Financing Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Equipment financing uses the purchased equipment as collateral, reducing risk for lenders and often 
                    allowing for better terms. You can finance new or used equipment with terms that match the equipment's useful life.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-semibold">Equipment as Collateral:</span>
                        <span className="text-muted-foreground ml-1">The equipment secures the loan, reducing risk</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-semibold">Preserve Cash Flow:</span>
                        <span className="text-muted-foreground ml-1">Keep working capital available for operations</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-semibold">Tax Benefits:</span>
                        <span className="text-muted-foreground ml-1">Section 179 deduction and depreciation benefits</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Equipment Loan vs. Lease</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Equipment Loan Benefits</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Own the equipment immediately</li>
                        <li>• Build equity in the asset</li>
                        <li>• Full tax deduction potential</li>
                        <li>• No mileage or usage restrictions</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">When to Consider Leasing</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Need latest technology regularly</li>
                        <li>• Lower monthly payments</li>
                        <li>• Equipment depreciates quickly</li>
                        <li>• Want to avoid maintenance costs</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Industry-Specific Equipment */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Equipment by Industry</h2>
            <div className="grid lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Construction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Excavators & Bulldozers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Cranes & Lifts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Concrete Equipment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Tool & Generator Sets</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Healthcare</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">MRI & CT Scanners</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Dental Equipment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Laboratory Equipment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Surgical Instruments</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Manufacturing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">CNC Machines</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Assembly Line Equipment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Quality Control Systems</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Packaging Equipment</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Transportation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Commercial Trucks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Trailers & Containers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Fleet Management Systems</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Loading Equipment</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Use Case Examples */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Equipment Financing Success Stories</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bakery Expansion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    A growing bakery needed industrial ovens and mixing equipment to meet increased demand but wanted to preserve cash for ingredient inventory.
                  </p>
                  <div className="bg-muted p-3 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Equipment Cost:</span>
                      <span className="font-semibold">$125,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Down Payment:</span>
                      <span className="font-semibold">$0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Term:</span>
                      <span className="font-semibold">5 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Payment:</span>
                      <span className="font-semibold">$2,580</span>
                    </div>
                  </div>
                  <p className="text-sm text-primary font-semibold mt-3">
                    Result: 200% production increase, ROI achieved in 18 months
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Medical Practice Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    An orthopedic practice needed an MRI machine to offer in-house imaging services and reduce patient wait times.
                  </p>
                  <div className="bg-muted p-3 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Equipment Cost:</span>
                      <span className="font-semibold">$850,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Down Payment:</span>
                      <span className="font-semibold">$85,000 (10%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Term:</span>
                      <span className="font-semibold">7 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Payment:</span>
                      <span className="font-semibold">$12,450</span>
                    </div>
                  </div>
                  <p className="text-sm text-primary font-semibold mt-3">
                    Result: $300K additional annual revenue, improved patient satisfaction
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tech Startup Scaling</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    A software company needed high-performance servers and networking equipment to support rapid user growth.
                  </p>
                  <div className="bg-muted p-3 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Equipment Cost:</span>
                      <span className="font-semibold">$180,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Down Payment:</span>
                      <span className="font-semibold">$18,000 (10%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Term:</span>
                      <span className="font-semibold">3 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Payment:</span>
                      <span className="font-semibold">$5,100</span>
                    </div>
                  </div>
                  <p className="text-sm text-primary font-semibold mt-3">
                    Result: 500% user capacity increase, reduced downtime by 95%
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Application Process */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Equipment Financing Application Process</h2>
            <div className="grid lg:grid-cols-2 gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>Step-by-Step Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <h4 className="font-semibold">Equipment Selection & Quotes</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-11">
                      Choose your equipment and obtain quotes from vendors. We can work with any approved vendor.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <h4 className="font-semibold">Application & Credit Review (24 hours)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-11">
                      Submit application with basic business and equipment information for quick credit decision.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <h4 className="font-semibold">Documentation & Approval (1-2 days)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-11">
                      Provide required documents and receive final approval with terms.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <h4 className="font-semibold">Equipment Delivery & Funding</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-11">
                      We pay the vendor directly upon equipment delivery and acceptance.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Required Documentation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Business Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Equipment quote/invoice</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Business tax returns (2 years)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Bank statements (3 months)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Financial statements</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Equipment Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Equipment specifications</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Vendor information</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Delivery timeline</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Installation requirements</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Common Uses for Equipment Loans</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Expand production capacity</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Replace aging equipment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Improve efficiency</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Technology upgrades</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Fleet expansion</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>New business locations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Competitive advantage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Cost reduction</span>
                  </div>
                </div>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Equipment Loan Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Credit Score:</span>
                  <span className="font-semibold">600+</span>
                </div>
                <div className="flex justify-between">
                  <span>Time in Business:</span>
                  <span className="font-semibold">1+ years</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Revenue:</span>
                  <span className="font-semibold">$75K+</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Rates:</span>
                  <span className="font-semibold">Starting at 5.9%</span>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Loan Benefits</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Equipment serves as collateral</li>
                    <li>• 100% financing available</li>
                    <li>• Section 179 tax benefits</li>
                    <li>• Preserve working capital</li>
                  </ul>
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

export default EquipmentLoansPage;