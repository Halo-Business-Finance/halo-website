import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const industryData = [
  { name: 'Healthcare', value: 18, color: '#3b82f6' },
  { name: 'Manufacturing', value: 16, color: '#8b5cf6' },
  { name: 'Professional Services', value: 14, color: '#06b6d4' },
  { name: 'Construction', value: 12, color: '#f59e0b' },
  { name: 'Restaurant/Food', value: 11, color: '#ef4444' },
  { name: 'Retail', value: 10, color: '#10b981' },
  { name: 'Transportation', value: 8, color: '#f97316' },
  { name: 'Technology', value: 7, color: '#84cc16' },
  { name: 'Other', value: 4, color: '#6b7280' }
];

export const IndustryStatsChart = () => {
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices < 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Loans by Industry</CardTitle>
        <p className="text-sm text-foreground">Distribution of our loan portfolio (2024)</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={industryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {industryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Share']}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <p className="text-sm text-foreground">
            *Percentage of total loan volume by industry sector
          </p>
        </div>
      </CardContent>
    </Card>
  );
};