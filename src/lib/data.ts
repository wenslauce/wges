// Mock data for W. Giertsen Energy Management System Dashboard
import { addDays, format, subDays } from 'date-fns';

export interface EnergyData {
  currentProduction: number;
  totalProduction: {
    today: number;
    thisMonth: number;
    thisYear: number;
  };
  batteryStatus: {
    level: number;
    backupHours: number;
    chargeRate: number;
    cycleCount: number;
    health: number;
  };
  gridStatus: 'connected' | 'disconnected';
  consumption: {
    current: number;
    breakdown: {
      appliances: number;
      hvac: number;
      lights: number;
      other: number;
    };
    comparison: {
      solar: number;
      grid: number;
    };
  };
  systemHealth: {
    panels: 'good' | 'warning' | 'critical';
    inverter: 'good' | 'warning' | 'critical';
    battery: 'good' | 'warning' | 'critical';
    wiring: 'good' | 'warning' | 'critical';
  };
  alerts: Array<{
    id: string;
    type: 'info' | 'warning' | 'critical';
    message: string;
    timestamp: string;
  }>;
  hourlyProduction: Array<{
    hour: number;
    production: number;
  }>;
  dailyConsumption: Array<{
    day: string;
    consumption: number;
    production: number;
  }>;
  weatherImpact: {
    sunlightHours: number;
    cloudCover: number;
    temperature: number;
  };
}

// Seasonal factors for energy production (1.0 = baseline)
const seasonalFactors = {
  // Kenya has relatively consistent solar radiation throughout the year
  // with slight variations during rainy seasons (March-May, October-December)
  0: 1.05,  // January - Dry season, good solar production
  1: 1.1,   // February - Dry season, excellent solar production
  2: 0.9,   // March - Beginning of long rains
  3: 0.8,   // April - Long rains, reduced solar production
  4: 0.85,  // May - End of long rains
  5: 0.95,  // June - Dry season
  6: 0.9,   // July - Cooler, sometimes cloudy
  7: 0.95,  // August - Warming up
  8: 1.0,   // September - Good solar conditions
  9: 0.85,  // October - Short rains begin
  10: 0.8,  // November - Short rains
  11: 0.9,  // December - End of short rains
};

// Generate realistic daily production based on month and weather conditions
const generateDailyProduction = (date: Date, baseProduction: number = 25): number => {
  const month = date.getMonth();
  const seasonalFactor = seasonalFactors[month as keyof typeof seasonalFactors];
  
  // Add some randomness to simulate daily weather variations
  const dailyVariation = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
  
  // Weekend factor - slightly higher consumption on weekends
  
  return Number((baseProduction * seasonalFactor * dailyVariation).toFixed(1));
};

// Generate realistic daily consumption based on month and weather conditions
const generateDailyConsumption = (date: Date): number => {
  const month = date.getMonth();
  
  // Consumption is affected by seasons but differently than production
  // Higher in hot months due to cooling, higher in cold months due to heating
  const seasonalConsumptionFactors = {
    0: 0.9,   // January
    1: 0.95,  // February
    2: 1.0,   // March
    3: 1.05,  // April
    4: 1.0,   // May
    5: 0.9,   // June
    6: 0.85,  // July
    7: 0.9,   // August
    8: 0.95,  // September
    9: 1.0,   // October
    10: 1.05, // November
    11: 1.0,  // December
  };
  
  const seasonalFactor = seasonalConsumptionFactors[month as keyof typeof seasonalConsumptionFactors];
  
  // Add some randomness to simulate daily variations
  const dailyVariation = 0.85 + (Math.random() * 0.3); // 0.85 to 1.15
  
  // Weekend factor - higher consumption on weekends
  const dayOfWeek = date.getDay();
  const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 1.15 : 1.0;
  
  // Consumption is related to production but not directly proportional
  // On good production days, we use more solar and less grid
  const baseConsumption = 18; // Base consumption in kWh
  
  return Number((baseConsumption * seasonalFactor * dailyVariation * weekendFactor).toFixed(1));
};

// Generate hourly production data based on time of day
const generateHourlyProduction = (): Array<{ hour: number; production: number }> => {
  const hourlyData = [];
  
  // Realistic solar production curve based on daylight hours
  for (let hour = 6; hour <= 19; hour++) {
    let production = 0;
    
    if (hour >= 6 && hour < 8) {
      // Morning ramp-up
      production = (hour - 6) * 1.1;
    } else if (hour >= 8 && hour < 12) {
      // Mid-morning to noon increase
      production = 2.2 + (hour - 8) * 1.1;
    } else if (hour >= 12 && hour < 15) {
      // Peak production hours
      production = 6.6 - (hour - 12) * 0.1;
    } else if (hour >= 15 && hour <= 19) {
      // Afternoon decline
      production = 6.3 - (hour - 15) * 1.3;
    }
    
    // Add some randomness
    production = Math.max(0, production * (0.9 + Math.random() * 0.2));
    
    hourlyData.push({
      hour,
      production: Number(production.toFixed(1))
    });
  }
  
  return hourlyData;
};

// Generate daily consumption data for the past week
const generatePastWeekConsumption = (): Array<{ day: string; consumption: number; production: number }> => {
  const today = new Date();
  const result = [];
  
  // Generate data for the past 7 days
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const formattedDate = format(date, 'MMM dd');
    const production = generateDailyProduction(date);
    const consumption = generateDailyConsumption(date);
    
    result.push({
      day: formattedDate,
      consumption,
      production
    });
  }
  
  return result;
};

// Generate alerts with realistic timestamps
const generateAlerts = (): Array<{ id: string; type: 'info' | 'warning' | 'critical'; message: string; timestamp: string }> => {
  const today = new Date();
  
  const alertMessages = {
    info: [
      'System update available',
      'Energy production exceeding expectations',
      'Battery performance optimal',
      'Grid connection stable',
      'Solar panel efficiency at 98%'
    ],
    warning: [
      'Wiring inspection recommended',
      'Battery charge cycles increasing',
      'Solar panel cleaning recommended',
      'Grid power fluctuations detected',
      'Energy consumption above average'
    ],
    critical: [
      'Battery temperature high',
      'Inverter malfunction detected',
      'Grid connection lost',
      'System overload detected',
      'Emergency shutdown initiated'
    ]
  };
  
  const alerts: Array<{ id: string; type: 'info' | 'warning' | 'critical'; message: string; timestamp: string }> = [];
  
  // Generate a few recent alerts
  alerts.push({
    id: '1',
    type: 'warning',
    message: alertMessages.warning[Math.floor(Math.random() * alertMessages.warning.length)],
    timestamp: subDays(today, 2).toISOString()
  });
  
  alerts.push({
    id: '2',
    type: 'info',
    message: alertMessages.info[Math.floor(Math.random() * alertMessages.info.length)],
    timestamp: subDays(today, 5).toISOString()
  });
  
  // Add a critical alert if it's been a while
  if (Math.random() > 0.7) {
    alerts.push({
      id: '3',
      type: 'critical',
      message: alertMessages.critical[Math.floor(Math.random() * alertMessages.critical.length)],
      timestamp: subDays(today, 1).toISOString()
    });
  }
  
  // Add another info alert
  alerts.push({
    id: '4',
    type: 'info',
    message: alertMessages.info[Math.floor(Math.random() * alertMessages.info.length)],
    timestamp: subDays(today, 3).toISOString()
  });
  
  return alerts;
};

// Calculate monthly and yearly production based on daily averages and seasonal factors
const calculateAggregateProduction = (): { today: number; thisMonth: number; thisYear: number } => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const daysInCurrentMonth = new Date(today.getFullYear(), currentMonth + 1, 0).getDate();
  
  // Today's production (already calculated in hourly data)
  const todayProduction = generateDailyProduction(today);
  
  // This month's production (average daily * days in month)
  let monthlyTotal = 0;
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const date = new Date(today.getFullYear(), currentMonth, day);
    if (date <= today) {
      monthlyTotal += generateDailyProduction(date);
    }
  }
  
  // This year's production (sum of monthly averages)
  let yearlyTotal = 0;
  for (let month = 0; month <= currentMonth; month++) {
    const daysInMonth = new Date(today.getFullYear(), month + 1, 0).getDate();
    const monthFactor = seasonalFactors[month as keyof typeof seasonalFactors];
    const monthlyAverage = 25 * monthFactor * daysInMonth; // 25 kWh baseline
    yearlyTotal += monthlyAverage;
  }
  
  return {
    today: Number(todayProduction.toFixed(1)),
    thisMonth: Number(monthlyTotal.toFixed(1)),
    thisYear: Number(yearlyTotal.toFixed(1))
  };
};

// Generate the complete mock energy data with synchronized components
export const generateMockEnergyData = (): EnergyData => {
  const today = new Date();
  const currentHour = today.getHours();
  const hourlyProduction = generateHourlyProduction();
  const dailyConsumption = generatePastWeekConsumption();
  const totalProduction = calculateAggregateProduction();
  
  // Current production based on time of day
  let currentProduction = 0;
  if (currentHour >= 6 && currentHour <= 19) {
    const hourData = hourlyProduction.find(h => h.hour === currentHour);
    currentProduction = hourData ? hourData.production : 0;
  }
  
  // Current consumption - typically lower than production during daylight hours
  // but follows a realistic pattern based on time of day
  let currentConsumption = 0;
  if (currentHour >= 6 && currentHour < 9) {
    // Morning peak (breakfast, getting ready)
    currentConsumption = 3.5 + (Math.random() * 0.5);
  } else if (currentHour >= 9 && currentHour < 17) {
    // Daytime (lower usage when people are at work/school)
    currentConsumption = 2.0 + (Math.random() * 0.5);
  } else if (currentHour >= 17 && currentHour < 22) {
    // Evening peak (dinner, TV, lights)
    currentConsumption = 4.0 + (Math.random() * 1.0);
  } else {
    // Night (minimal usage)
    currentConsumption = 1.0 + (Math.random() * 0.5);
  }
  
  // Calculate energy balance (production - consumption)
  const energyBalance = currentProduction - currentConsumption;
  
  // Battery status based on energy balance and time of day
  // Battery charges during excess production and discharges during deficit
  const timeBasedBatteryLevel = () => {
    // Battery typically starts charging in morning, peaks in afternoon, and discharges in evening/night
    if (currentHour >= 6 && currentHour < 10) {
      // Morning: Battery starts at moderate level and begins charging
      return 50 + (currentHour - 6) * 3;
    } else if (currentHour >= 10 && currentHour < 16) {
      // Midday: Battery charges to peak
      return 65 + (currentHour - 10) * 5;
    } else if (currentHour >= 16 && currentHour < 22) {
      // Evening: Battery gradually discharges
      return 90 - (currentHour - 16) * 4;
    } else {
      // Night: Battery continues to discharge slowly
      return 60 - (currentHour < 6 ? currentHour + 2 : (currentHour - 22) * 3);
    }
  };
  
  const baseBatteryLevel = timeBasedBatteryLevel();
  
  // Adjust battery level based on energy balance
  let batteryLevel = baseBatteryLevel;
  if (energyBalance > 0) {
    // Excess production charges battery
    batteryLevel = Math.min(100, baseBatteryLevel + (energyBalance * 2));
  } else if (energyBalance < 0) {
    // Production deficit discharges battery
    batteryLevel = Math.max(20, baseBatteryLevel + (energyBalance * 3));
  }
  
  // Round to whole number
  batteryLevel = Math.round(batteryLevel);
  
  // Determine grid status based on battery level and energy balance
  // Grid disconnects when battery is high and production exceeds consumption
  const gridStatus: 'connected' | 'disconnected' = 
    (batteryLevel > 80 && energyBalance > 0) ? 'disconnected' : 'connected';
  
  // Calculate solar vs grid usage percentages
  // When production exceeds consumption, we use 100% solar
  // Otherwise, we use as much solar as available and supplement with grid
  let solarPercentage = 0;
  if (currentConsumption > 0) {
    solarPercentage = Math.min(100, (currentProduction / currentConsumption) * 100);
  }
  
  // Adjust solar percentage based on battery level when production is low
  if (currentProduction < currentConsumption && batteryLevel > 30) {
    // Use battery to supplement solar during production deficit
    const batteryContribution = Math.min(
      currentConsumption - currentProduction,
      (batteryLevel - 30) / 100 * 2 // Battery can contribute up to 2kW depending on level
    );
    solarPercentage = Math.min(100, ((currentProduction + batteryContribution) / currentConsumption) * 100);
  }
  
  // Round to whole number
  solarPercentage = Math.round(solarPercentage);
  
  // System health based on battery level and grid status
  const systemHealth = {
    panels: 'good' as const,
    inverter: 'good' as const,
    battery: batteryLevel < 30 ? 'warning' as const : 'good' as const,
    wiring: gridStatus === 'disconnected' ? 'good' as const : 
            (Math.random() > 0.9 ? 'warning' as const : 'good' as const)
  };
  
  // Generate alerts based on system status
  const alerts = generateAlerts();
  
  // Add specific alerts based on current system state
  if (batteryLevel < 30) {
    alerts.unshift({
      id: 'low-battery',
      type: 'warning',
      message: 'Battery level below 30%, consider reducing consumption',
      timestamp: new Date().toISOString()
    });
  }
  
  if (gridStatus === 'disconnected') {
    alerts.unshift({
      id: 'grid-disconnected',
      type: 'info',
      message: 'System running on solar + battery power (grid disconnected)',
      timestamp: new Date().toISOString()
    });
  }
  
  // Calculate charge rate based on energy balance
  const chargeRate = energyBalance > 0 ? Number(energyBalance.toFixed(1)) : 0;
  
  // Calculate backup hours based on battery level and current consumption
  const backupHours = currentConsumption > 0 
    ? Number(((batteryLevel / 100) * 10 * (batteryLevel / 100)).toFixed(1)) // Non-linear relationship
    : 0;
  
  return {
    currentProduction: Number(currentProduction.toFixed(1)),
    totalProduction,
  batteryStatus: {
      level: batteryLevel,
      backupHours,
      chargeRate,
      cycleCount: 127 + Math.floor(Math.random() * 5),
      health: 94 - Math.floor(Math.random() * 3)
    },
    gridStatus,
  consumption: {
      current: Number(currentConsumption.toFixed(1)),
    breakdown: {
      appliances: 40,
      hvac: 30,
      lights: 15,
      other: 15
    },
    comparison: {
        solar: solarPercentage,
        grid: 100 - solarPercentage
      }
    },
    systemHealth,
    alerts,
    hourlyProduction,
    dailyConsumption,
    weatherImpact: {
      sunlightHours: 7 + Math.random() * 3,
      cloudCover: Math.floor(Math.random() * 30),
      temperature: 22 + Math.floor(Math.random() * 6)
    }
  };
};

// Initial mock data
export const mockEnergyData: EnergyData = generateMockEnergyData();

// Function to simulate real-time data updates with synchronized components
export function getUpdatedData(): EnergyData {
  // Generate completely new synchronized data
  // This ensures all components remain in sync during updates
  const newData = generateMockEnergyData();
  
  // Blend with existing data for smoother transitions
  const data = { ...mockEnergyData };
  
  // Update production and consumption with small variations
  data.currentProduction = Number((
    data.currentProduction * 0.8 + newData.currentProduction * 0.2
  ).toFixed(1));
  
  data.consumption.current = Number((
    data.consumption.current * 0.8 + newData.consumption.current * 0.2
  ).toFixed(1));
  
  // Calculate energy balance
  const energyBalance = data.currentProduction - data.consumption.current;
  
  // Update battery based on energy balance
  if (energyBalance > 0) {
    // Charging
    data.batteryStatus.level = Math.min(100, 
      data.batteryStatus.level + (energyBalance * 0.5)
    );
    data.batteryStatus.chargeRate = Number(energyBalance.toFixed(1));
  } else {
    // Discharging
    data.batteryStatus.level = Math.max(20, 
      data.batteryStatus.level + energyBalance
    );
    data.batteryStatus.chargeRate = 0;
  }
  
  // Round battery level
  data.batteryStatus.level = Math.round(data.batteryStatus.level);
  
  // Update backup hours based on battery level and consumption
  data.batteryStatus.backupHours = data.consumption.current > 0 
    ? Number(((data.batteryStatus.level / 100) * 10 * (data.batteryStatus.level / 100)).toFixed(1))
    : 0;
  
  // Update grid status based on battery level and energy balance
  if (data.batteryStatus.level > 80 && energyBalance > 0) {
    data.gridStatus = 'disconnected';
  } else if (data.batteryStatus.level < 30 || energyBalance < -1) {
    data.gridStatus = 'connected';
  }
  
  // Update solar vs grid percentages
  if (data.consumption.current > 0) {
    const solarContribution = Math.min(data.consumption.current, data.currentProduction);
    const solarPercentage = Math.round((solarContribution / data.consumption.current) * 100);
    
    data.consumption.comparison.solar = solarPercentage;
    data.consumption.comparison.grid = 100 - solarPercentage;
  }
  
  // Update system health based on current status
  data.systemHealth.battery = data.batteryStatus.level < 30 ? 'warning' : 'good';
  
  return data;
}

// Function to generate historical data for any date range
export function generateHistoricalData(startDate: Date, endDate: Date): Array<{
  date: string;
  production: number;
  consumption: number;
  batteryLevel: number;
  gridUsage: number;
}> {
  const result = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const production = generateDailyProduction(currentDate);
    const consumption = generateDailyConsumption(currentDate);
    const batteryLevel = 50 + Math.floor(Math.random() * 40);
    const gridUsage = Math.max(0, consumption - (production * 0.9));
    
    result.push({
      date: format(currentDate, 'yyyy-MM-dd'),
      production,
      consumption,
      batteryLevel,
      gridUsage: Number(gridUsage.toFixed(1))
    });
    
    currentDate = addDays(currentDate, 1);
  }
  
  return result;
} 