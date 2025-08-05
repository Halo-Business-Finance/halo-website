import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";

const lineOfCreditSchema = z.object({
  // Business Information
  businessName: z.string().min(2, "Business name is required"),
  businessAddress: z.string().min(5, "Business address is required"),
  businessPhone: z.string().min(10, "Valid phone number is required"),
  businessEmail: z.string().email("Valid email is required"),
  taxId: z.string().min(9, "Tax ID is required"),
  yearEstablished: z.string().min(4, "Year established is required"),
  businessStructure: z.string().min(1, "Business structure is required"),
  industry: z.string().min(1, "Industry is required"),
  
  // Line of Credit Details
  creditLineAmount: z.string().min(1, "Credit line amount is required"),
  intendedUse: z.string().min(1, "Intended use is required"),
  drawFrequency: z.string().min(1, "Draw frequency is required"),
  
  // Financial Information
  annualRevenue: z.string().min(1, "Annual revenue is required"),
  monthlyRevenue: z.string().min(1, "Monthly revenue is required"),
  monthlyExpenses: z.string().min(1, "Monthly expenses is required"),
  yearsInBusiness: z.string().min(1, "Years in business is required"),
  currentDebt: z.string().min(1, "Current debt amount is required"),
  
  // Banking Information
  bankName: z.string().min(2, "Bank name is required"),
  accountType: z.string().min(1, "Account type is required"),
  averageBalance: z.string().min(1, "Average balance is required"),
  bankingYears: z.string().min(1, "Years with bank is required"),
  
  // Owner Information
  ownerName: z.string().min(2, "Owner name is required"),
  ownerSSN: z.string().min(9, "SSN is required"),
  ownerAddress: z.string().min(5, "Owner address is required"),
  ownerPhone: z.string().min(10, "Owner phone is required"),
  ownerEmail: z.string().email("Valid email is required"),
  ownerPercentage: z.string().min(1, "Ownership percentage is required"),
  personalIncome: z.string().min(1, "Personal income is required"),
  
  // Credit Information
  creditScore: z.string().min(1, "Credit score range is required"),
  personalAssets: z.string().min(1, "Personal assets value is required"),
  personalDebt: z.string().min(1, "Personal debt amount is required"),
  
  // Usage Information
  seasonalBusiness: z.string().min(1, "Please specify if seasonal"),
  busySeason: z.string().optional(),
  creditUsage: z.string().min(10, "Credit usage description is required"),
  
  // Agreements
  certifyInformation: z.boolean().refine(val => val === true, "You must certify the information"),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to terms"),
});

type LineOfCreditFormData = z.infer<typeof lineOfCreditSchema>;

const BusinessLineOfCreditApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  
  const form = useForm<LineOfCreditFormData>({
    resolver: zodResolver(lineOfCreditSchema),
    defaultValues: {
      certifyInformation: false,
      agreeToTerms: false,
    },
  });

  const onSubmit = (data: LineOfCreditFormData) => {
    toast({
      title: "Application Submitted",
      description: "Your business line of credit application has been submitted successfully. We'll review it and contact you within 24 hours.",
    });
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <>
      <SEO 
        title="Business Line of Credit Application"
        description="Apply for a business line of credit for flexible access to working capital when you need it."
        canonical="/business-line-of-credit-application"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Business Line of Credit Application</h1>
            <p className="text-foreground">Complete your application for a flexible business line of credit</p>
            <div className="mt-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-foreground mt-2">Step {currentStep} of {totalSteps}</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {currentStep === 1 && "Business Information"}
                    {currentStep === 2 && "Credit Line Details"}
                    {currentStep === 3 && "Financial & Banking Information"}
                    {currentStep === 4 && "Owner & Credit Information"}
                    {currentStep === 5 && "Review & Submit"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentStep === 1 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="businessName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter business name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="taxId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Federal Tax ID</FormLabel>
                              <FormControl>
                                <Input placeholder="XX-XXXXXXX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="businessAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter complete business address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="businessPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="(555) 123-4567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="businessEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="business@company.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="yearEstablished"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year Established</FormLabel>
                              <FormControl>
                                <Input placeholder="YYYY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="yearsInBusiness"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Years in Business</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select years" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1-2">1-2 years</SelectItem>
                                  <SelectItem value="2-3">2-3 years</SelectItem>
                                  <SelectItem value="3-5">3-5 years</SelectItem>
                                  <SelectItem value="5-10">5-10 years</SelectItem>
                                  <SelectItem value="10+">10+ years</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="businessStructure"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Structure</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select structure" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                                  <SelectItem value="partnership">Partnership</SelectItem>
                                  <SelectItem value="llc">LLC</SelectItem>
                                  <SelectItem value="corporation">Corporation</SelectItem>
                                  <SelectItem value="s-corp">S Corporation</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="industry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Industry</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select industry" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="retail">Retail</SelectItem>
                                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                  <SelectItem value="services">Services</SelectItem>
                                  <SelectItem value="construction">Construction</SelectItem>
                                  <SelectItem value="healthcare">Healthcare</SelectItem>
                                  <SelectItem value="technology">Technology</SelectItem>
                                  <SelectItem value="restaurant">Restaurant</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <FormField
                        control={form.control}
                        name="creditLineAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Credit Line Amount Requested</FormLabel>
                            <FormControl>
                              <Input placeholder="$100,000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="intendedUse"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Intended Use</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="What will you primarily use the credit line for?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="working-capital">Working Capital</SelectItem>
                                <SelectItem value="inventory">Inventory Purchases</SelectItem>
                                <SelectItem value="seasonal-expenses">Seasonal Expenses</SelectItem>
                                <SelectItem value="payroll">Payroll</SelectItem>
                                <SelectItem value="equipment">Equipment Purchases</SelectItem>
                                <SelectItem value="marketing">Marketing & Advertising</SelectItem>
                                <SelectItem value="expansion">Business Expansion</SelectItem>
                                <SelectItem value="emergency">Emergency Fund</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="drawFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expected Draw Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="How often do you expect to draw from the line?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="seasonally">Seasonally</SelectItem>
                                <SelectItem value="as-needed">As Needed</SelectItem>
                                <SelectItem value="rarely">Rarely</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="seasonalBusiness"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Seasonal Business</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Is your business seasonal?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="yes">Yes, seasonal</SelectItem>
                                <SelectItem value="somewhat">Somewhat seasonal</SelectItem>
                                <SelectItem value="no">No, year-round</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="busySeason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Busy Season (if applicable)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., November-January" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="creditUsage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Credit Usage Plan</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Describe how you plan to use the credit line and your repayment strategy" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {currentStep === 3 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="annualRevenue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Annual Revenue</FormLabel>
                              <FormControl>
                                <Input placeholder="$500,000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="monthlyRevenue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Average Monthly Revenue</FormLabel>
                              <FormControl>
                                <Input placeholder="$42,000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="monthlyExpenses"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monthly Expenses</FormLabel>
                              <FormControl>
                                <Input placeholder="$35,000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="currentDebt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Business Debt</FormLabel>
                              <FormControl>
                                <Input placeholder="$50,000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="bankName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Bank</FormLabel>
                            <FormControl>
                              <Input placeholder="Bank name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="accountType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="checking">Business Checking</SelectItem>
                                  <SelectItem value="savings">Business Savings</SelectItem>
                                  <SelectItem value="both">Both</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bankingYears"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Years with Bank</FormLabel>
                              <FormControl>
                                <Input placeholder="3" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="averageBalance"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Average Balance</FormLabel>
                              <FormControl>
                                <Input placeholder="$25,000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}

                  {currentStep === 4 && (
                    <>
                      <FormField
                        control={form.control}
                        name="ownerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Owner Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="ownerSSN"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Social Security Number</FormLabel>
                              <FormControl>
                                <Input placeholder="XXX-XX-XXXX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ownerPercentage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ownership Percentage</FormLabel>
                              <FormControl>
                                <Input placeholder="100%" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="ownerAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Owner Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter complete address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="ownerPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Owner Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="(555) 123-4567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="ownerEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Owner Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="owner@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="personalIncome"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Personal Annual Income</FormLabel>
                              <FormControl>
                                <Input placeholder="$75,000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="personalAssets"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Personal Assets</FormLabel>
                              <FormControl>
                                <Input placeholder="$200,000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="personalDebt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Personal Debt</FormLabel>
                              <FormControl>
                                <Input placeholder="$25,000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="creditScore"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Credit Score Range</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select credit score range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="excellent">Excellent (750+)</SelectItem>
                                <SelectItem value="good">Good (700-749)</SelectItem>
                                <SelectItem value="fair">Fair (650-699)</SelectItem>
                                <SelectItem value="poor">Poor (600-649)</SelectItem>
                                <SelectItem value="bad">Bad (Below 600)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {currentStep === 5 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Review Your Application</h3>
                      <p className="text-foreground">
                        Please review all information before submitting your business line of credit application.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="certifyInformation"
                            {...form.register("certifyInformation")}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="certifyInformation" className="text-sm">
                            I certify that all information provided is true and accurate to the best of my knowledge.
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="agreeToTerms"
                            {...form.register("agreeToTerms")}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="agreeToTerms" className="text-sm">
                            I agree to the terms and conditions and authorize Halo Business Finance to process this application.
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="flex items-center gap-2">
                    Submit Application
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default BusinessLineOfCreditApplication;