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
import { CheckCircle, Truck } from "lucide-react";

const equipmentLoanSchema = z.object({
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
  
  // Equipment Information
  equipmentType: z.enum(["construction", "manufacturing", "medical", "restaurant", "transportation", "technology", "agricultural", "other"]),
  equipmentDescription: z.string().min(10, "Please provide detailed equipment description"),
  equipmentCondition: z.enum(["new", "used"]),
  equipmentCost: z.string().min(1, "Equipment cost is required"),
  downPayment: z.string().optional(),
  vendor: z.string().min(2, "Vendor/dealer name is required"),
  vendorQuote: z.boolean().default(false),
  
  // Loan Information
  loanAmount: z.string().min(1, "Loan amount is required"),
  termPreference: z.enum(["24", "36", "48", "60", "72", "84"]),
  
  // Personal Information
  ownerFirstName: z.string().min(2, "First name is required"),
  ownerLastName: z.string().min(2, "Last name is required"),
  ownerSSN: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, "SSN format: XXX-XX-XXXX"),
  ownerEmail: z.string().email("Valid email required"),
  ownerPhone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Phone format: (XXX) XXX-XXXX"),
  creditScore: z.enum(["750_plus", "700_749", "650_699", "600_649", "below_600"]),
  
  // Financial Information
  annualRevenue: z.string().min(1, "Annual revenue is required"),
  monthlyRevenue: z.string().min(1, "Monthly revenue is required"),
  timeInBusiness: z.string().min(1, "Time in business is required"),
  
  // Equipment Usage
  equipmentUse: z.enum(["business_operations", "expansion", "replacement", "startup"]),
  equipmentBenefit: z.string().min(20, "Please explain how this equipment will benefit your business"),
  
  // Agreements
  creditAuthorization: z.boolean().refine(val => val === true, "Credit authorization is required"),
  termsAgreement: z.boolean().refine(val => val === true, "Terms agreement is required")
});

type EquipmentLoanFormData = z.infer<typeof equipmentLoanSchema>;

const EquipmentLoanApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  
  const form = useForm<EquipmentLoanFormData>({
    resolver: zodResolver(equipmentLoanSchema),
    defaultValues: {
      vendorQuote: false,
      creditAuthorization: false,
      termsAgreement: false
    }
  });

  const onSubmit = (data: EquipmentLoanFormData) => {
    // Application submitted - sensitive data removed from logs for security
    toast({
      title: "Equipment Loan Application Submitted!",
      description: "We'll review your application and contact you within 24 hours.",
    });
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    "Business Information",
    "Equipment Details", 
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
              <CardTitle className="flex items-center gap-3">
                <Truck className="h-6 w-6" />
                Equipment Financing Application
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
                                  <SelectItem value="construction">Construction</SelectItem>
                                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                  <SelectItem value="healthcare">Healthcare</SelectItem>
                                  <SelectItem value="restaurant">Restaurant/Food Service</SelectItem>
                                  <SelectItem value="transportation">Transportation</SelectItem>
                                  <SelectItem value="agriculture">Agriculture</SelectItem>
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

                  {/* Step 2: Equipment Details */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="equipmentType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Equipment Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select equipment type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="construction">Construction Equipment</SelectItem>
                                  <SelectItem value="manufacturing">Manufacturing Equipment</SelectItem>
                                  <SelectItem value="medical">Medical Equipment</SelectItem>
                                  <SelectItem value="restaurant">Restaurant Equipment</SelectItem>
                                  <SelectItem value="transportation">Transportation Vehicles</SelectItem>
                                  <SelectItem value="technology">Technology/Computer Equipment</SelectItem>
                                  <SelectItem value="agricultural">Agricultural Equipment</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="equipmentCondition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Equipment Condition</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select condition" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="new">New</SelectItem>
                                  <SelectItem value="used">Used</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="equipmentDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Equipment Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Provide detailed description of the equipment (make, model, specifications, etc.)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="equipmentCost"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Total Equipment Cost</FormLabel>
                              <FormControl>
                                <Input placeholder="$0" {...field} />
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
                              <FormLabel>Down Payment (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="$0" {...field} />
                              </FormControl>
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

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="vendor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Equipment Vendor/Dealer</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter vendor name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="termPreference"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Loan Term (Months)</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select term" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="24">24 Months</SelectItem>
                                  <SelectItem value="36">36 Months</SelectItem>
                                  <SelectItem value="48">48 Months</SelectItem>
                                  <SelectItem value="60">60 Months</SelectItem>
                                  <SelectItem value="72">72 Months</SelectItem>
                                  <SelectItem value="84">84 Months</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="equipmentBenefit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>How will this equipment benefit your business?</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Explain how this equipment will improve productivity, revenue, or operations..."
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
                    
                    {currentStep < 4 ? (
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

export default EquipmentLoanApplication;