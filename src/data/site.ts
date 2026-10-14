// Single source of truth for business details, navigation and the route registry.
// Components must read from here and never hard-code phone numbers, addresses or links.

export const site = {
  name: 'AadiVed Yoga and Wellness',
  shortName: 'AadiVed',
  tagline: 'Mind. Body. Soul',
  url: 'https://aadived.com', // TODO: confirm final domain before launch
  locale: 'en-IN',
  description:
    'Guided yoga, meditation and sound healing in Hinjawadi Phase 3, Pune. A women-owned studio led by a 500-hour Yoga Alliance registered practitioner. Studio and online sessions.',
  phone: { display: '+91 82084 69389', tel: '+918208469389', schema: '+91-82084-69389' },
  address: {
    short: 'Megapolis Serenity, Hinjawadi Phase 3, Pune',
    lines: ['Megapolis Serenity, Phase 3', 'Rajiv Gandhi Infotech Park', 'Hinjawadi, Pune 411057'],
    street: 'Megapolis Serenity, Phase 3, Rajiv Gandhi Infotech Park',
    locality: 'Hinjawadi, Pune',
    region: 'Maharashtra',
    postalCode: '411057',
    country: 'IN',
  },
  instagram: {
    handle: '@aadivedwellness',
    url: 'https://www.instagram.com/aadivedwellness/',
    dm: 'https://ig.me/m/aadivedwellness',
  },
  google: {
    profile: 'https://maps.google.com/?cid=4377931993901063288',
    reviews: 'https://maps.google.com/?cid=4377931993901063288',
    directions:
      'https://www.google.com/maps/dir/?api=1&destination=AADIVED+YOGA+AND+WELLNESS+Megapolis+Serenity+Hinjawadi+Phase+3+Pune',
    // Loaded only after the visitor clicks "Load map"
    embed:
      'https://maps.google.com/maps?q=AADIVED+YOGA+AND+WELLNESS+Megapolis+Serenity+Hinjawadi+Phase+3+Pune+411057&z=16&output=embed',
    // TODO: swap for the direct write-a-review link (needs the Google place ID). Opens the profile for now.
    writeReview: 'https://maps.google.com/?cid=4377931993901063288',
  },
  // TODO: confirm the number is on WhatsApp before launch
  whatsapp: 'https://wa.me/918208469389',
  founder: 'Anupriya',
  timings: {
    days: 'Monday to Friday',
    daysShort: 'Mon to Fri',
    time: '8:00 am to 10:00 am',
    // For schema.org openingHoursSpecification (24-hour clock)
    schema: { dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '10:00' },
  },
  bookHref: '/contact/#book',
  // TODO: replace with the real newsletter form provider (JotForm or Cloudflare Worker)
  newsletterAction: '#',
  // TODO: paste the form provider URL here (Formspree, Getform, a Cloudflare Worker, etc.).
  // The enquiry form on /contact/ POSTs its fields to this URL. While it is empty the form tells visitors
  // to call or message on Instagram instead of showing a false success message.
  enquiryAction: '',
} as const;

export interface NavLink {
  label: string;
  href: string;
  emphasis?: boolean;
}
export interface NavColumn {
  heading: string;
  icon: string;
  links: NavLink[];
}

export const aboutLinks: NavLink[] = [
  { label: 'Our Story & the Name', href: '/about/' },
  { label: 'Meet Anupriya', href: '/about/anupriya/' },
  { label: 'Credentials (500-hr RYT)', href: '/about/anupriya/' },
  { label: 'The Studio', href: '/studio/' },
];

export const aboutQuote =
  '“Aadi” means beginning. “Ved” means knowledge. A return to the roots of wellbeing.';

export const megaMenu: NavColumn[] = [
  {
    heading: 'Yoga',
    icon: 'yoga',
    links: [
      { label: 'Guided Yoga', href: '/yoga/guided-yoga/' },
      { label: 'Yoga for Beginners', href: '/yoga/beginners/' },
      { label: 'Experienced Practitioners', href: '/yoga/experienced/' },
      { label: 'Prenatal Yoga (1:1)', href: '/yoga/prenatal/' },
      { label: 'Private Sessions', href: '/yoga/private-sessions/' },
    ],
  },
  {
    heading: 'Mind & Sound',
    icon: 'sound',
    links: [
      { label: 'Meditation', href: '/healing/meditation/' },
      { label: 'Breathwork', href: '/healing/breathwork/' },
      { label: 'Sound Healing', href: '/healing/sound-healing/' },
      { label: 'Grounding Practices', href: '/healing/grounding/' },
    ],
  },
  {
    heading: 'Wellness Programs',
    icon: 'heart',
    links: [
      { label: 'Hormonal Balance', href: '/programs/hormonal-balance/' },
      { label: 'Stress Management', href: '/programs/stress-management/' },
      { label: 'Anxiety Relief', href: '/programs/anxiety-relief/' },
      { label: 'Energy Reset', href: '/programs/energy-reset/' },
      { label: 'Build a Daily Practice', href: '/programs/daily-practice/' },
    ],
  },
  {
    heading: 'Ways to Join',
    icon: 'screen',
    links: [
      { label: 'Studio Sessions, Hinjawadi', href: '/studio/' },
      { label: 'Live Online Sessions', href: '/online-classes/' },
      { label: 'One-on-One Coaching', href: '/one-on-one/' },
      { label: 'Plans & Pricing', href: '/pricing/' },
      { label: 'All classes →', href: '/classes/', emphasis: true },
    ],
  },
];

export const megaFeature = {
  eyebrow: 'New here?',
  text: 'Start with a 1:1 intro session →',
  href: '/one-on-one/',
};

export const mainNav: NavLink[] = [
  { label: 'Online Classes', href: '/online-classes/' },
  { label: 'Reviews', href: '/reviews/' },
  { label: 'Journal', href: '/journal/' },
  { label: 'Contact', href: '/contact/' },
];

export const footerColumns: Record<'yoga' | 'healing' | 'studio', NavLink[]> = {
  yoga: megaMenu[0].links,
  healing: [
    { label: 'Meditation', href: '/healing/meditation/' },
    { label: 'Breathwork', href: '/healing/breathwork/' },
    { label: 'Sound Healing', href: '/healing/sound-healing/' },
    { label: 'Hormonal Balance', href: '/programs/hormonal-balance/' },
    { label: 'Stress & Anxiety Relief', href: '/programs/stress-management/' },
  ],
  studio: [
    { label: 'Our Story', href: '/about/' },
    { label: 'Meet Anupriya', href: '/about/anupriya/' },
    { label: 'Online Classes', href: '/online-classes/' },
    { label: 'Plans & Pricing', href: '/pricing/' },
    { label: 'Reviews', href: '/reviews/' },
    { label: 'Journal', href: '/journal/' },
    { label: 'Contact', href: '/contact/' },
  ],
};

export const legalLinks: NavLink[] = [
  { label: 'Privacy', href: '/privacy/' },
  { label: 'Terms', href: '/terms/' },
  { label: 'Sitemap', href: '/sitemap-index.xml' },
];

// Route registry for every stub page (section 7). Rendered by src/pages/[...slug].astro.
export interface StubPage {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  parent?: { label: string; href: string };
  showTimings?: boolean;
}

const about = { label: 'About', href: '/about/' };
const classes = { label: 'All classes', href: '/classes/' };

export const stubPages: StubPage[] = [
  { slug: 'about', title: 'Our Story & the Name', eyebrow: 'About AadiVed', intro: '“Aadi” means beginning. “Ved” means knowledge. A return to the roots of wellbeing.' },
  { slug: 'about/anupriya', title: 'Meet Anupriya', eyebrow: 'Your teacher', intro: 'Founder of AadiVed and a 500-hour Yoga Alliance Registered Practitioner.', parent: about },
  { slug: 'yoga/guided-yoga', title: 'Guided Yoga', eyebrow: 'Yoga', intro: 'Mindful movement for every body, from first-timers to experienced yogis.', parent: classes },
  { slug: 'yoga/beginners', title: 'Yoga for Beginners', eyebrow: 'Yoga', intro: 'A gentle place to begin, with each asana explained clearly and patiently.', parent: classes },
  { slug: 'yoga/experienced', title: 'Experienced Practitioners', eyebrow: 'Yoga', intro: 'Guided practice for those who already have a regular mat.', parent: classes },
  { slug: 'yoga/prenatal', title: 'Prenatal Yoga (1:1)', eyebrow: 'Yoga', intro: 'Private, customised sessions for each trimester, focused on comfort, breath and a calm connection with your baby.', parent: classes },
  { slug: 'yoga/private-sessions', title: 'Private Sessions', eyebrow: 'Yoga', intro: 'One-on-one practice shaped around your body, goals and schedule.', parent: classes },
  { slug: 'healing/meditation', title: 'Meditation', eyebrow: 'Mind & Sound', intro: 'Simple, guided techniques to quiet a busy mind.', parent: classes },
  { slug: 'healing/breathwork', title: 'Breathwork', eyebrow: 'Mind & Sound', intro: 'Guided breath practices to steady the mind and body.', parent: classes },
  { slug: 'healing/sound-healing', title: 'Sound Healing', eyebrow: 'Mind & Sound', intro: 'Deep, resonant sound to soften tension and invite rest.', parent: classes },
  { slug: 'healing/grounding', title: 'Grounding Practices', eyebrow: 'Mind & Sound', intro: 'Slow, steady practices that bring you back into the body.', parent: classes },
  { slug: 'programs/hormonal-balance', title: 'Hormonal Balance', eyebrow: 'Wellness Programs', intro: 'Gentle sequences and breath practices that support your cycle, energy and mood.', parent: classes },
  { slug: 'programs/stress-management', title: 'Stress Management', eyebrow: 'Wellness Programs', intro: 'Slow, grounding practice for busy minds and long workdays.', parent: classes },
  { slug: 'programs/anxiety-relief', title: 'Anxiety Relief', eyebrow: 'Wellness Programs', intro: 'Calming practice to help you leave lighter than you arrived.', parent: classes },
  { slug: 'programs/energy-reset', title: 'Energy Reset', eyebrow: 'Wellness Programs', intro: 'A restorative reset for body and nervous system.', parent: classes },
  { slug: 'programs/daily-practice', title: 'Build a Daily Practice', eyebrow: 'Wellness Programs', intro: 'Breath, movement and stillness you can return to every day.', parent: classes },
  { slug: 'studio', title: 'The Studio', eyebrow: 'Hinjawadi Phase 3', intro: 'Small, unhurried classes at Megapolis Serenity in Hinjawadi Phase 3.', showTimings: true },
  { slug: 'online-classes', title: 'Online Classes', eyebrow: 'Live online sessions', intro: 'The same guided practice, wherever you are.' },
  { slug: 'one-on-one', title: 'One-on-One Coaching', eyebrow: 'Private care', intro: 'Sessions shaped around you, including 1:1 prenatal care.' },
  // TODO: add real plans and pricing once confirmed (placeholder [Price])
  { slug: 'pricing', title: 'Plans & Pricing', eyebrow: 'Join us', intro: '[Price] Plans and pricing will be shared here soon.' },
  { slug: 'classes', title: 'All Classes', eyebrow: 'Classes & healing', intro: 'Every way we practise together, in the studio and online.' },
  { slug: 'reviews', title: 'Reviews', eyebrow: 'Kind words', intro: 'What our students say about AadiVed on Google.' },
  { slug: 'journal', title: 'Journal', eyebrow: 'Notes & practices', intro: 'Simple practices and notes from the studio.' },
  { slug: 'contact', title: 'Contact', eyebrow: 'Say hello', intro: 'Call, send a message, or book a session. We usually reply within the day.', showTimings: true },
  { slug: 'privacy', title: 'Privacy Policy', eyebrow: 'Legal', intro: 'How AadiVed handles your information.' },
  { slug: 'terms', title: 'Terms', eyebrow: 'Legal', intro: 'The terms for using this website and our services.' },
];
