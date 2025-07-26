import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Building2, Calendar } from "lucide-react";

const commercialRealEstateSchema = z.object({
  // Business Information
  businessName: z.string().min(2, "Business name is required"),
  ein: z.string().regex(/^\d{2}-\d{7}$/, "EIN format: XX-XXXXXXX"),
  businessAddress: z.string().min(5, "Business address is required"),
  businessCity: z.string().min(2, "City is required"),
  businessState: z.string().min(2, "State is required"),
  businessZip: z.string().regex(/^\d{5}(-\d{4})?$/, "Valid ZIP code required"),
  businessPhone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Phone format: (XXX) XXX-XXXX"),
  industryType: z.string().min(1, "Please select an industry"),
  yearEstablished: z.string().regex(/^\d{4}$/, "Valid year required"),
  
  // Property Information
  loanType: z.enum(["purchase", "refinance", "construction", "cash_out_refinance"]),
  propertyType: z.enum(["office", "retail", "warehouse", "multi_family", "mixed_use", "industrial", "land", "other"]),
  propertyAddress: z.string().min(5, "Property address is required"),
  propertyCity: z.string().min(2, "Property city is required"),
  propertyState: z.string().min(2, "Property state is required"),
  propertyZip: z.string().regex(/^\d{5}(-\d{4})?$/, "Valid ZIP code required"),
  propertyValue: z.string().min(1, "Property value is required"),
  purchasePrice: z.string().optional(),
  downPayment: z.string().min(1, "Down payment amount is required"),
  
  // Loan Information
  loanAmount: z.string().min(1, "Loan amount is required"),
  termPreference: z.enum(["10", "15", "20", "25", "30"]),
  rateType: z.enum(["fixed", "variable", "hybrid"]),
  propertyUse: z.enum(["owner_occupied", "investment", "mixed_use"]),
  occupancyRate: z.string().optional(),
  
  // Property Details
  squareFootage: z.string().min(1, "Square footage is required"),
  yearBuilt: z.string().regex(/^\d{4}$/, "Valid year required"),
  propertyCondition: z.enum(["excellent", "good", "fair", "needs_work"]),
  environmentalConcerns: z.enum(["none", "minor", "moderate", "significant"]),
  appraisalCompleted: z.enum(["yes", "no", "scheduled"]),
  
  // Personal Information
  ownerFirstName: z.string().min(2, "First name is required"),
  ownerLastName: z.string().min(2, "Last name is required"),
  ownerSSN: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, "SSN format: XXX-XX-XXXX"),
  ownerEmail: z.string().email("Valid email required"),
  ownerPhone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Phone format: (XXX) XXX-XXXX"),
  creditScore: z.enum(["750_plus", "700_749", "650_699", "600_649", "below_600"]),
  realEstateExperience: z.enum(["first_time", "some_experience", "experienced", "professional"]),
  
  // Financial Information
  annualRevenue: z.string().min(1, "Annual revenue is required"),
  netWorth: z.string().min(1, "Net worth is required"),
  liquidAssets: z.string().min(1, "Liquid assets required"),
  existingMortgages: z.string().optional(),
  otherRealEstate: z.string().optional(),
  
  // Additional Information
  exitStrategy: z.string().min(20, "Please describe your exit strategy"),
  additionalInfo: z.string().optional(),
  
  // Financial Documents Available
  personalFinancialStatement: z.boolean().default(false),
  taxReturns: z.boolean().default(false),
  bankStatements: z.boolean().default(false),
  rentRoll: z.boolean().default(false),
  operatingStatements: z.boolean().default(false),
  
  // Agreements
  creditAuthorization: z.boolean().refine(val => val === true, "Credit authorization is required"),
  termsAgreement: z.boolean().refine(val => val === true, "Terms agreement is required")
});

type CommercialRealEstateFormData = z.infer<typeof commercialRealEstateSchema>;

const CommercialRealEstateApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  
  const form = useForm<CommercialRealEstateFormData>({
    resolver: zodResolver(commercialRealEstateSchema),
    defaultValues: {
      personalFinancialStatement: false,
      taxReturns: false,
      bankStatements: false,
      rentRoll: false,
      operatingStatements: false,
      creditAuthorization: false,
      termsAgreement: false
    }
  });

  const onSubmit = (data: CommercialRealEstateFormData) => {
    console.log("Commercial Real Estate Application Data:", data);
    toast({
      title: "Commercial Real Estate Application Submitted!",
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
    "Property Details", 
    "Loan Information",
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
                    <div className={`w-8 sm:w-12 h-0.5 mx-2 ${
                      index + 1 < currentStep ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Building2 className="h-6 w-6" />
                Commercial Real Estate Loan Application
              </CardTitle>
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
                          name="ein"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>EIN</FormLabel>
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

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="industryType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Industry Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select industry" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="real_estate">Real Estate</SelectItem>
                                  <SelectItem value="construction">Construction</SelectItem>
                                  <SelectItem value="retail">Retail</SelectItem>
                                  <SelectItem value="hospitality">Hospitality</SelectItem>
                                  <SelectItem value="healthcare">Healthcare</SelectItem>
                                  <SelectItem value="professional_services">Professional Services</SelectItem>
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
                      </div>
                    </div>
                  )}

                  {/* Step 2: Property Details */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="loanType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loan Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select loan type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="purchase">Purchase</SelectItem>
                                  <SelectItem value="refinance">Refinance</SelectItem>
                                  <SelectItem value="construction">Construction</SelectItem>
                                  <SelectItem value="cash_out_refinance">Cash-Out Refinance</SelectItem>
                                </SelectContent>
                              </Select>
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
                                  <SelectItem value="warehouse">Warehouse/Industrial</SelectItem>
                                  <SelectItem value="multi_family">Multi-Family</SelectItem>
                                  <SelectItem value="mixed_use">Mixed Use</SelectItem>
                                  <SelectItem value="industrial">Industrial</SelectItem>
                                  <SelectItem value="land">Land</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

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

                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="propertyCity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Property City</FormLabel>
                              <FormControl>
                                <Input placeholder="City" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="propertyState"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Property State</FormLabel>
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
                          name="propertyZip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Property ZIP Code</FormLabel>
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
                          name="squareFootage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Square Footage</FormLabel>
                              <FormControl>
                                <Input placeholder="0 sq ft" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="yearBuilt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year Built</FormLabel>
                              <FormControl>
                                <Input placeholder="YYYY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="propertyCondition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Property Condition</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select condition" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="excellent">Excellent</SelectItem>
                                  <SelectItem value="good">Good</SelectItem>
                                  <SelectItem value="fair">Fair</SelectItem>
                                  <SelectItem value="needs_work">Needs Work</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
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

export default CommercialRealEstateApplication;