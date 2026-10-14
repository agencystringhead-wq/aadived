// Detailed copy for the service pages (/yoga/*, /healing/*, /programs/*).
// Facts only: from the homepage copy, src/data/site.ts and design-source/content/details.txt.
// A route listed in stubPages (site.ts) but missing here falls back to the "coming soon" stub.
import type { ImageMetadata } from 'astro';
import soundHealingImg from '../assets/images/stock/service-sound-healing.webp';

export type Category = 'Yoga' | 'Mind & Sound' | 'Wellness Programs';
export type Format = 'studio' | 'online' | 'one-on-one';

export const formatLabels: Record<Format, string> = {
  studio: 'Studio, Hinjawadi',
  online: 'Live online',
  'one-on-one': 'One-on-one',
};

export interface Tile {
  title: string;
  text: string;
}

export interface Practice {
  slug: string; // matches the route, e.g. 'healing/sound-healing'
  category: Category;
  tagline: string;
  intro: string;
  image: ImageMetadata;
  imageAlt: string;
  what: string[]; // short paragraphs; the first renders as a large lead
  who: Tile[]; // 4 tiles
  steps: Tile[]; // 3 steps
  help: Tile[]; // 4 tiles
  formats: Format[]; // only the ways to join that apply
  faqs: { q: string; a: string }[];
  reviewIndex: number; // index into src/data/reviews.ts
  related: string[]; // slugs
  prenatalNote?: boolean;
}

export const practices: Practice[] = [
  {
    slug: 'healing/sound-healing',
    category: 'Mind & Sound',
    tagline: 'Deep, resonant sound to soften tension and invite rest.',
    intro:
      'Deep, resonant sound to soften tension and invite rest. A restorative reset for body and nervous system, held in a quiet, grounded space at Megapolis Serenity.',
    image: soundHealingImg,
    imageAlt: 'A small bronze singing bowl with a wooden mallet resting in it, on a stone block against a pale wall',
    what: [
      'Sound healing is a listening practice. Resonant sound fills the room while you rest, and your only task is to receive it.',
      'At AadiVed it sits alongside yoga, breathwork and meditation, so the calm you find in the room has a way to travel home with you.',
    ],
    who: [
      { title: 'Busy minds and long workdays', text: 'If your head is still at your desk when you get home, a session gives your attention somewhere gentle to land.' },
      { title: 'First-timers', text: 'There is nothing to perform and nothing to get right. You do not need any experience to begin.' },
      { title: 'Regular yoga practitioners', text: 'A restful counterpart to an active practice, for the days you want to receive more than you do.' },
      { title: 'Anyone rebuilding balance', text: 'For the stretch after a big life change, when slowing down is the hardest and most useful thing to do.' },
    ],
    // TODO: confirm the session flow with Anupriya
    steps: [
      { title: 'Arrive and settle', text: 'You are welcomed, shown where to rest and told what to expect. Take your time to land.' },
      { title: 'Listen', text: 'Sound fills the room. Rest, breathe and let your attention follow it wherever it goes.' },
      { title: 'Rest and return', text: 'Come back slowly, with a few quiet minutes before you step out into your day.' },
    ],
    help: [
      { title: 'Soften tension', text: 'Slow, steady sound gives the body a reason to let go of what it has been holding.' },
      { title: 'Invite rest', text: 'A calm, supported way to rest when your mind will not switch off on its own.' },
      { title: 'Reset body and nervous system', text: 'A restorative pause that supports your body in settling after a demanding stretch.' },
      { title: 'Carry calm into your day', text: 'Pair it with breathwork or meditation so the stillness follows you off the mat.' },
    ],
    formats: ['studio'],
    faqs: [
      { q: 'Do I need any experience?', a: 'No. Sound healing asks nothing of you except to listen and rest, and the studio welcomes beginners to experienced practitioners.' },
      { q: 'Where does it take place?', a: 'In the studio at Megapolis Serenity, Rajiv Gandhi Infotech Park, Hinjawadi Phase 3, Pune.' },
      { q: 'When are sessions?', a: 'Classes run Monday to Friday, 8:00 am to 10:00 am. Ask us which sessions include sound healing, or call to check before you come.' },
      { q: 'How do I start?', a: 'Call, message us on Instagram or book a session. If you are new, we suggest starting with a 1:1 intro session.' },
      { q: 'What does it cost?', a: '[Price] Plans and pricing will be listed on the Plans & Pricing page.' },
    ],
    reviewIndex: 0,
    related: ['healing/meditation', 'healing/breathwork', 'programs/stress-management'],
  },
];

export function getPractice(slug: string): Practice | undefined {
  return practices.find((p) => p.slug === slug);
}
