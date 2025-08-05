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

const sba504Schema = z.object({
  // Business Information
  businessName: z.string().min(2, "Business name is required"),
  businessAddress: z.string().min(5, "Business address is required"),
  businessPhone: z.string().min(10, "Valid phone number is required"),
  businessEmail: z.string().email("Valid email is required"),
  taxId: z.string().min(9, "Tax ID is required"),
  yearEstablished: z.string().min(4, "Year established is required"),
  businessStructure: z.string().min(1, "Business structure is required"),
  
  // Property Information
  propertyAddress: z.string().min(5, "Property address is required"),
  propertyType: z.string().min(1, "Property type is required"),
  purchasePrice: z.string().min(1, "Purchase price is required"),
  downPayment: z.string().min(1, "Down payment amount is required"),
  
  // Loan Details
  loanAmount: z.string().min(1, "Loan amount is required"),
  loanPurpose: z.string().min(1, "Loan purpose is required"),
  
  // Owner Information
  ownerName: z.string().min(2, "Owner name is required"),
  ownerSSN: z.string().min(9, "SSN is required"),
  ownerAddress: z.string().min(5, "Owner address is required"),
  ownerPhone: z.string().min(10, "Owner phone is required"),
  ownerEmail: z.string().email("Valid email is required"),
  ownerPercentage: z.string().min(1, "Ownership percentage is required"),
  
  // Financial Information
  annualRevenue: z.string().min(1, "Annual revenue is required"),
  netIncome: z.string().min(1, "Net income is required"),
  businessAssets: z.string().min(1, "Business assets value is required"),
  businessDebt: z.string().min(1, "Business debt amount is required"),
  personalAssets: z.string().min(1, "Personal assets value is required"),
  personalDebt: z.string().min(1, "Personal debt amount is required"),
  
  // Additional Information
  creditScore: z.string().min(1, "Credit score range is required"),
  collateral: z.string().min(10, "Collateral description is required"),
  
  // Agreements
  certifyInformation: z.boolean().refine(val => val === true, "You must certify the information"),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to terms"),
});

type SBA504FormData = z.infer<typeof sba504Schema>;

const SBA504LoanApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  
  const form = useForm<SBA504FormData>({
    resolver: zodResolver(sba504Schema),
    defaultValues: {
      certifyInformation: false,
      agreeToTerms: false,
    },
  });

  const onSubmit = (data: SBA504FormData) => {
    toast({
      title: "Application Submitted",
      description: "Your SBA 504 loan application has been submitted successfully. We'll review it and contact you within 24 hours.",
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
        title="SBA 504 Loan Application"
        description="Apply for an SBA 504 loan for commercial real estate and major equipment purchases. Fixed-rate financing with low down payments."
        canonical="/sba-504-application"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">SBA 504 Loan Application</h1>
            <p className="text-foreground">Complete your application for SBA 504 financing</p>
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
                    {currentStep === 2 && "Property Information"}
                    {currentStep === 3 && "Owner Information"}
                    {currentStep === 4 && "Financial Information"}
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
                      </div>
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <FormField
                        control={form.control}
                        name="propertyAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter property address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="propertyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select property type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="office">Office Building</SelectItem>
                                <SelectItem value="retail">Retail Space</SelectItem>
                                <SelectItem value="warehouse">Warehouse</SelectItem>
                                <SelectItem value="manufacturing">Manufacturing Facility</SelectItem>
                                <SelectItem value="mixed-use">Mixed Use</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="purchasePrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Purchase Price</FormLabel>
                              <FormControl>
                                <Input placeholder="$500,000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="downPayment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Down Payment (10% minimum)</FormLabel>
                              <FormControl>
                                <Input placeholder="$50,000" {...field} />
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
                              <FormLabel>SBA 504 Loan Amount Requested</FormLabel>
                              <FormControl>
                                <Input placeholder="$450,000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="loanPurpose"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loan Purpose</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select purpose" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="purchase">Real Estate Purchase</SelectItem>
                                  <SelectItem value="construction">New Construction</SelectItem>
                                  <SelectItem value="renovation">Renovation/Improvements</SelectItem>
                                  <SelectItem value="refinance">Refinance</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}

                  {currentStep === 3 && (
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
                                <Input placeholder="51%" {...field} />
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
                    </>
                  )}

                  {currentStep === 4 && (
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
                          name="netIncome"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Net Income</FormLabel>
                              <FormControl>
                                <Input placeholder="$200,000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="businessAssets"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Assets Value</FormLabel>
                              <FormControl>
                                <Input placeholder="$500,000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="businessDebt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Debt</FormLabel>
                              <FormControl>
                                <Input placeholder="$100,000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="personalAssets"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Personal Assets Value</FormLabel>
                              <FormControl>
                                <Input placeholder="$300,000" {...field} />
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
                                <Input placeholder="$50,000" {...field} />
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
                      
                      <FormField
                        control={form.control}
                        name="collateral"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Collateral Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Describe the collateral being used to secure the loan" {...field} />
                            </FormControl>
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
                        Please review all information before submitting your SBA 504 loan application.
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

export default SBA504LoanApplication;