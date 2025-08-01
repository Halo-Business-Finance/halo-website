import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Scale, DollarSign, Percent, Calendar, TrendingUp } from 'lucide-react';

interface LoanOption {
  id: string;
  name: string;
  interestRate: number;
  termMonths: number;
  fees: number;
  monthlyPayment: number;
  totalCost: number;
  category: 'sba' | 'conventional' | 'alternative';
}

export const LoanComparisonTool: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<string>('100000');
  const [creditScore, setCreditScore] = useState<string>('700');
  const [businessAge, setBusinessAge] = useState<string>('2');
  const [annualRevenue, setAnnualRevenue] = useState<string>('500000');
  const [selectedLoans, setSelectedLoans] = useState<string[]>([]);

  const generateLoanOptions = (): LoanOption[] => {
    const amount = parseFloat(loanAmount);
    const credit = parseInt(creditScore);
    const age = parseInt(businessAge);
    const revenue = parseFloat(annualRevenue);

    const baseOptions: Omit<LoanOption, 'monthlyPayment' | 'totalCost'>[] = [
      {
        id: 'sba-7a',
        name: 'SBA 7(a) Loan',
        interestRate: credit >= 700 ? 6.5 : 8.0,
        termMonths: 120,
        fees: amount * 0.035,
        category: 'sba'
      },
      {
        id: 'sba-504',
        name: 'SBA 504 Loan',
        interestRate: 5.8,
        termMonths: 240,
        fees: amount * 0.025,
        category: 'sba'
      },
      {
        id: 'conventional-term',
        name: 'Conventional Term Loan',
        interestRate: credit >= 700 ? 7.5 : 10.0,
        termMonths: 60,
        fees: amount * 0.015,
        category: 'conventional'
      },
      {
        id: 'equipment-financing',
        name: 'Equipment Financing',
        interestRate: credit >= 700 ? 5.5 : 8.5,
        termMonths: 60,
        fees: amount * 0.01,
        category: 'conventional'
      },
      {
        id: 'business-line-credit',
        name: 'Business Line of Credit',
        interestRate: credit >= 700 ? 8.0 : 12.0,
        termMonths: 12,
        fees: amount * 0.005,
        category: 'alternative'
      },
      {
        id: 'merchant-cash-advance',
        name: 'Merchant Cash Advance',
        interestRate: 25.0,
        termMonths: 12,
        fees: amount * 0.08,
        category: 'alternative'
      }
    ];

    return baseOptions.map(option => {
      const monthlyRate = option.interestRate / 100 / 12;
      const monthlyPayment = option.category === 'alternative' && option.id === 'business-line-credit'
        ? (amount * monthlyRate) // Interest-only for LOC
        : (amount * (monthlyRate * Math.pow(1 + monthlyRate, option.termMonths)) / 
           (Math.pow(1 + monthlyRate, option.termMonths) - 1));
      
      const totalCost = monthlyPayment * option.termMonths + option.fees;

      return {
        ...option,
        monthlyPayment,
        totalCost
      };
    }).filter(option => {
      // Filter based on eligibility criteria
      if (option.category === 'sba' && (credit < 650 || age < 2)) return false;
      if (option.category === 'conventional' && credit < 600) return false;
      return true;
    });
  };

  const loanOptions = generateLoanOptions();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sba': return 'bg-green-100 text-green-800';
      case 'conventional': return 'bg-blue-100 text-blue-800';
      case 'alternative': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleLoanSelection = (loanId: string) => {
    setSelectedLoans(prev => 
      prev.includes(loanId) 
        ? prev.filter(id => id !== loanId)
        : [...prev, loanId].slice(0, 3) // Max 3 comparisons
    );
  };

  const selectedLoanOptions = loanOptions.filter(loan => selectedLoans.includes(loan.id));

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Scale className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Business Loan Comparison Tool</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Compare loan options based on your business profile and needs
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Business Profile Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="loanAmount">Loan Amount Needed</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="loanAmount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="creditScore">Credit Score</Label>
              <Select value={creditScore} onValueChange={setCreditScore}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="800">800+ (Excellent)</SelectItem>
                  <SelectItem value="750">750-799 (Very Good)</SelectItem>
                  <SelectItem value="700">700-749 (Good)</SelectItem>
                  <SelectItem value="650">650-699 (Fair)</SelectItem>
                  <SelectItem value="600">600-649 (Poor)</SelectItem>
                  <SelectItem value="550">Below 600 (Very Poor)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="businessAge">Business Age (Years)</Label>
              <Select value={businessAge} onValueChange={setBusinessAge}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">6 months</SelectItem>
                  <SelectItem value="1">1 year</SelectItem>
                  <SelectItem value="2">2 years</SelectItem>
                  <SelectItem value="3">3 years</SelectItem>
                  <SelectItem value="5">5+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="annualRevenue">Annual Revenue</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="annualRevenue"
                  type="number"
                  value={annualRevenue}
                  onChange={(e) => setAnnualRevenue(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Available Loan Options */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Available Loan Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loanOptions.map((loan) => (
                <Card 
                  key={loan.id} 
                  className={`cursor-pointer transition-all ${
                    selectedLoans.includes(loan.id) 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => toggleLoanSelection(loan.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{loan.name}</h4>
                      <Badge className={`text-xs ${getCategoryColor(loan.category)}`}>
                        {loan.category.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rate:</span>
                        <span className="font-medium">{loan.interestRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Term:</span>
                        <span className="font-medium">{loan.termMonths} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monthly:</span>
                        <span className="font-medium">{formatCurrency(loan.monthlyPayment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Cost:</span>
                        <span className="font-medium">{formatCurrency(loan.totalCost)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              Click on loan options to compare (up to 3). Selected: {selectedLoans.length}/3
            </p>
          </div>

          {/* Comparison Table */}
          {selectedLoanOptions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Loan Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">Feature</th>
                      {selectedLoanOptions.map((loan) => (
                        <th key={loan.id} className="border border-border p-3 text-left">
                          {loan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-medium">Interest Rate</td>
                      {selectedLoanOptions.map((loan) => (
                        <td key={loan.id} className="border border-border p-3">
                          {loan.interestRate.toFixed(1)}%
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">Loan Term</td>
                      {selectedLoanOptions.map((loan) => (
                        <td key={loan.id} className="border border-border p-3">
                          {loan.termMonths} months
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">Monthly Payment</td>
                      {selectedLoanOptions.map((loan) => (
                        <td key={loan.id} className="border border-border p-3 font-semibold">
                          {formatCurrency(loan.monthlyPayment)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium">Upfront Fees</td>
                      {selectedLoanOptions.map((loan) => (
                        <td key={loan.id} className="border border-border p-3">
                          {formatCurrency(loan.fees)}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-accent">
                      <td className="border border-border p-3 font-medium">Total Cost</td>
                      {selectedLoanOptions.map((loan) => (
                        <td key={loan.id} className="border border-border p-3 font-bold">
                          {formatCurrency(loan.totalCost)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Call to Action */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Ready to Apply?</h3>
              <p className="mb-4 opacity-90">
                Get pre-approved for multiple loan options in minutes
              </p>
              <Button variant="secondary" size="lg">
                Start Your Application
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};