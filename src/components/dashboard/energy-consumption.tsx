import React, { useState } from "react";
import GlassCard from "@/components/ui/glass-card";
import { EnergyData } from "@/lib/data";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Zap, ChevronDown, ChevronUp, Sun, DollarSign, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface EnergyConsumptionProps {
  data: EnergyData;
}

const EnergyConsumption = ({ data }: EnergyConsumptionProps) => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'KES' | 'EUR' | 'NOK'>('USD');
  
  // Currency exchange rates (as of March 2024)
  const exchangeRates = {
    USD: 1,
    KES: 129.56,
    EUR: 0.92,
    NOK: 10.5
  };
  
  // Currency symbols
  const currencySymbols = {
    USD: '$',
    KES: 'KSh',
    EUR: '€',
    NOK: 'kr'
  };
  
  // Format consumption breakdown data for pie chart
  const consumptionBreakdownData = [
    { name: 'Appliances', value: data.consumption.breakdown.appliances, color: '#8884d8' },
    { name: 'HVAC', value: data.consumption.breakdown.hvac, color: '#82ca9d' },
    { name: 'Lights', value: data.consumption.breakdown.lights, color: '#ffc658' },
    { name: 'Other', value: data.consumption.breakdown.other, color: '#ff8042' }
  ];
  
  // Format comparison data for bar chart
  const comparisonData = [
    { name: 'Solar', value: data.consumption.comparison.solar, color: '#FFB13B' },
    { name: 'Grid', value: data.consumption.comparison.grid, color: '#8884d8' }
  ];
  
  // Generate hourly comparison data
  const getHourlyComparisonData = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return hours.map(hour => {
      // Solar production peaks during daylight hours (8am-6pm)
      const isDaylight = hour >= 8 && hour <= 18;
      const solarFactor = isDaylight ? 0.6 + Math.random() * 0.3 : 0.1 + Math.random() * 0.2;
      const gridFactor = 1 - solarFactor;
      
      return {
        hour: `${hour}:00`,
        solar: Math.round(solarFactor * 100),
        grid: Math.round(gridFactor * 100)
      };
    });
  };
  
  // Generate monthly comparison data
  const getMonthlyComparisonData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => {
      // Solar production is higher in summer months
      const isSummer = ['May', 'Jun', 'Jul', 'Aug', 'Sep'].includes(month);
      const isWinter = ['Nov', 'Dec', 'Jan', 'Feb'].includes(month);
      
      let solarFactor = 0.5; // Spring/Fall
      if (isSummer) solarFactor = 0.7 + Math.random() * 0.2;
      if (isWinter) solarFactor = 0.3 + Math.random() * 0.2;
      
      const gridFactor = 1 - solarFactor;
      
      return {
        month,
        solar: Math.round(solarFactor * 100),
        grid: Math.round(gridFactor * 100)
      };
    });
  };
  
  // Toggle section expansion
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  // Get appliance-specific data
  const getApplianceData = () => {
    return [
      { name: 'Refrigerator', value: 15, color: '#8884d8' },
      { name: 'Washing Machine', value: 10, color: '#82ca9d' },
      { name: 'Dishwasher', value: 8, color: '#ffc658' },
      { name: 'Oven', value: 12, color: '#ff8042' },
      { name: 'Microwave', value: 5, color: '#0088fe' },
      { name: 'TV', value: 7, color: '#00C49F' },
      { name: 'Computer', value: 8, color: '#FFBB28' },
      { name: 'Other', value: 35, color: '#FF8042' }
    ];
  };
  
  // Get HVAC-specific data
  const getHVACData = () => {
    return [
      { name: 'Heating', value: 45, color: '#ff8042' },
      { name: 'Cooling', value: 35, color: '#0088fe' },
      { name: 'Ventilation', value: 20, color: '#00C49F' }
    ];
  };
  
  // Get lighting-specific data
  const getLightingData = () => {
    return [
      { name: 'Living Room', value: 25, color: '#ffc658' },
      { name: 'Kitchen', value: 20, color: '#8884d8' },
      { name: 'Bedrooms', value: 30, color: '#82ca9d' },
      { name: 'Bathroom', value: 10, color: '#ff8042' },
      { name: 'Outdoor', value: 15, color: '#0088fe' }
    ];
  };
  
  // Format currency with the selected currency
  const formatCurrency = (value: number) => {
    const baseValue = value * 0.12; // Convert to USD
    const convertedValue = baseValue * (selectedCurrency === 'USD' ? 1 : exchangeRates[selectedCurrency]);
    
    // Format based on currency
    return `${currencySymbols[selectedCurrency]}${convertedValue.toFixed(2)}`;
  };
  
  // Calculate daily cost savings
  const calculateDailySavings = () => {
    const dailyConsumption = data.consumption.current * 24; // kWh per day
    const solarPercentage = data.consumption.comparison.solar / 100;
    const solarConsumption = dailyConsumption * solarPercentage;
    
    // Base cost in USD per kWh
    const costPerKWh = 0.12;
    const savingsUSD = solarConsumption * costPerKWh;
    
    return savingsUSD;
  };
  
  // Calculate monthly cost savings
  const calculateMonthlySavings = () => {
    return calculateDailySavings() * 30;
  };
  
  // Calculate yearly cost savings
  const calculateYearlySavings = () => {
    return calculateDailySavings() * 365;
  };
  
  return (
    <GlassCard 
      title="Energy Consumption"
      description="Real-time energy usage and analytics"
      className="h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ 
              scale: [0.8, 1.1, 0.8],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="p-2 rounded-full bg-purple-400/20 text-purple-500"
          >
            <Zap size={20} />
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold">{data.consumption.current} kW</h3>
            <p className="text-xs text-muted-foreground">Current Consumption</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <select 
            className="rounded-md border border-input bg-background px-2 py-1 text-xs"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'day' | 'week' | 'month')}
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
      
      <Tabs 
        defaultValue="breakdown" 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="breakdown" className="text-xs sm:text-sm">Breakdown</TabsTrigger>
          <TabsTrigger value="comparison" className="text-xs sm:text-sm">Solar vs Grid</TabsTrigger>
        </TabsList>
        
        <TabsContent value="breakdown" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={consumptionBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {consumptionBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Consumption']}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-2 gap-2 mt-2">
                {consumptionBreakdownData.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => toggleSection(item.name)}
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="flex-1">
                      <p className="text-xs font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.value}%</p>
                    </div>
                    {expandedSection === item.name ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col">
              {expandedSection === 'Appliances' && (
                <div className="h-full">
                  <p className="text-sm font-medium mb-2">Appliances Breakdown</p>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart
                      data={getApplianceData()}
                      layout="vertical"
                      margin={{ top: 5, right: 5, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {getApplianceData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-muted-foreground mt-2">
                    Refrigerator and oven are your highest energy consumers.
                  </p>
                </div>
              )}
              
              {expandedSection === 'HVAC' && (
                <div className="h-full">
                  <p className="text-sm font-medium mb-2">HVAC Breakdown</p>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie
                        data={getHVACData()}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {getHVACData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-muted-foreground mt-2">
                    Heating accounts for nearly half of your HVAC energy usage.
                  </p>
                </div>
              )}
              
              {expandedSection === 'Lights' && (
                <div className="h-full">
                  <p className="text-sm font-medium mb-2">Lighting Breakdown</p>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart
                      data={getLightingData()}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {getLightingData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-muted-foreground mt-2">
                    Lighting accounts for a significant portion of your energy usage.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="comparison" className="pt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium">Solar vs Grid Usage</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                  {selectedCurrency} {currencySymbols[selectedCurrency]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSelectedCurrency('USD')}>
                  USD ($)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCurrency('KES')}>
                  KES (KSh)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCurrency('EUR')}>
                  EUR (€)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCurrency('NOK')}>
                  NOK (kr)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={comparisonData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Usage']}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="flex justify-between mt-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Solar Energy</p>
                  <p className="text-lg font-semibold text-amber-500">{data.consumption.comparison.solar}%</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(calculateDailySavings())} saved/day</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Grid Energy</p>
                  <p className="text-lg font-semibold text-purple-500">{data.consumption.comparison.grid}%</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(data.consumption.current * (data.consumption.comparison.grid / 100) * 24 * 0.12)} cost/day</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20 mb-3">
                <p className="text-sm font-medium mb-1">Energy Independence</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold">{data.consumption.comparison.solar}%</p>
                    <p className="text-xs text-muted-foreground">Self-Powered</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-green-500/20 flex items-center justify-center">
                    <Sun size={24} className="text-amber-500" />
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                <p className="text-sm font-medium mb-1">Cost Savings</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold">{formatCurrency(calculateMonthlySavings())}</p>
                    <p className="text-xs text-muted-foreground">Monthly Savings</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
                    <DollarSign size={24} className="text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Tabs defaultValue="hourly" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="hourly" className="text-xs">Hourly Distribution</TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs">Monthly Trends</TabsTrigger>
              </TabsList>
              
              <TabsContent value="hourly" className="pt-3">
                <p className="text-xs text-muted-foreground mb-2">Solar vs Grid usage throughout the day</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart
                    data={getHourlyComparisonData()}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    stackOffset="expand"
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <YAxis dataKey="hour" type="category" width={40} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                    <Bar dataKey="solar" name="Solar" stackId="a" fill="#FFB13B" />
                    <Bar dataKey="grid" name="Grid" stackId="a" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground mt-2">
                  Solar energy production peaks during daylight hours (8am-6pm).
                </p>
              </TabsContent>
              
              <TabsContent value="monthly" className="pt-3">
                <p className="text-xs text-muted-foreground mb-2">Solar vs Grid usage throughout the year</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart
                    data={getMonthlyComparisonData()}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    stackOffset="expand"
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                    <Bar dataKey="solar" name="Solar" stackId="a" fill="#FFB13B" />
                    <Bar dataKey="grid" name="Grid" stackId="a" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground mt-2">
                  Solar energy production is higher during summer months.
                </p>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20">
            <p className="text-sm font-medium mb-2">Projected Annual Savings</p>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">USD</p>
                <p className="text-sm font-semibold">${calculateYearlySavings().toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">KES</p>
                <p className="text-sm font-semibold">KSh{(calculateYearlySavings() * exchangeRates.KES).toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">EUR</p>
                <p className="text-sm font-semibold">€{(calculateYearlySavings() * exchangeRates.EUR).toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">NOK</p>
                <p className="text-sm font-semibold">kr{(calculateYearlySavings() * exchangeRates.NOK).toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1">
                <ArrowUpFromLine size={14} className="text-green-500" />
                <span className="text-xs">CO₂ Reduction: {Math.round(data.consumption.current * (data.consumption.comparison.solar / 100) * 24 * 365 * 0.4)} kg/year</span>
              </div>
              <div className="flex items-center gap-1">
                <ArrowDownToLine size={14} className="text-blue-500" />
                <span className="text-xs">ROI: {Math.round(100 / (calculateYearlySavings() / 5000))}% per year</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </GlassCard>
  );
};

export default EnergyConsumption;