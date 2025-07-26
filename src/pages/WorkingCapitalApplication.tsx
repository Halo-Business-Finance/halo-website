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
import { CheckCircle, CreditCard, TrendingUp } from "lucide-react";

const workingCapitalSchema = z.object({
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
  numberOfEmployees: z.string().min(1, "Number of employees required"),
  
  // Working Capital Needs
  loanAmount: z.string().min(1, "Loan amount is required"),
  loanPurpose: z.enum(["inventory", "payroll", "marketing", "seasonal_cash_flow", "accounts_receivable", "expansion", "equipment_repair", "other"]),
  loanPurposeDetails: z.string().min(10, "Please provide details about your working capital needs"),
  termPreference: z.enum(["3", "6", "12", "18", "24"]),
  urgency: z.enum(["immediate", "within_week", "within_month", "flexible"]),
  
  // Cash Flow Information
  monthlyRevenue: z.string().min(1, "Monthly revenue is required"),
  annualRevenue: z.string().min(1, "Annual revenue is required"),
  averageMonthlyExpenses: z.string().min(1, "Monthly expenses required"),
  currentCashFlow: z.string().min(1, "Current cash flow required"),
  bankBalance: z.string().min(1, "Current bank balance required"),
  seasonalBusiness: z.enum(["yes", "no"]),
  seasonalDetails: z.string().optional(),
  
  // Personal Information
  ownerFirstName: z.string().min(2, "First name is required"),
  ownerLastName: z.string().min(2, "Last name is required"),
  ownerSSN: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, "SSN format: XXX-XX-XXXX"),
  ownerEmail: z.string().email("Valid email required"),
  ownerPhone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Phone format: (XXX) XXX-XXXX"),
  creditScore: z.enum(["750_plus", "700_749", "650_699", "600_649", "below_600"]),
  ownershipPercentage: z.string().min(1, "Ownership percentage required"),
  
  // Business Operations
  timeInBusiness: z.string().min(1, "Time in business is required"),
  primaryBankingRelationship: z.string().min(2, "Primary bank name required"),
  existingDebt: z.string().optional(),
  currentLoans: z.string().optional(),
  
  // Financial Documents Available
  bankStatements: z.boolean().default(false),
  taxReturns: z.boolean().default(false),
  profitLossStatement: z.boolean().default(false),
  accountsReceivableAging: z.boolean().default(false),
  
  // Agreements
  creditAuthorization: z.boolean().refine(val => val === true, "Credit authorization is required"),
  termsAgreement: z.boolean().refine(val => val === true, "Terms agreement is required")
});

type WorkingCapitalFormData = z.infer<typeof workingCapitalSchema>;

const WorkingCapitalApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  
  const form = useForm<WorkingCapitalFormData>({
    resolver: zodResolver(workingCapitalSchema),
    defaultValues: {
      bankStatements: false,
      taxReturns: false,
      profitLossStatement: false,
      accountsReceivableAging: false,
      creditAuthorization: false,
      termsAgreement: false
    }
  });

  const onSubmit = (data: WorkingCapitalFormData) => {
    console.log("Working Capital Application Data:", data);
    toast({
      title: "Working Capital Application Submitted!",
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
    "Working Capital Needs", 
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
                <CreditCard className="h-6 w-6" />
                Working Capital Application
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

                      <div className="grid md:grid-cols-3 gap-4">
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
                                  <SelectItem value="retail">Retail</SelectItem>
                                  <SelectItem value="restaurant">Restaurant</SelectItem>
                                  <SelectItem value="construction">Construction</SelectItem>
                                  <SelectItem value="professional_services">Professional Services</SelectItem>
                                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                  <SelectItem value="healthcare">Healthcare</SelectItem>
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

                  {/* Step 2: Working Capital Needs */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="loanAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Requested Working Capital Amount</FormLabel>
                              <FormControl>
                                <Input placeholder="$0" {...field} />
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
                              <FormLabel>Preferred Repayment Term</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select term" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="3">3 Months</SelectItem>
                                  <SelectItem value="6">6 Months</SelectItem>
                                  <SelectItem value="12">12 Months</SelectItem>
                                  <SelectItem value="18">18 Months</SelectItem>
                                  <SelectItem value="24">24 Months</SelectItem>
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
                            <FormLabel>Primary Purpose for Working Capital</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select primary purpose" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="inventory">Inventory Purchase</SelectItem>
                                <SelectItem value="payroll">Payroll & Benefits</SelectItem>
                                <SelectItem value="marketing">Marketing & Advertising</SelectItem>
                                <SelectItem value="seasonal_cash_flow">Seasonal Cash Flow</SelectItem>
                                <SelectItem value="accounts_receivable">Bridge Accounts Receivable</SelectItem>
                                <SelectItem value="expansion">Business Expansion</SelectItem>
                                <SelectItem value="equipment_repair">Equipment Maintenance/Repair</SelectItem>
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
                            <FormLabel>Detailed Purpose Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Provide specific details about how you plan to use the working capital..."
                                {...field}
                              />
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
                            <FormLabel>Funding Timeline</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="When do you need funding?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="immediate">Immediately (within 48 hours)</SelectItem>
                                <SelectItem value="within_week">Within 1 week</SelectItem>
                                <SelectItem value="within_month">Within 1 month</SelectItem>
                                <SelectItem value="flexible">Flexible timing</SelectItem>
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
                            <FormLabel>Is your business seasonal?</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {form.watch("seasonalBusiness") === "yes" && (
                        <FormField
                          control={form.control}
                          name="seasonalDetails"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Seasonal Business Details</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe your business seasonality and how working capital will help..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}

                  {/* Step 3: Financial Information */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="monthlyRevenue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Average Monthly Revenue</FormLabel>
                              <FormControl>
                                <Input placeholder="$0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="annualRevenue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Annual Revenue</FormLabel>
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
                          name="averageMonthlyExpenses"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Average Monthly Expenses</FormLabel>
                              <FormControl>
                                <Input placeholder="$0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="currentCashFlow"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Monthly Cash Flow</FormLabel>
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
                        name="bankBalance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Bank Balance</FormLabel>
                            <FormControl>
                              <Input placeholder="$0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Available Financial Documents</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="bankStatements"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel>3 months of bank statements</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="taxReturns"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel>Business tax returns</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="profitLossStatement"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel>Profit & Loss statement</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="accountsReceivableAging"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel>Accounts receivable aging</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Review & Submit */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="bg-muted/50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Application Summary</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>Business:</strong> {form.watch("businessName")}</p>
                            <p><strong>Industry:</strong> {form.watch("industryType")}</p>
                            <p><strong>Loan Amount:</strong> {form.watch("loanAmount")}</p>
                          </div>
                          <div>
                            <p><strong>Purpose:</strong> {form.watch("loanPurpose")}</p>
                            <p><strong>Term:</strong> {form.watch("termPreference")} months</p>
                            <p><strong>Timeline:</strong> {form.watch("urgency")}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="creditAuthorization"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel>
                                I authorize Halo Business Finance to perform a credit check
                              </FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="termsAgreement"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel>
                                I agree to the terms and conditions
                              </FormLabel>
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

export default WorkingCapitalApplication;