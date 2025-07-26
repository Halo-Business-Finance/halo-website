import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Upload, DollarSign } from "lucide-react";

const sbaLoanSchema = z.object({
  // Business Information
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  legalBusinessName: z.string().min(2, "Legal business name is required"),
  ein: z.string().regex(/^\d{2}-\d{7}$/, "EIN must be in format XX-XXXXXXX"),
  businessAddress: z.string().min(5, "Business address is required"),
  businessCity: z.string().min(2, "City is required"),
  businessState: z.string().min(2, "State is required"),
  businessZip: z.string().regex(/^\d{5}(-\d{4})?$/, "Valid ZIP code required"),
  businessPhone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Phone format: (XXX) XXX-XXXX"),
  website: z.string().url().optional().or(z.literal("")),
  businessType: z.enum(["corporation", "llc", "partnership", "sole_proprietorship", "other"]),
  industryType: z.string().min(1, "Please select an industry"),
  yearEstablished: z.string().regex(/^\d{4}$/, "Valid year required"),
  numberOfEmployees: z.string().min(1, "Number of employees required"),
  
  // Loan Information
  loanType: z.enum(["sba_7a", "sba_504", "sba_express", "sba_microloans"]),
  loanAmount: z.string().min(1, "Loan amount is required"),
  loanPurpose: z.enum(["working_capital", "equipment", "real_estate", "debt_refinancing", "business_acquisition", "expansion", "other"]),
  loanPurposeDetails: z.string().optional(),
  
  // Personal Information (Primary Owner)
  ownerFirstName: z.string().min(2, "First name is required"),
  ownerLastName: z.string().min(2, "Last name is required"),
  ownerSSN: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, "SSN format: XXX-XX-XXXX"),
  ownerEmail: z.string().email("Valid email required"),
  ownerPhone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Phone format: (XXX) XXX-XXXX"),
  ownerAddress: z.string().min(5, "Address is required"),
  ownerCity: z.string().min(2, "City is required"),
  ownerState: z.string().min(2, "State is required"),
  ownerZip: z.string().regex(/^\d{5}(-\d{4})?$/, "Valid ZIP code required"),
  ownershipPercentage: z.string().min(1, "Ownership percentage required"),
  creditScore: z.enum(["750_plus", "700_749", "650_699", "600_649", "below_600"]),
  
  // Financial Information
  annualRevenue: z.string().min(1, "Annual revenue is required"),
  monthlyRevenue: z.string().min(1, "Monthly revenue is required"),
  businessCashFlow: z.string().min(1, "Monthly cash flow is required"),
  bankStatements: z.boolean().default(false),
  taxReturns: z.boolean().default(false),
  financialStatements: z.boolean().default(false),
  
  // Additional Information
  existingDebt: z.string().optional(),
  collateral: z.string().optional(),
  additionalInfo: z.string().optional(),
  
  // Agreements
  creditAuthorization: z.boolean().refine(val => val === true, "Credit authorization is required"),
  termsAgreement: z.boolean().refine(val => val === true, "Terms agreement is required")
});

type SBALoanFormData = z.infer<typeof sbaLoanSchema>;

const SBALoanApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  
  const form = useForm<SBALoanFormData>({
    resolver: zodResolver(sbaLoanSchema),
    defaultValues: {
      bankStatements: false,
      taxReturns: false,
      financialStatements: false,
      creditAuthorization: false,
      termsAgreement: false
    }
  });

  const onSubmit = (data: SBALoanFormData) => {
    // Application submitted - sensitive data removed from logs for security
    toast({
      title: "Application Submitted Successfully!",
      description: "We'll review your application and contact you within 24 hours.",
    });
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    "Business Information",
    "Loan Details", 
    "Personal Information",
    "Financial Information",
    "Review & Submit"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index + 1 <= currentStep ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1 <= currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  <span className="ml-2 text-sm font-medium hidden sm:block">{step}</span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 sm:w-16 h-0.5 mx-2 ${
                      index + 1 < currentStep ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">SBA Loan Application</CardTitle>
              <p className="text-muted-foreground">Step {currentStep} of {steps.length}: {steps[currentStep - 1]}</p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Step 1: Business Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="businessName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Name (DBA)</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter business name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="legalBusinessName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Legal Business Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter legal business name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="ein"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>EIN (Employer Identification Number)</FormLabel>
                              <FormControl>
                                <Input placeholder="XX-XXXXXXX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="businessPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="(XXX) XXX-XXXX" {...field} />
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
                              <Input placeholder="Enter street address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="businessCity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="City" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="businessState"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select state" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="CA">California</SelectItem>
                                  <SelectItem value="TX">Texas</SelectItem>
                                  <SelectItem value="FL">Florida</SelectItem>
                                  <SelectItem value="NY">New York</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="businessZip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl>
                                <Input placeholder="XXXXX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="businessType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="corporation">Corporation</SelectItem>
                                  <SelectItem value="llc">LLC</SelectItem>
                                  <SelectItem value="partnership">Partnership</SelectItem>
                                  <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
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
                          name="numberOfEmployees"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Employees</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Loan Details */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="loanType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SBA Loan Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select loan type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="sba_7a">SBA 7(a) Loan</SelectItem>
                                  <SelectItem value="sba_504">SBA 504 Loan</SelectItem>
                                  <SelectItem value="sba_express">SBA Express Loan</SelectItem>
                                  <SelectItem value="sba_microloans">SBA Microloan</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="loanAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Requested Loan Amount</FormLabel>
                              <FormControl>
                                <Input placeholder="$0" {...field} />
                              </FormControl>
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
                            <FormLabel>Primary Loan Purpose</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select loan purpose" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="working_capital">Working Capital</SelectItem>
                                <SelectItem value="equipment">Equipment Purchase</SelectItem>
                                <SelectItem value="real_estate">Real Estate Purchase</SelectItem>
                                <SelectItem value="debt_refinancing">Debt Refinancing</SelectItem>
                                <SelectItem value="business_acquisition">Business Acquisition</SelectItem>
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
                        name="loanPurposeDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loan Purpose Details</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Provide additional details about how you plan to use the loan funds..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={prevStep}
                      disabled={currentStep === 1}
                    >
                      Previous
                    </Button>
                    
                    {currentStep < 5 ? (
                      <Button type="button" onClick={nextStep}>
                        Next Step
                      </Button>
                    ) : (
                      <Button type="submit">
                        Submit Application
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SBALoanApplication;