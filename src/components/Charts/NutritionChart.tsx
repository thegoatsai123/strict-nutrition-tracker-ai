
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NutritionData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  calorieGoal: number;
}

interface NutritionChartProps {
  data: NutritionData[];
  type: 'line' | 'bar' | 'pie';
  title: string;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

export const NutritionChart: React.FC<NutritionChartProps> = ({ data, type, title }) => {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="calories" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="calorieGoal" stroke="#ff7300" strokeDasharray="5 5" />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="protein" fill="#8884d8" />
            <Bar dataKey="carbs" fill="#82ca9d" />
            <Bar dataKey="fat" fill="#ffc658" />
          </BarChart>
        );
      case 'pie':
        const latestData = data[data.length - 1];
        if (!latestData) return null;
        
        const pieData = [
          { name: 'Protein', value: latestData.protein, color: '#8884d8' },
          { name: 'Carbs', value: latestData.carbs, color: '#82ca9d' },
          { name: 'Fat', value: latestData.fat, color: '#ffc658' },
        ];
        
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
