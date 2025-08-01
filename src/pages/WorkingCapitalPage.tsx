import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, Clock, TrendingUp } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import businessLoanApproved from "@/assets/business-loan-approved.jpg";

const WorkingCapitalPage = () => {
  return (
    <>
      <SEO 
        title="Working Capital Loans & Lines of Credit | Up to $500K | Halo Business Finance"
        description="Working capital loans and business lines of credit from $25K to $500K. Fast approval, flexible terms, competitive rates. Fund operations, inventory, payroll."
        keywords="working capital loans, business line of credit, cash flow financing, short term business loans, inventory financing, payroll financing, operating capital, business credit line"
        canonical="https://halobusinessfinance.com/working-capital"
      />
      <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative bg-gradient-to-r from-financial-navy to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="flex items-center gap-4 mb-6">
                <Badge className="bg-white text-primary">Fast Funding</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Working Capital Loans</h1>
              <p className="text-xl mb-8 opacity-90">
                Bridge cash flow gaps and fund day-to-day operations with flexible working capital solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild><a href="https://preview--hbf-application.lovable.app/auth?loan=working-capital">Apply for Working Capital</a></Button>
                <Button size="lg" variant="ghost" className="border border-white text-white hover:bg-white/10">Calculate Payments</Button>
              </div>
            </div>
            <div className="relative">
              <img src={businessLoanApproved} alt="Working capital approved" className="rounded-lg shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Up to $2 Million</h3>
                <p className="text-muted-foreground">Loan amount</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">3-24 Months</h3>
                <p className="text-muted-foreground">Flexible terms</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Prime + 1%</h3>
                <p className="text-muted-foreground">Starting rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Educational Content */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Understanding Working Capital Loans</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Working capital loans provide short-term financing to cover day-to-day operational expenses. 
                Unlike traditional term loans, these are designed to bridge temporary cash flow gaps and maintain business continuity.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>How Working Capital Loans Work</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Working capital loans are short-term financing solutions that help businesses manage cash flow fluctuations. 
                    The loan amount is typically based on your monthly revenue and can be repaid through daily or weekly payments.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-semibold">Fast Approval:</span>
                        <span className="text-muted-foreground ml-1">Most applications approved within 24 hours</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-semibold">Flexible Repayment:</span>
                        <span className="text-muted-foreground ml-1">Daily, weekly, or monthly payment options</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-semibold">No Collateral:</span>
                        <span className="text-muted-foreground ml-1">Unsecured financing based on business performance</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Benefits & Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Immediate Access to Capital</h4>
                      <p className="text-sm text-muted-foreground">
                        Get funding as quickly as 24 hours after approval, perfect for urgent business needs.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Revenue-Based Qualification</h4>
                      <p className="text-sm text-muted-foreground">
                        Qualification based on monthly revenue rather than just credit score or collateral.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Seasonal Business Support</h4>
                      <p className="text-sm text-muted-foreground">
                        Ideal for businesses with seasonal fluctuations or cyclical cash flow patterns.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Build Credit History</h4>
                      <p className="text-sm text-muted-foreground">
                        Successful repayment helps establish and improve your business credit profile.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Use Case Examples */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Real-World Use Case Examples</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Retail Inventory Boost</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Scenario:</strong> A clothing retailer needs $150,000 to stock up for the holiday season 
                    but won't see sales revenue until December.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Loan Amount:</span>
                      <span className="font-semibold">$150,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Term:</span>
                      <span className="font-semibold">6 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Use:</span>
                      <span className="font-semibold">Holiday inventory</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROI:</span>
                      <span className="font-semibold text-primary">300% sales increase</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Construction Payroll Gap</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Scenario:</strong> A construction company has a 60-day payment delay from a major client 
                    but needs to pay workers and suppliers immediately.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Loan Amount:</span>
                      <span className="font-semibold">$300,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Term:</span>
                      <span className="font-semibold">3 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Use:</span>
                      <span className="font-semibold">Payroll & supplies</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Result:</span>
                      <span className="font-semibold text-primary">Project completed on time</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Restaurant Equipment Repair</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    <strong>Scenario:</strong> A restaurant's main kitchen equipment breaks down during peak season, 
                    requiring immediate replacement to avoid losing customers.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Loan Amount:</span>
                      <span className="font-semibold">$75,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Term:</span>
                      <span className="font-semibold">12 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Use:</span>
                      <span className="font-semibold">Equipment replacement</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Outcome:</span>
                      <span className="font-semibold text-primary">Zero downtime</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Industry-Specific Information */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Industry-Specific Applications</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>High-Volume Industries</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Retail & E-commerce</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Perfect for seasonal inventory builds, Black Friday preparation, and managing supplier payment terms.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Holiday season inventory financing</li>
                      <li>• Supplier payment term gaps</li>
                      <li>• Marketing campaign funding</li>
                      <li>• Rapid expansion into new markets</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Manufacturing</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Bridge gaps between large orders and customer payments, fund raw material purchases.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Large order raw material costs</li>
                      <li>• Equipment maintenance and repairs</li>
                      <li>• Seasonal production ramp-up</li>
                      <li>• Export order fulfillment</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Industries</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Professional Services</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Cover project costs upfront while waiting for client payments, especially for large consulting projects.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Project startup costs</li>
                      <li>• Contractor and freelancer payments</li>
                      <li>• Technology and software investments</li>
                      <li>• Office expansion and setup</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Healthcare</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Manage insurance reimbursement delays and fund practice expansion or equipment needs.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Insurance reimbursement gaps</li>
                      <li>• Medical equipment purchases</li>
                      <li>• Staff hiring and training</li>
                      <li>• Practice expansion projects</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Detailed Application Process */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Complete Application Process</h2>
            <div className="grid lg:grid-cols-2 gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>Step-by-Step Application</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <h4 className="font-semibold">Initial Application (5 minutes)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-11">
                      Complete our online application with basic business information and funding needs.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <h4 className="font-semibold">Document Submission (1 hour)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-11">
                      Upload required documents through our secure portal.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <h4 className="font-semibold">Review & Approval (2-24 hours)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-11">
                      Our underwriting team reviews your application and provides a decision.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <h4 className="font-semibold">Funding (Same day)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground ml-11">
                      Upon approval, funds are deposited directly into your business account.
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
                    <h4 className="font-semibold mb-3">Essential Documents</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Last 3 months bank statements</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Business tax returns (last 2 years)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Profit & loss statements</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">Business license and registration</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Additional Documents (if applicable)</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Accounts receivable aging report</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Major contract agreements</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Equipment appraisals</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Lease agreements</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Common Uses and Requirements */}
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Common Uses for Working Capital</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Inventory purchases</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Payroll expenses</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Seasonal cash flow gaps</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Marketing campaigns</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Operating expenses</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Equipment repairs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Account receivable gaps</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Growth opportunities</span>
                  </div>
                </div>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Working Capital Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Credit Score:</span>
                  <span className="font-semibold">580+</span>
                </div>
                <div className="flex justify-between">
                  <span>Time in Business:</span>
                  <span className="font-semibold">3+ months</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Revenue:</span>
                  <span className="font-semibold">$10K+</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Rates:</span>
                  <span className="font-semibold">Starting at 8.9%</span>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Quick Approval</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Fast 24-hour approval</li>
                    <li>• Minimal documentation</li>
                    <li>• Flexible repayment terms</li>
                    <li>• No collateral required</li>
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

export default WorkingCapitalPage;