import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const approvalData = [
  { name: 'SBA 7(a)', rate: 92, color: '#16a34a' },
  { name: 'SBA 504', rate: 89, color: '#059669' },
  { name: 'SBA Express', rate: 87, color: '#10b981' },
  { name: 'Equipment', rate: 94, color: '#34d399' },
  { name: 'Working Capital', rate: 86, color: '#6ee7b7' },
  { name: 'Term Loans', rate: 91, color: '#22c55e' }
];

export const LoanApprovalChart = () => {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Loan Approval Rates</CardTitle>
        <p className="text-sm text-foreground">Our approval rates by loan type (2024)</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={approvalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Approval Rate']}
              labelStyle={{ color: '#000' }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
              {approvalData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <p className="text-sm text-foreground">
            *Based on qualified applications processed in 2024
          </p>
        </div>
      </CardContent>
    </Card>
  );
};