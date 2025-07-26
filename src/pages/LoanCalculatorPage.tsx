import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Calculator, DollarSign, Percent } from "lucide-react";

const LoanCalculatorPage = () => {
  const [loanAmount, setLoanAmount] = useState("100000");
  const [interestRate, setInterestRate] = useState("7.5");
  const [termYears, setTermYears] = useState("5");
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  const calculatePayment = () => {
    const principal = parseFloat(loanAmount);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = parseFloat(termYears) * 12;

    if (principal && monthlyRate && numberOfPayments) {
      const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                     (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
      const totalPaid = payment * numberOfPayments;
      const interest = totalPaid - principal;
      
      setMonthlyPayment(payment);
      setTotalInterest(interest);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative bg-gradient-to-r from-financial-navy to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <Calculator className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Loan Calculator</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Calculate your monthly payments, total interest, and loan costs with our easy-to-use loan calculator.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Loan Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Loan Amount ($)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="100000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="7.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="termYears">Loan Term</Label>
                  <Select value={termYears} onValueChange={setTermYears}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 year</SelectItem>
                      <SelectItem value="2">2 years</SelectItem>
                      <SelectItem value="3">3 years</SelectItem>
                      <SelectItem value="5">5 years</SelectItem>
                      <SelectItem value="7">7 years</SelectItem>
                      <SelectItem value="10">10 years</SelectItem>
                      <SelectItem value="15">15 years</SelectItem>
                      <SelectItem value="20">20 years</SelectItem>
                      <SelectItem value="25">25 years</SelectItem>
                      <SelectItem value="30">30 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={calculatePayment} className="w-full" size="lg">
                  Calculate Payment
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {monthlyPayment > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center p-6 bg-muted rounded-lg">
                        <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold text-primary">
                          ${monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </div>
                        <div className="text-sm text-muted-foreground">Monthly Payment</div>
                      </div>
                      
                      <div className="text-center p-6 bg-muted rounded-lg">
                        <Percent className="h-8 w-8 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold text-primary">
                          ${totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Interest</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Loan Amount:</span>
                        <span className="font-semibold">${parseFloat(loanAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interest Rate:</span>
                        <span className="font-semibold">{interestRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Loan Term:</span>
                        <span className="font-semibold">{termYears} years</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span>Total Amount Paid:</span>
                        <span className="font-semibold">
                          ${(monthlyPayment * parseFloat(termYears) * 12).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter loan details and click "Calculate Payment" to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Understanding Your Loan</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Principal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The original loan amount you borrow. This is the base amount that will accrue interest over time.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Interest Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The annual percentage rate (APR) charged on the loan. Lower rates mean lower total costs.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Loan Term</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The length of time you have to repay the loan. Longer terms mean lower payments but more total interest.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LoanCalculatorPage;