import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const equipmentData = [
  { name: 'Construction', volume: 32, color: '#f59e0b' },
  { name: 'Medical', volume: 24, color: '#3b82f6' },
  { name: 'Manufacturing', volume: 18, color: '#8b5cf6' },
  { name: 'Transportation', volume: 12, color: '#ef4444' },
  { name: 'Restaurant', volume: 8, color: '#10b981' },
  { name: 'Technology', volume: 6, color: '#06b6d4' }
];

export const EquipmentTypesChart = () => {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Equipment Financing by Type</CardTitle>
        <p className="text-sm text-foreground">Distribution of equipment loans by industry (2024)</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={equipmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Market Share']}
              labelStyle={{ color: '#000' }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
              {equipmentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <p className="text-sm text-foreground">
            *Percentage of total equipment financing volume by equipment type
          </p>
        </div>
      </CardContent>
    </Card>
  );
};