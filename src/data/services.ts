// Six homepage service cards. Icon paths are drawn on a 24x24 grid (stroke icons).
export interface Service {
  title: string;
  text: string;
  bg: string;
  icon: string;
  href: string;
}

const lavender = '#C9C6F2';

export const services: Service[] = [
  {
    title: 'Guided Yoga',
    text: 'Mindful movement for every body, from first-timers to experienced yogis. Each asana explained clearly and patiently.',
    bg: lavender,
    icon: 'M12 5.5a2 2 0 1 0 0-.01M4 12c3-1 5-2 8-2s5 1 8 2M12 10v5M7 21c1.2-3 3-5.2 5-6 2 .8 3.8 3 5 6',
    href: '/yoga/guided-yoga/',
  },
  {
    title: 'Meditation & Breathwork',
    text: 'Simple, guided techniques to quiet a busy mind and steady the breath, easy to carry into your day.',
    bg: '#DCE3CF',
    icon: 'M12 3c2 3 2 6 0 9-2-3-2-6 0-9zM12 12c3-2 6-2 9 0-3 2-6 2-9 0zM12 12c-3-2-6-2-9 0 3 2 6 2 9 0zM6 20h12',
    href: '/healing/meditation/',
  },
  {
    title: 'Sound Healing',
    text: 'Deep, resonant sound to soften tension and invite rest. A restorative reset for body and nervous system.',
    bg: '#EAD9C6',
    icon: 'M3 12h2M7 8v8M11 5v14M15 8v8M19 10.5v3',
    href: '/healing/sound-healing/',
  },
  {
    title: 'Hormonal Balance',
    text: 'Gentle sequences and breath practices that support your cycle, energy and mood through every season of life.',
    bg: '#E8D5D2',
    icon: 'M12 20c-4-3-7-6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 4-3 7-7 10z',
    href: '/programs/hormonal-balance/',
  },
  {
    title: 'Stress & Anxiety Relief',
    text: 'Slow, grounding practice for busy minds and long workdays. Leave lighter than you arrived.',
    bg: '#D6DDE6',
    icon: 'M4 15c2-2 4-2 6 0s4 2 6 0 3-2 4-1M4 10c2-2 4-2 6 0s4 2 6 0 3-2 4-1',
    href: '/programs/stress-management/',
  },
  {
    title: 'Prenatal Yoga (1:1)',
    text: 'Private, customised sessions for each trimester, focused on comfort, breath and a calm connection with your baby.',
    bg: lavender,
    icon: 'M12 4a2 2 0 1 0 0 .01M12 7c-2 0-3 2-3 4v3c0 2 1 3 3 3 3 0 5-2 5-4.5S15 9 13 9M10 17l-1 4M14 17l1 4',
    href: '/yoga/prenatal/',
  },
];
