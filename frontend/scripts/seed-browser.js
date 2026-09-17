const today = new Date();
const y = today.getFullYear();
const mo = String(today.getMonth() + 1).padStart(2, '0');

// Generate workouts for this month and last month
const workouts = [];
const daysWithWorkouts = [2, 4, 7, 9, 11, 14, 16, 18, 21, 23, 25, 28];
daysWithWorkouts.forEach((d, idx) => {
  const dayStr = String(d).padStart(2, '0');
  workouts.push({
    id: 'w-test-' + idx,
    d: y + '-' + mo + '-' + dayStr,
    start: Date.now() - (30 - d) * 86400000,
    end: Date.now() - (30 - d) * 86400000 + 3600000,
    name: idx % 2 === 0 ? 'Upper Body Push' : 'Lower Body Strength',
    vol: 8500 + idx * 400,
    entries: [
      {
        id: '0025',
        n: 'barbell bench press',
        sets: [{ done: true, w: 80, r: 8 }, { done: true, w: 85, r: 6 }]
      },
      {
        id: '0047',
        n: 'barbell incline bench press',
        sets: [{ done: true, w: 70, r: 8 }]
      }
    ]
  });
});

const prevMo = String(today.getMonth() === 0 ? 12 : today.getMonth()).padStart(2, '0');
const prevY = today.getMonth() === 0 ? y - 1 : y;
[3, 6, 10, 13, 17, 20, 24, 27].forEach((d, idx) => {
  const dayStr = String(d).padStart(2, '0');
  workouts.push({
    id: 'w-prev-' + idx,
    d: prevY + '-' + prevMo + '-' + dayStr,
    start: Date.now() - (60 - d) * 86400000,
    end: Date.now() - (60 - d) * 86400000 + 3400000,
    name: 'Full Body Power',
    vol: 7800,
    entries: [{ id: '0025', n: 'bench press', sets: [{ done: true, w: 75, r: 10 }] }]
  });
});

const st = {
  unit: 'kg',
  theme: 'dark',
  accent: 'pink',
  onboardingDone: true,
  workouts: workouts,
  routines: [
    { id: 'r1', name: 'Push Day', emoji: 'arm', ex: [{ id: '0025' }] }
  ],
  bodyweight: [
    { d: y + '-' + mo + '-01', w: 78.5 },
    { d: y + '-' + mo + '-15', w: 77.8 }
  ]
};

localStorage.setItem('gym_guest', '1');
localStorage.setItem('gym_state_v1', JSON.stringify(st));
location.reload();
