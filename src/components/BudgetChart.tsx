
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetItem } from "@/types";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, Cell, PieChart, Pie, Sector } from "recharts";
import { useState } from "react";

type BudgetChartProps = {
  items: BudgetItem[];
  totalEstimated: number;
  totalActual: number;
};

const COLORS = ['#003049', '#780000', '#c1121f', '#669bbc', '#fdf0d5', '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];

export default function BudgetChart({ items, totalEstimated, totalActual }: BudgetChartProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Prepare data for category breakdown
  const categoryData = items.reduce((acc, item) => {
    const existingCategory = acc.find(c => c.name === item.category);
    if (existingCategory) {
      existingCategory.estimated += item.estimatedAmount;
      existingCategory.actual += item.actualAmount;
    } else {
      acc.push({
        name: item.category,
        estimated: item.estimatedAmount,
        actual: item.actualAmount,
      });
    }
    return acc;
  }, [] as Array<{ name: string; estimated: number; actual: number }>);

  // Prepare data for pie chart
  const statusData = items.reduce((acc, item) => {
    const existingStatus = acc.find(s => s.name === item.status);
    if (existingStatus) {
      existingStatus.value += item.actualAmount;
    } else {
      acc.push({
        name: item.status,
        value: item.actualAmount,
      });
    }
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  
    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#888">
          {payload.name}
        </text>
        <text x={cx} y={cy} textAnchor="middle" fill="#333" fontSize="1.5em">
          ${value.toFixed(0)}
        </text>
        <text x={cx} y={cy} dy={25} textAnchor="middle" fill="#999">
          {(percent * 100).toFixed(1)}%
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

  // Format for tooltip
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

  const totalVariance = totalEstimated - totalActual;
  const isUnderBudget = totalVariance >= 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Estimated Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEstimated.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total planned expenditure</p>
          </CardContent>
        </Card>
        
        <Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Actual Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalActual.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Current total spent</p>
          </CardContent>
        </Card>
        
        <Card className={`bg-background/60 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md ${isUnderBudget ? 'text-green-600' : 'text-red-600'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Budget Variance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isUnderBudget ? '+' : '-'}${Math.abs(totalVariance).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {isUnderBudget ? 'Under budget' : 'Over budget'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
              >
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  tick={{ fontSize: 12 }} 
                  height={70} 
                />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={formatCurrency} />
                <Legend />
                <Bar dataKey="estimated" name="Estimated" fill="#003049" />
                <Bar dataKey="actual" name="Actual" fill="#c1121f" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Budget Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={formatCurrency} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
