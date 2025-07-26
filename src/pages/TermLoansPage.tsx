import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Clock, CheckCircle } from "lucide-react";

const TermLoansPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative bg-gradient-to-r from-financial-navy to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <Badge className="bg-white text-primary mb-4">Fixed Rates</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Business Term Loans</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Predictable financing with fixed monthly payments. Perfect for expansion, equipment purchases, or other major business investments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">Apply for Term Loan</Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Calculate Payment</Button>
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
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">1-10 Years</h3>
                <p className="text-muted-foreground">Flexible terms</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Fixed Rates</h3>
                <p className="text-muted-foreground">Predictable payments</p>
              </CardContent>
            </Card>
          </div>

          {/* Educational Content */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Understanding Business Term Loans</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Term loans provide a lump sum of capital upfront with fixed monthly payments over a predetermined period. 
                They're ideal for major business investments, expansion projects, and long-term strategic initiatives.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>How Term Loans Work</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Term loans provide a fixed amount of capital that you repay over a set period with predictable monthly payments. 
                    Interest rates can be fixed or variable, and the loan is typically secured by business assets or personal guarantees.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-semibold">Predictable Payments:</span>
                        <span className="text-muted-foreground ml-1">Fixed monthly payments make budgeting easier</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-semibold">Lower Interest Rates:</span>
                        <span className="text-muted-foreground ml-1">Generally lower rates than short-term financing</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-semibold">Build Credit:</span>
                        <span className="text-muted-foreground ml-1">Consistent payments improve business credit profile</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Term Loan vs. Other Financing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">vs. Line of Credit</h4>
                      <p className="text-sm text-muted-foreground">
                        Term loans provide immediate access to full amount, while lines of credit offer ongoing access to funds as needed.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">vs. Working Capital Loans</h4>
                      <p className="text-sm text-muted-foreground">
                        Term loans are for long-term investments, while working capital loans address short-term cash flow needs.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">vs. Equipment Financing</h4>
                      <p className="text-sm text-muted-foreground">
                        Term loans offer more flexibility in fund usage, while equipment loans are specifically for equipment purchases.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Industry Applications */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Industry-Specific Applications</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Manufacturing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Fund production equipment, facility expansion, and automated systems to increase capacity and efficiency.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Production line upgrades</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Warehouse expansion</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Quality control systems</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Healthcare</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Invest in medical equipment, practice expansion, and technology upgrades to improve patient care and efficiency.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Medical equipment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Practice acquisition</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">EMR system implementation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Technology</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Fund product development, team expansion, and infrastructure scaling for growing tech companies.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">R&D investments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Team hiring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Infrastructure scaling</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Use Case Examples */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Real-World Success Stories</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Restaurant Chain Expansion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Challenge:</strong> A successful restaurant wanted to open three new locations but needed capital for buildouts, equipment, and initial operating expenses.
                  </p>
                  <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Term Loan Amount:</span>
                      <span className="font-semibold">$750,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Term:</span>
                      <span className="font-semibold">7 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate:</span>
                      <span className="font-semibold">6.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Payment:</span>
                      <span className="font-semibold">$12,450</span>
                    </div>
                  </div>
                  <p className="text-sm text-primary font-semibold mt-3">
                    Result: Opened 3 locations, increased revenue by 180%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Manufacturing Equipment Upgrade</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Challenge:</strong> A precision manufacturing company needed to replace aging equipment to meet new quality standards and increase production capacity.
                  </p>
                  <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Term Loan Amount:</span>
                      <span className="font-semibold">$1,200,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Term:</span>
                      <span className="font-semibold">10 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate:</span>
                      <span className="font-semibold">7.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Payment:</span>
                      <span className="font-semibold">$13,950</span>
                    </div>
                  </div>
                  <p className="text-sm text-primary font-semibold mt-3">
                    Result: 40% increase in production capacity, new contracts worth $2M annually
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Detailed Application Process */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Term Loan Application Process</h2>
            <div className="grid lg:grid-cols-2 gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>Application Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <h4 className="font-semibold">Pre-qualification (10 minutes)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-11">
                      Answer basic questions about your business and funding needs to see if you qualify.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <h4 className="font-semibold">Full Application (30 minutes)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-11">
                      Complete detailed application with financial information and business details.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <h4 className="font-semibold">Document Review (2-5 days)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-11">
                      Submit financial documents for underwriting review and verification.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <h4 className="font-semibold">Final Approval & Funding (1-3 days)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-11">
                      Review loan terms, sign documents, and receive funds in your account.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Required Financial Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Personal Documents</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Personal tax returns (2 years)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Personal financial statement</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Government-issued ID</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Business Documents</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Business tax returns (2-3 years)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Financial statements</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Bank statements (6 months)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Business plan or use of funds</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Term Loan Benefits</h2>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Fixed monthly payments for budgeting certainty</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Competitive interest rates</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>No prepayment penalties</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Fast approval process</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>Build business credit history</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Common Uses for Term Loans</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Business expansion</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Equipment purchases</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Inventory financing</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Real estate purchases</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Debt consolidation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Working capital</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Term Loan Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Credit Score:</span>
                  <span className="font-semibold">650+</span>
                </div>
                <div className="flex justify-between">
                  <span>Time in Business:</span>
                  <span className="font-semibold">1+ years</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Revenue:</span>
                  <span className="font-semibold">$100K+</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Rates:</span>
                  <span className="font-semibold">Starting at 6.5%</span>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Payment Example</h4>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Loan Amount:</span>
                        <span>$100,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interest Rate:</span>
                        <span>7.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Term:</span>
                        <span>5 years</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-semibold">
                        <span>Monthly Payment:</span>
                        <span className="text-primary">$2,013</span>
                      </div>
                    </div>
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

export default TermLoansPage;