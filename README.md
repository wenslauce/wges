# W. Giertsen Energy Solutions Dashboard - Kenya & Norway

A sophisticated, real-time dashboard for monitoring solar energy production, battery storage, and energy consumption across international operations. Built with Next.js, TypeScript, Tailwind CSS, Shadcn UI, and Framer Motion.

![W. Giertsen Energy Dashboard](https://via.placeholder.com/1200x600/0A2540/FFFFFF?text=W.+Giertsen+Energy+Solutions+-+Kenya+%26+Norway)

## Overview

This dashboard provides a comprehensive monitoring solution for W. Giertsen Energy Solutions' solar installations in Kenya and Norway. It offers real-time data visualization, system health monitoring, and detailed analytics to optimize energy management and ensure system reliability.

## Features

### Core Functionality

- **Real-Time Energy Production Monitoring**
  - Current solar generation (kW) with time-of-day awareness
  - Daily/monthly/yearly production totals with seasonal adjustments
  - Hourly production chart with weather impact analysis

- **Battery Storage Status**
  - Dynamic charge level with visual indicators
  - Estimated backup hours based on current consumption
  - Real-time charge/discharge rate monitoring
  - Battery health and cycle count tracking

- **Energy Consumption Analytics**
  - Current usage with breakdown visualization
  - Detailed categorization (appliances, HVAC, lights, etc.)
  - Solar vs. grid usage comparison with cost analysis
  - Multi-currency support (USD, KES, EUR, NOK)

- **System Health Monitoring**
  - Component status (panels, inverter, battery, wiring)
  - Predictive maintenance alerts
  - Critical system notifications
  - Historical performance tracking

- **Grid Connection Status**
  - Dynamic connection indicator
  - Import/export status with real-time metrics
  - Intelligent power flow visualization
  - Grid disconnection detection

### User Experience

- **Modern UI/UX**
  - Responsive design for all device sizes
  - Dark/light mode support
  - Glassmorphism effects for depth and clarity
  - Smooth animations and transitions

- **Interactive Elements**
  - Real-time data updates
  - Interactive charts and graphs
  - Notification system with priority levels
  - User profile and settings management

- **System Simulation**
  - Sophisticated loading sequence
  - Realistic data generation based on time and season
  - Synchronized component interactions
  - Weather impact simulation

## Tech Stack

- **Frontend Framework**
  - [Next.js 14](https://nextjs.org/) with App Router
  - [React 18](https://reactjs.org/) with Server Components
  - [TypeScript](https://www.typescriptlang.org/) for type safety

- **Styling & UI**
  - [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
  - [Shadcn UI](https://ui.shadcn.com/) for accessible components
  - [Radix UI](https://www.radix-ui.com/) for headless primitives
  - [Framer Motion](https://www.framer.com/motion/) for animations

- **Data Visualization**
  - [Recharts](https://recharts.org/) for responsive charts
  - Custom visualization components
  - Real-time data processing

- **Utilities**
  - [date-fns](https://date-fns.org/) for date manipulation
  - [Lucide React](https://lucide.dev/) for iconography
  - Custom utility functions for data processing

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/wgiertsen/energy-dashboard.git
   cd energy-dashboard
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_DEFAULT_LOCATION=Nairobi,Kenya
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page with dashboard
├── components/
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── alerts-notifications.tsx
│   │   ├── battery-status.tsx
│   │   ├── dashboard-layout.tsx
│   │   ├── detailed-analytics.tsx
│   │   ├── energy-consumption.tsx
│   │   ├── energy-production.tsx
│   │   ├── grid-status.tsx
│   │   ├── header.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── remote-controls.tsx
│   │   ├── system-health.tsx
│   │   ├── user-settings.tsx
│   │   └── weather-forecast.tsx
│   └── ui/                 # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── glass-card.tsx
│       ├── progress.tsx
│       ├── skeleton.tsx
│       └── tabs.tsx
└── lib/                    # Utility functions and data
    ├── data.ts             # Data generation and processing
    ├── location-service.ts # Location detection and management
    ├── utils.ts            # General utilities
    └── weather-service.ts  # Weather data fetching and processing
```

## Key Features Implementation

### Dynamic Data Generation

The system uses sophisticated algorithms to generate realistic energy data based on:
- Time of day (solar production peaks at midday)
- Season of year (accounting for weather patterns)
- Geographic location (Kenya vs. Norway)
- Historical trends and patterns

### Component Synchronization

All dashboard components are synchronized to provide a coherent view of the energy system:
- Battery charges when production exceeds consumption
- Grid status changes based on battery level and energy balance
- Alerts are generated based on system conditions
- Weather impacts solar production calculations

### Multi-Currency Support

The dashboard supports multiple currencies for financial calculations:
- USD (US Dollar)
- KES (Kenyan Shilling)
- EUR (Euro)
- NOK (Norwegian Krone)

Exchange rates are updated regularly to provide accurate cost analysis.

## Deployment

### Production Build

```bash
npm run build
# or
yarn build
```

### Deployment Platforms

The dashboard can be deployed to:
- [Vercel](https://vercel.com/) (recommended)
- [Netlify](https://www.netlify.com/)
- Any platform supporting Next.js applications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [W. Giertsen Energy Solutions](https://www.giertsen.no/) for the project requirements and collaboration
- [Shadcn UI](https://ui.shadcn.com/) for the component library
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Framer Motion](https://www.framer.com/motion/) for the animations
- [Recharts](https://recharts.org/) for the charting library

## Contact

W. Giertsen Energy Solutions - [info@giertsen.no](mailto:info@giertsen.no)

Project Link: [https://github.com/wgiertsen/energy-dashboard](https://github.com/wgiertsen/energy-dashboard)
