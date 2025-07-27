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
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";

const bridgeLoanSchema = z.object({
  // Business Information
  businessName: z.string().min(2, "Business name is required"),
  businessAddress: z.string().min(5, "Business address is required"),
  businessPhone: z.string().min(10, "Valid phone number is required"),
  businessEmail: z.string().email("Valid email is required"),
  taxId: z.string().min(9, "Tax ID is required"),
  
  // Loan Details
  loanAmount: z.string().min(1, "Loan amount is required"),
  loanPurpose: z.string().min(1, "Loan purpose is required"),
  urgency: z.string().min(1, "Urgency level is required"),
  timeFrame: z.string().min(1, "Expected time frame is required"),
  
  // Financial Information
  annualRevenue: z.string().min(1, "Annual revenue is required"),
  monthlyRevenue: z.string().min(1, "Monthly revenue is required"),
  existingDebt: z.string().min(1, "Existing debt amount is required"),
  currentAssets: z.string().min(1, "Current assets value is required"),
  
  // Owner Information
  ownerName: z.string().min(2, "Owner name is required"),
  ownerPhone: z.string().min(10, "Owner phone is required"),
  ownerEmail: z.string().email("Valid email is required"),
  creditScore: z.string().min(1, "Credit score range is required"),
  
  // Exit Strategy
  exitStrategy: z.string().min(1, "Exit strategy is required"),
  exitDetails: z.string().min(10, "Exit strategy details are required"),
  
  // Collateral
  collateralType: z.string().min(1, "Collateral type is required"),
  collateralValue: z.string().min(1, "Collateral value is required"),
  collateralDescription: z.string().min(10, "Collateral description is required"),
  
  // Agreements
  certifyInformation: z.boolean().refine(val => val === true, "You must certify the information"),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to terms"),
});

type BridgeLoanFormData = z.infer<typeof bridgeLoanSchema>;

const BridgeLoanApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  
  const form = useForm<BridgeLoanFormData>({
    resolver: zodResolver(bridgeLoanSchema),
    defaultValues: {
      certifyInformation: false,
      agreeToTerms: false,
    },
  });

  const onSubmit = (data: BridgeLoanFormData) => {
    console.log("Bridge Loan Application submitted:", data);
    toast({
      title: "Application Submitted",
      description: "Your bridge loan application has been submitted successfully. We'll review it and contact you within 24 hours.",
    });
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <>
      <SEO 
        title="Bridge Loan Application"
        description="Apply for a bridge loan for short-term financing needs. Fast approval and flexible terms available."
        canonical="/bridge-loan-application"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Bridge Loan Application</h1>
            <p className="text-foreground">Complete your application for bridge financing</p>
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
                    {currentStep === 1 && "Business & Loan Information"}
                    {currentStep === 2 && "Financial Information"}
                    {currentStep === 3 && "Exit Strategy & Collateral"}
                    {currentStep === 4 && "Review & Submit"}
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
                          name="loanAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loan Amount Requested</FormLabel>
                              <FormControl>
                                <Input placeholder="$500,000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="urgency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Urgency Level</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="How urgent is this funding?" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="immediate">Immediate (within 1 week)</SelectItem>
                                  <SelectItem value="urgent">Urgent (within 2 weeks)</SelectItem>
                                  <SelectItem value="moderate">Moderate (within 1 month)</SelectItem>
                                  <SelectItem value="flexible">Flexible (over 1 month)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="loanPurpose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loan Purpose</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="What will you use the funds for?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="cash-flow">Cash Flow Bridge</SelectItem>
                                <SelectItem value="acquisition">Business Acquisition</SelectItem>
                                <SelectItem value="real-estate">Real Estate Purchase</SelectItem>
                                <SelectItem value="refinance">Refinance Existing Debt</SelectItem>
                                <SelectItem value="expansion">Business Expansion</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="timeFrame"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expected Loan Duration</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="How long do you need the loan?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="3-months">3 months</SelectItem>
                                <SelectItem value="6-months">6 months</SelectItem>
                                <SelectItem value="12-months">12 months</SelectItem>
                                <SelectItem value="18-months">18 months</SelectItem>
                                <SelectItem value="24-months">24 months</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="annualRevenue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Annual Revenue</FormLabel>
                              <FormControl>
                                <Input placeholder="$1,000,000" {...field} />
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
                              <FormLabel>Monthly Revenue</FormLabel>
                              <FormControl>
                                <Input placeholder="$85,000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="existingDebt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Existing Business Debt</FormLabel>
                              <FormControl>
                                <Input placeholder="$250,000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="currentAssets"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Assets Value</FormLabel>
                              <FormControl>
                                <Input placeholder="$500,000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
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

                  {currentStep === 3 && (
                    <>
                      <FormField
                        control={form.control}
                        name="exitStrategy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Exit Strategy</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="How will you repay this loan?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="sba-loan">SBA Loan Refinance</SelectItem>
                                <SelectItem value="conventional-loan">Conventional Loan Refinance</SelectItem>
                                <SelectItem value="asset-sale">Asset Sale</SelectItem>
                                <SelectItem value="cash-flow">Improved Cash Flow</SelectItem>
                                <SelectItem value="business-sale">Business Sale</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="exitDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Exit Strategy Details</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Provide detailed explanation of your exit strategy and timeline" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="collateralType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Collateral Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="What collateral will secure this loan?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="real-estate">Real Estate</SelectItem>
                                <SelectItem value="equipment">Equipment</SelectItem>
                                <SelectItem value="inventory">Inventory</SelectItem>
                                <SelectItem value="accounts-receivable">Accounts Receivable</SelectItem>
                                <SelectItem value="personal-guarantee">Personal Guarantee</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="collateralValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Collateral Value</FormLabel>
                            <FormControl>
                              <Input placeholder="$750,000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="collateralDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Collateral Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Describe the collateral in detail" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Review Your Application</h3>
                      <p className="text-foreground">
                        Please review all information before submitting your bridge loan application.
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

export default BridgeLoanApplication;