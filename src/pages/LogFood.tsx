
import React from 'react';
import { FoodLogger } from '@/components/FoodLogger/FoodLogger';

const LogFood = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Log Food</h1>
        <p className="text-gray-600 mt-2">Track your meals and nutrition</p>
      </div>
      
      <FoodLogger />
    </div>
  );
};

export default LogFood;
