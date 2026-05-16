// Activity templates for quick entry
export const ACTIVITY_TEMPLATES = [
  {
    id: 'walking',
    name: 'Walking',
    icon: '🚶',
    description: '30 minutes walk',
    steps: 3000,
    distance: 2.5,
    exerciseTime: 30,
    calories: 150,
  },
  {
    id: 'running',
    name: 'Running',
    icon: '🏃',
    description: '30 minutes run',
    steps: 5000,
    distance: 5.0,
    exerciseTime: 30,
    calories: 300,
  },
  {
    id: 'cycling',
    name: 'Cycling',
    icon: '🚴',
    description: '45 minutes cycling',
    steps: 0,
    distance: 15.0,
    exerciseTime: 45,
    calories: 400,
  },
  {
    id: 'gym',
    name: 'Gym Workout',
    icon: '💪',
    description: '60 minutes gym session',
    steps: 2000,
    distance: 0,
    exerciseTime: 60,
    calories: 500,
  },
  {
    id: 'swimming',
    name: 'Swimming',
    icon: '🏊',
    description: '30 minutes swimming',
    steps: 0,
    distance: 0.8, // Swimming distance in km (pools)
    exerciseTime: 30,
    calories: 350,
  },
  {
    id: 'yoga',
    name: 'Yoga',
    icon: '🧘',
    description: '45 minutes yoga',
    steps: 0, // Yoga doesn't typically involve steps
    distance: 0, // Yoga is stationary
    exerciseTime: 45,
    calories: 200,
  },
];

// Quick entry presets
export const QUICK_PRESETS = [
  {
    name: 'Light Activity',
    steps: 5000,
    distance: 3.0,
    exerciseTime: 30,
    calories: 200,
  },
  {
    name: 'Moderate Activity',
    steps: 8000,
    distance: 5.0,
    exerciseTime: 45,
    calories: 350,
  },
  {
    name: 'Intense Activity',
    steps: 12000,
    distance: 8.0,
    exerciseTime: 60,
    calories: 500,
  },
];

