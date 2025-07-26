import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { CheckCircle, Clock, DollarSign } from "lucide-react";

const PreQualificationPage = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    timeInBusiness: "",
    annualRevenue: "",
    creditScore: "",
    loanAmount: "",
    loanPurpose: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Application submitted - sensitive data removed from logs for security
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative bg-gradient-to-r from-financial-navy to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <Badge className="bg-white text-primary mb-4">No Credit Impact</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Pre-Qualification</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Get pre-qualified for a business loan in minutes. No impact to your credit score. See what financing options are available for your business.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">2 Minutes</h3>
                <p className="text-muted-foreground">Quick application</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No Credit Impact</h3>
                <p className="text-muted-foreground">Soft credit check only</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Up to $5M</h3>
                <p className="text-muted-foreground">Qualification amounts</p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Business Pre-Qualification Form</CardTitle>
                <p className="text-center text-muted-foreground">
                  Complete this form to see what financing options are available for your business
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                        placeholder="Your Business Name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry *</Label>
                      <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="construction">Construction</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="professional-services">Professional Services</SelectItem>
                          <SelectItem value="real-estate">Real Estate</SelectItem>
                          <SelectItem value="transportation">Transportation</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeInBusiness">Time in Business *</Label>
                      <Select value={formData.timeInBusiness} onValueChange={(value) => setFormData({...formData, timeInBusiness: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time in business" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="startup">Startup (Less than 1 year)</SelectItem>
                          <SelectItem value="1-2-years">1-2 years</SelectItem>
                          <SelectItem value="2-5-years">2-5 years</SelectItem>
                          <SelectItem value="5-10-years">5-10 years</SelectItem>
                          <SelectItem value="10-plus-years">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="annualRevenue">Annual Revenue *</Label>
                      <Select value={formData.annualRevenue} onValueChange={(value) => setFormData({...formData, annualRevenue: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select annual revenue" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-100k">Under $100,000</SelectItem>
                          <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                          <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                          <SelectItem value="500k-1m">$500,000 - $1M</SelectItem>
                          <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                          <SelectItem value="5m-plus">$5M+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="creditScore">Credit Score Range</Label>
                      <Select value={formData.creditScore} onValueChange={(value) => setFormData({...formData, creditScore: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select credit score range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent (750+)</SelectItem>
                          <SelectItem value="good">Good (700-749)</SelectItem>
                          <SelectItem value="fair">Fair (650-699)</SelectItem>
                          <SelectItem value="poor">Poor (600-649)</SelectItem>
                          <SelectItem value="bad">Bad (Below 600)</SelectItem>
                          <SelectItem value="unknown">Don't Know</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="loanAmount">Desired Loan Amount *</Label>
                      <Select value={formData.loanAmount} onValueChange={(value) => setFormData({...formData, loanAmount: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan amount" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                          <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                          <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                          <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                          <SelectItem value="500k-1m">$500,000 - $1M</SelectItem>
                          <SelectItem value="1m-plus">$1M+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loanPurpose">Loan Purpose *</Label>
                    <Select value={formData.loanPurpose} onValueChange={(value) => setFormData({...formData, loanPurpose: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select loan purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="working-capital">Working Capital</SelectItem>
                        <SelectItem value="equipment">Equipment Purchase</SelectItem>
                        <SelectItem value="expansion">Business Expansion</SelectItem>
                        <SelectItem value="real-estate">Real Estate Purchase</SelectItem>
                        <SelectItem value="inventory">Inventory</SelectItem>
                        <SelectItem value="refinance">Debt Refinancing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Important Information</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• This is a soft credit check that won't impact your credit score</li>
                      <li>• Pre-qualification is not a guarantee of approval</li>
                      <li>• Final terms may vary based on complete application and underwriting</li>
                      <li>• Your information is secure and confidential</li>
                    </ul>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Get Pre-Qualified
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PreQualificationPage;