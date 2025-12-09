import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, DollarSign, TrendingUp, Users, Shield, Clock, CheckCircle, Star, BarChart3, Percent } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import ConsultationPopup from "@/components/ConsultationPopup";

const CMBSLoansPage = () => {
  // Chart data for CMBS market statistics
  const cmbsVolumeData = [
    { year: '2019', volume: 85 },
    { year: '2020', volume: 52 },
    { year: '2021', volume: 78 },
    { year: '2022', volume: 95 },
    { year: '2023', volume: 112 },
    { year: '2024', volume: 128 }
  ];

  const propertyTypeData = [
    { type: 'Office', percentage: 28, color: '#2563eb' },
    { type: 'Retail', percentage: 22, color: '#dc2626' },
    { type: 'Multifamily', percentage: 25, color: '#16a34a' },
    { type: 'Industrial', percentage: 15, color: '#ca8a04' },
    { type: 'Hotel', percentage: 10, color: '#9333ea' }
  ];

  const loanPerformanceData = [
    { metric: 'Delinquency Rate', value: 2.8, benchmark: 4.2 },
    { metric: 'Default Rate', value: 1.2, benchmark: 2.1 },
    { metric: 'Recovery Rate', value: 84, benchmark: 76 },
    { metric: 'Prepayment Rate', value: 12, benchmark: 18 }
  ];

  return (
    <>
      <SEO 
        title="CMBS Loans | Commercial Mortgage-Backed Securities | Halo Business Finance"
        description="CMBS loans from $2M to $200M+ with non-recourse structures, fixed rates, and up to 80% LTV. Finance office, retail, multifamily, and industrial properties."
        keywords="CMBS loans, commercial mortgage backed securities, non-recourse loans, commercial real estate loans, fixed rate commercial loans, CMBS financing"
        canonical="https://halobusinessfinance.com/cmbs-loans"
      />
      <div className="min-h-screen bg-background">
        <Header />
      
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-left text-white">
            <Badge className="bg-white text-primary mb-4">Commercial Mortgage-Backed Securities</Badge>
            <h1 className="text-2xl md:text-3xl font-bold mb-6">CMBS Loans</h1>
            <p className="text-xl mb-8 opacity-90 max-w-4xl">
              Access the deepest pool of commercial real estate capital through our CMBS loan program. 
              Benefit from competitive rates, non-recourse structures, and flexible terms for your commercial property financing needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild><a href="https://preview--hbf-application.lovable.app/auth?loan=cmbs">Apply for CMBS Loan</a></Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild><Link to="/contact-us">View Rate Sheet</Link></Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8 mb-16">
            <Card className="text-left p-6">
              <CardContent className="p-0">
                <DollarSign className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">$2M - $200M+</h3>
                <p className="text-muted-foreground">Loan amounts</p>
              </CardContent>
            </Card>
            <Card className="text-left p-6">
              <CardContent className="p-0">
                <Percent className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">75-80% LTV</h3>
                <p className="text-muted-foreground">Competitive leverage</p>
              </CardContent>
            </Card>
            <Card className="text-left p-6">
              <CardContent className="p-0">
                <Clock className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">5-10 Years</h3>
                <p className="text-muted-foreground">Fixed rate terms</p>
              </CardContent>
            </Card>
            <Card className="text-left p-6">
              <CardContent className="p-0">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Non-Recourse</h3>
                <p className="text-muted-foreground">Limited liability</p>
              </CardContent>
            </Card>
          </div>

          {/* CMBS Market Volume Chart */}
          <div className="mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  CMBS Market Volume Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cmbsVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}B`, 'Market Volume']} />
                    <Bar dataKey="volume" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* CMBS Advantages */}
            <div>
              <h2 className="text-3xl font-bold mb-6">CMBS Loan Advantages</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Non-Recourse Structure</h4>
                    <p className="text-muted-foreground text-sm">Protection from personal liability in most scenarios</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Fixed Rate Financing</h4>
                    <p className="text-muted-foreground text-sm">Lock in rates for the entire loan term</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">High Leverage</h4>
                    <p className="text-muted-foreground text-sm">Up to 80% LTV on stabilized properties</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Flexible Prepayment</h4>
                    <p className="text-muted-foreground text-sm">Various prepayment options including yield maintenance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Long-Term Stability</h4>
                    <p className="text-muted-foreground text-sm">10-year fixed terms with 25-30 year amortization</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Assumable Loans</h4>
                    <p className="text-muted-foreground text-sm">Transferable to qualified buyers with lender approval</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>CMBS Property Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={propertyTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percentage }) => `${type}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {propertyTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Loan Performance Metrics */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">CMBS Loan Performance vs Industry</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loanPerformanceData.map((metric, index) => (
                <Card key={index} className="text-center p-6">
                  <CardContent className="p-0">
                    <h4 className="font-semibold mb-2">{metric.metric}</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-2xl font-bold text-primary">{metric.value}%</span>
                        <p className="text-xs text-muted-foreground">CMBS Loans</p>
                      </div>
                      <div>
                        <span className="text-lg text-muted-foreground">{metric.benchmark}%</span>
                        <p className="text-xs text-muted-foreground">Industry Average</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Eligibility and Requirements */}
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Eligible Property Types</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span>Office Buildings</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span>Retail Centers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span>Multifamily (5+ units)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span>Industrial Properties</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span>Warehouse/Distribution</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span>Hotels (select service)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span>Self-Storage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span>Mixed-Use Properties</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span>Senior Housing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span>Student Housing</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">CMBS Process Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <h4 className="font-semibold">Application & Initial Review</h4>
                      <p className="text-sm text-muted-foreground">1-2 weeks</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <h4 className="font-semibold">Due Diligence & Underwriting</h4>
                      <p className="text-sm text-muted-foreground">3-4 weeks</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <h4 className="font-semibold">Loan Committee Approval</h4>
                      <p className="text-sm text-muted-foreground">1-2 weeks</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <h4 className="font-semibold">Documentation & Closing</h4>
                      <p className="text-sm text-muted-foreground">2-3 weeks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>CMBS Loan Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Property Requirements</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Minimum Loan Amount:</span>
                      <span className="font-semibold">$2,000,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maximum LTV:</span>
                      <span className="font-semibold">75-80%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Minimum DSCR:</span>
                      <span className="font-semibold">1.25x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Occupancy Requirement:</span>
                      <span className="font-semibold">85%+ (stabilized)</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Borrower Requirements</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Credit Score:</span>
                      <span className="font-semibold">650+ (entity)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Net Worth:</span>
                      <span className="font-semibold">25% of loan amount</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Liquidity:</span>
                      <span className="font-semibold">10% of loan amount</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Experience:</span>
                      <span className="font-semibold">3+ years CRE</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Loan Terms</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Term Length:</span>
                      <span className="font-semibold">5, 7, 10 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amortization:</span>
                      <span className="font-semibold">25-30 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate Type:</span>
                      <span className="font-semibold">Fixed</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Rates:</span>
                      <span className="font-semibold">Starting at 5.75%</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Key Benefits</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Non-recourse financing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Competitive fixed rates
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Interest-only options available
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Assumable with qualification
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Partial releases available
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Secure CMBS Financing?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our CMBS specialists are ready to help you navigate the process and secure the best terms for your commercial property.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Start CMBS Application</Button>
            <ConsultationPopup
              trigger={
                <Button size="lg" variant="outline">Schedule Consultation</Button>
              }
            />
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </>
  );
};

export default CMBSLoansPage;