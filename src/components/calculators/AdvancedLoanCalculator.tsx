import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, DollarSign, Percent, Calendar, TrendingUp } from 'lucide-react';

interface LoanCalculation {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  paymentSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

export const AdvancedLoanCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<string>('100000');
  const [interestRate, setInterestRate] = useState<string>('7.5');
  const [termMonths, setTermMonths] = useState<string>('60');
  const [loanType, setLoanType] = useState<string>('term');
  const [downPayment, setDownPayment] = useState<string>('0');
  const [calculation, setCalculation] = useState<LoanCalculation | null>(null);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount) - parseFloat(downPayment);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numPayments = parseInt(termMonths);

    if (principal <= 0 || monthlyRate <= 0 || numPayments <= 0) {
      return;
    }

    // Calculate monthly payment using the standard formula
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - principal;

    // Generate amortization schedule
    const paymentSchedule: Array<{
      month: number;
      payment: number;
      principal: number;
      interest: number;
      balance: number;
    }> = [];

    let remainingBalance = principal;

    for (let month = 1; month <= numPayments; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;

      paymentSchedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, remainingBalance)
      });
    }

    setCalculation({
      monthlyPayment,
      totalPayment,
      totalInterest,
      paymentSchedule
    });
  };

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, termMonths, downPayment]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getLoanTypeDetails = (type: string) => {
    const details = {
      term: { name: 'Term Loan', rate: '6.5-12%', term: '1-7 years' },
      sba: { name: 'SBA Loan', rate: '5.5-9%', term: '5-25 years' },
      equipment: { name: 'Equipment Financing', rate: '4-15%', term: '1-7 years' },
      line_of_credit: { name: 'Line of Credit', rate: '7-25%', term: 'Revolving' },
      commercial_real_estate: { name: 'Commercial Real Estate', rate: '4-8%', term: '10-30 years' }
    };
    return details[type as keyof typeof details] || details.term;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calculator className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Advanced Business Loan Calculator</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Calculate your loan payments, total costs, and amortization schedule
          </p>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="calculator">Calculator</TabsTrigger>
              <TabsTrigger value="comparison">Loan Comparison</TabsTrigger>
              <TabsTrigger value="schedule">Payment Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="loanType">Loan Type</Label>
                    <Select value={loanType} onValueChange={setLoanType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="term">Term Loan</SelectItem>
                        <SelectItem value="sba">SBA Loan</SelectItem>
                        <SelectItem value="equipment">Equipment Financing</SelectItem>
                        <SelectItem value="line_of_credit">Line of Credit</SelectItem>
                        <SelectItem value="commercial_real_estate">Commercial Real Estate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="loanAmount">Loan Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="loanAmount"
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        className="pl-10"
                        placeholder="100,000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="downPayment">Down Payment (Optional)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="downPayment"
                        type="number"
                        value={downPayment}
                        onChange={(e) => setDownPayment(e.target.value)}
                        className="pl-10"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="interestRate"
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        className="pl-10"
                        placeholder="7.5"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="termMonths">Loan Term (Months)</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="termMonths"
                        type="number"
                        value={termMonths}
                        onChange={(e) => setTermMonths(e.target.value)}
                        className="pl-10"
                        placeholder="60"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-accent rounded-lg">
                    <h4 className="font-semibold mb-2">{getLoanTypeDetails(loanType).name}</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Typical Rate: {getLoanTypeDetails(loanType).rate}</p>
                      <p>Typical Term: {getLoanTypeDetails(loanType).term}</p>
                    </div>
                  </div>
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                  {calculation && (
                    <>
                      <Card className="bg-primary text-primary-foreground">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold">
                            {formatCurrency(calculation.monthlyPayment)}
                          </div>
                          <div className="text-sm opacity-90">Monthly Payment</div>
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-lg font-semibold">
                              {formatCurrency(calculation.totalPayment)}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Payment</div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-lg font-semibold text-orange-600">
                              {formatCurrency(calculation.totalInterest)}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Interest</div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">Loan Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Principal Amount:</span>
                              <span>{formatCurrency(parseFloat(loanAmount) - parseFloat(downPayment))}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Interest Rate:</span>
                              <span>{interestRate}% APR</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Loan Term:</span>
                              <span>{termMonths} months ({Math.round(parseInt(termMonths) / 12 * 10) / 10} years)</span>
                            </div>
                            {parseFloat(downPayment) > 0 && (
                              <div className="flex justify-between">
                                <span>Down Payment:</span>
                                <span>{formatCurrency(parseFloat(downPayment))}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Loan Type Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border border-border p-3 text-left">Loan Type</th>
                          <th className="border border-border p-3 text-left">Typical Rate</th>
                          <th className="border border-border p-3 text-left">Term</th>
                          <th className="border border-border p-3 text-left">Best For</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-border p-3 font-medium">SBA 7(a) Loan</td>
                          <td className="border border-border p-3">5.5% - 9%</td>
                          <td className="border border-border p-3">Up to 25 years</td>
                          <td className="border border-border p-3">Working capital, expansion</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3 font-medium">Equipment Financing</td>
                          <td className="border border-border p-3">4% - 15%</td>
                          <td className="border border-border p-3">1-7 years</td>
                          <td className="border border-border p-3">Purchasing equipment</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3 font-medium">Term Loan</td>
                          <td className="border border-border p-3">6.5% - 12%</td>
                          <td className="border border-border p-3">1-7 years</td>
                          <td className="border border-border p-3">General business needs</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3 font-medium">Line of Credit</td>
                          <td className="border border-border p-3">7% - 25%</td>
                          <td className="border border-border p-3">Revolving</td>
                          <td className="border border-border p-3">Cash flow management</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              {calculation && (
                <Card>
                  <CardHeader>
                    <CardTitle>Amortization Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto max-h-96">
                      <table className="w-full border-collapse border border-border text-sm">
                        <thead className="sticky top-0 bg-muted">
                          <tr>
                            <th className="border border-border p-2 text-left">Payment #</th>
                            <th className="border border-border p-2 text-left">Payment</th>
                            <th className="border border-border p-2 text-left">Principal</th>
                            <th className="border border-border p-2 text-left">Interest</th>
                            <th className="border border-border p-2 text-left">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {calculation.paymentSchedule.slice(0, 12).map((payment) => (
                            <tr key={payment.month}>
                              <td className="border border-border p-2">{payment.month}</td>
                              <td className="border border-border p-2">{formatCurrency(payment.payment)}</td>
                              <td className="border border-border p-2">{formatCurrency(payment.principal)}</td>
                              <td className="border border-border p-2">{formatCurrency(payment.interest)}</td>
                              <td className="border border-border p-2">{formatCurrency(payment.balance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {calculation.paymentSchedule.length > 12 && (
                        <p className="text-center text-muted-foreground mt-4">
                          Showing first 12 payments. Full schedule available on request.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};