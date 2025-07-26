import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, Award } from "lucide-react";

const StatsSection = () => {
  const loanVolumeData = [
    { month: 'Jan', amount: 2.4 },
    { month: 'Feb', amount: 2.8 },
    { month: 'Mar', amount: 3.1 },
    { month: 'Apr', amount: 3.6 },
    { month: 'May', amount: 4.2 },
    { month: 'Jun', amount: 4.8 },
  ];

  const loanTypeData = [
    { name: 'SBA 7(a)', value: 45, color: '#3B82F6' },
    { name: 'Commercial Real Estate', value: 30, color: '#10B981' },
    { name: 'Equipment Financing', value: 15, color: '#F59E0B' },
    { name: 'Working Capital', value: 10, color: '#EF4444' },
  ];

  const approvalRateData = [
    { quarter: 'Q1', rate: 78 },
    { quarter: 'Q2', rate: 82 },
    { quarter: 'Q3', rate: 85 },
    { quarter: 'Q4', rate: 88 },
  ];

  const stats = [
    {
      icon: DollarSign,
      title: "$500M+",
      subtitle: "Loans Funded",
      description: "Total capital deployed to growing businesses"
    },
    {
      icon: Users,
      title: "2,500+",
      subtitle: "Businesses Served",
      description: "Successful partnerships across all industries"
    },
    {
      icon: TrendingUp,
      title: "88%",
      subtitle: "Approval Rate",
      description: "Higher than industry average approval rate"
    },
    {
      icon: Award,
      title: "15+ Years",
      subtitle: "Industry Experience",
      description: "Proven track record in business financing"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how we're helping businesses across the nation achieve their growth goals with reliable financing solutions.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.title}</h3>
                <p className="text-lg font-semibold text-primary mb-2">{stat.subtitle}</p>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Loan Volume Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Monthly Loan Volume (Millions)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={loanVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}M`, 'Loan Volume']} />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Loan Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Loan Portfolio Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={loanTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {loanTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Approval Rate Chart */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Quarterly Approval Rate (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={approvalRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis domain={[70, 90]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Approval Rate']} />
                <Bar dataKey="rate" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default StatsSection;