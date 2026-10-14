export interface Review {
  quote: string;
  url: string;
}

export const reviews: Review[] = [
  {
    quote: 'Best experience for yoga and meditation.',
    url: 'https://www.google.com/maps/reviews/data=!4m5!14m4!1m3!1m2!1s113911238299045752344!2s0x3bc2bbe6bd0ef505:0x3cc189f4034a5c78',
  },
  {
    quote: 'The personal touch, relaxing and meditative techniques all easy to follow.',
    url: 'https://www.google.com/maps/reviews/data=!4m5!14m4!1m3!1m2!1s115820355545531327042!2s0x3bc2bbe6bd0ef505:0x3cc189f4034a5c78',
  },
  {
    quote: 'Her guidance is excellent, and she explains each asana so clearly and patiently.',
    url: 'https://www.google.com/maps/reviews/data=!4m5!14m4!1m3!1m2!1s112484432517251557391!2s0x3bc2bbe6bd0ef505:0x3cc189f4034a5c78',
  },
];

export const rating = { value: '5.0', count: reviews.length };
