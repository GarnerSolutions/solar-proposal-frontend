// Solar Proposal App - React + Tailwind
// Backend Integration + Google Slides Update

import React, { useState } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import axios from 'axios';

export default function SolarProposalApp() {
  const [formData, setFormData] = useState({
    annualConsumption: '',
    desiredProduction: '',
    direction: 'South',
    shading: 'Light',
    address: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async () => {
    setStatus('Calculating proposal...');
    try {
      const response = await axios.post('https://solar-calculator-zb73.onrender.com/api/process', formData);
      const result = response.data;

      // Update Google Slides presentation
      await axios.post('https://solar-calculator-zb73.onrender.com/api/updatePresentation', result);
      setStatus('Proposal generated and slide updated successfully!');
    } catch (err) {
      console.error(err);
      setStatus('An error occurred. Please check console.');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Brighthouse Solar Proposal Generator</h1>

      <Card className="w-full max-w-2xl">
        <CardContent className="p-6 grid gap-4">
          <Input name="annualConsumption" placeholder="Annual Consumption (kWh)" value={formData.annualConsumption} onChange={handleChange} />
          <Input name="desiredProduction" placeholder="Desired Production (kWh)" value={formData.desiredProduction} onChange={handleChange} />
          <select name="direction" value={formData.direction} onChange={handleChange} className="p-2 rounded border">
            {['South', 'Southeast', 'Southwest', 'East', 'West', 'North', 'Northeast', 'Northwest'].map(dir => (
              <option key={dir} value={dir}>{dir}</option>
            ))}
          </select>
          <select name="shading" value={formData.shading} onChange={handleChange} className="p-2 rounded border">
            <option>Light</option>
            <option>Medium</option>
            <option>Heavy</option>
          </select>
          <Input name="address" placeholder="Customer Address" value={formData.address} onChange={handleChange} />
          <Button onClick={handleSubmit}>Generate Proposal</Button>
        </CardContent>
      </Card>

      {status && <p className="mt-4 text-center text-lg text-gray-700">{status}</p>}
    </div>
  );
}
