// Detailed copy for the service pages (/yoga/*, /healing/*, /programs/*).
// Facts only: from the homepage copy, src/data/site.ts and design-source/content/details.txt.
// A route listed in stubPages (site.ts) but missing here falls back to the "coming soon" stub.
//
// Ways to join: studio by default; online for guided practices (details.txt lists online and offline
// sessions); Prenatal is 1:1 only; Sound Healing is studio only.
// TODO: confirm with Anupriya which practices run online and which session steps match her real flow.
import type { ImageMetadata } from 'astro';
import { site } from './site';
import soundHealingImg from '../assets/images/stock/service-sound-healing.webp';
import guidedYogaImg from '../assets/images/stock/service-guided-yoga.webp';
import beginnersImg from '../assets/images/stock/service-beginners.webp';
import experiencedImg from '../assets/images/stock/service-experienced.webp';
import prenatalImg from '../assets/images/stock/service-prenatal.webp';
import privateImg from '../assets/images/stock/service-private-sessions.webp';
import meditationImg from '../assets/images/stock/service-meditation.webp';
import breathworkImg from '../assets/images/stock/service-breathwork.webp';
import groundingImg from '../assets/images/stock/service-grounding.webp';
import hormonalImg from '../assets/images/stock/service-hormonal-balance.webp';
import stressImg from '../assets/images/stock/service-stress-management.webp';
import anxietyImg from '../assets/images/stock/service-anxiety-relief.webp';
import energyImg from '../assets/images/stock/service-energy-reset.webp';
import dailyImg from '../assets/images/aadived/beach-yoga-portrait.webp';

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
  careNote?: string;
}

/** Value used in the contact form dropdown and in ?interest=... */
export const interestId = (slug: string) => slug.split('/').pop() as string;

// Shared FAQ answers, so wording stays consistent where the facts are the same
const faq = {
  start: { q: 'How do I start?', a: 'Call, message us on Instagram or book a session. If you are new, we suggest starting with a 1:1 intro session.' },
  cost: { q: 'What does it cost?', a: `For current prices, please call ${site.phone.display}.` },
  when: (extra?: string) => ({
    q: 'When are sessions?',
    a: `${site.hours.label}. ${site.hours.note}${extra ? ' ' + extra : ''}`,
  }),
  where: { q: 'Where is the studio?', a: 'At Megapolis Serenity, Rajiv Gandhi Infotech Park, Hinjawadi Phase 3, Pune.' },
};

export const practices: Practice[] = [
  // ---------------------------------------------------------------- YOGA
  {
    slug: 'yoga/guided-yoga',
    category: 'Yoga',
    tagline: 'Mindful movement for every body, from first-timers to experienced yogis.',
    intro: 'Mindful movement for every body, from first-timers to experienced yogis. Each asana is explained clearly and patiently, so you always know what you are doing and why.',
    image: guidedYogaImg,
    imageAlt: 'A woman seen from behind, holding a low lunge on a grey-green mat beside the sea',
    what: [
      'Guided yoga is practice with a teacher beside you. Each pose is explained and each breath is cued, so you can settle into the movement without having to think ahead.',
      'Every class blends asana, breathwork and grounding practices, so the calm you find on the mat carries into the rest of your day.',
    ],
    who: [
      { title: 'First-timers', text: 'You do not need to know a single pose. Each asana is explained clearly and patiently from the start.' },
      { title: 'Returning practitioners', text: 'Pick up the thread again with a teacher who meets you where your body is today.' },
      { title: 'Experienced yogis', text: 'Keep a regular, guided practice and refine the details of poses you already know.' },
      { title: 'Busy lives', text: 'An unhurried session booked at a time that suits your day.' },
    ],
    steps: [
      { title: 'Arrive and settle', text: 'Find your place on the mat, take a few slower breaths and let the day fall a little quieter.' },
      { title: 'Move with guidance', text: 'Flow through asana with clear cues, in a pace that suits the people in the room.' },
      { title: 'Ground and close', text: 'Finish with breath and grounding practice, so you leave steadier than you arrived.' },
    ],
    help: [
      { title: 'Build body awareness', text: 'Clear instruction helps you notice how each pose feels in your own body.' },
      { title: 'Ease stress', text: 'Steady movement and breath support your body in letting go of tension.' },
      { title: 'Grow a regular practice', text: 'A guided class gives you a rhythm to return to, week after week.' },
      { title: 'Carry calm off the mat', text: 'Breath and grounding are part of every class, not an extra.' },
    ],
    formats: ['studio', 'online'],
    faqs: [
      { q: 'Do I need any experience?', a: 'No. Guided yoga welcomes beginners to experienced practitioners, and each asana is explained clearly.' },
      faq.when(),
      faq.where,
      faq.start,
      faq.cost,
    ],
    reviewIndex: 2,
    related: ['yoga/beginners', 'yoga/experienced', 'programs/daily-practice'],
  },
  {
    slug: 'yoga/beginners',
    category: 'Yoga',
    tagline: 'A gentle place to begin, with each asana explained clearly and patiently.',
    intro: 'A gentle place to begin. Each asana is explained clearly and patiently, and the practice is shaped around you, whether this is your first time on a mat or your first time back.',
    image: beginnersImg,
    imageAlt: 'A person seated cross-legged in a mudra, wearing a rose-coloured top and leggings by a softly lit window',
    what: [
      'Yoga for beginners starts from the beginning. There is no expectation that you can touch your toes, hold a pose or know any Sanskrit.',
      'Aadi means beginning, and that is the spirit here: unhurried, clear and kind to a body that is new to this.',
    ],
    who: [
      { title: 'Stepping onto a mat for the first time', text: 'Come as you are. Everything is explained as we go.' },
      { title: 'Anyone who feels stiff or unsure', text: 'The practice meets your body where it is today, not where you think it should be.' },
      { title: 'People starting again', text: 'Coming back after a long break, or after a big life change, is a good reason to begin gently.' },
      { title: 'Curious minds', text: 'If you are simply wondering what yoga is like, a first session is a calm way to find out.' },
    ],
    steps: [
      { title: 'Say hello', text: 'Tell us a little about what you would like to feel. We match the practice to your body and goals.' },
      { title: 'Learn the basics', text: 'Simple poses and breath, each explained clearly, at a pace that lets you follow.' },
      { title: 'Rest and notice', text: 'Close with stillness, and notice what has changed, even if it is small.' },
    ],
    help: [
      { title: 'Find your footing', text: 'Clear, patient instruction helps you feel at ease in your first classes.' },
      { title: 'Move with confidence', text: 'Learning poses step by step supports you in trusting your body.' },
      { title: 'Ease stress', text: 'Slow breath and gentle movement support a calmer mind.' },
      { title: 'Build the habit', text: 'A steady, welcoming start makes it easier to keep going.' },
    ],
    formats: ['studio', 'online'],
    faqs: [
      { q: 'I have never done yoga. Is that fine?', a: 'Yes. This practice is for exactly that. Every asana is explained clearly and patiently.' },
      { q: 'Do I need to be flexible?', a: 'No. Flexibility is something yoga builds over time, it is not a requirement to begin.' },
      faq.when(),
      faq.start,
      faq.cost,
    ],
    reviewIndex: 2,
    related: ['yoga/guided-yoga', 'yoga/private-sessions', 'healing/meditation'],
  },
  {
    slug: 'yoga/experienced',
    category: 'Yoga',
    tagline: 'Guided practice for those who already have a regular mat.',
    intro: 'Guided practice for those who already have a regular mat. Keep your practice alive with a teacher who explains each asana clearly and notices the details.',
    image: experiencedImg,
    imageAlt: 'A person seated on a dark mat with both legs raised and held straight up, in a bright room with sheer curtains',
    what: [
      'A regular practice can drift into habit. Guided sessions give you a fresh pair of eyes on poses you already know.',
      'Every class still blends asana, breathwork and grounding practices, so there is room to deepen the quiet parts as well as the strong ones.',
    ],
    who: [
      { title: 'Regular practitioners', text: 'You have a mat, a routine and a few favourite poses, and you want guidance that keeps it fresh.' },
      { title: 'Self-taught yogis', text: 'Have a teacher check your alignment and explain what you have been doing on your own.' },
      { title: 'Returning after a break', text: 'Rebuild with a teacher who can tell where to push and where to pause.' },
      { title: 'Students of breath', text: 'If you want to spend more time with breathwork and stillness, the format has room for it.' },
    ],
    steps: [
      { title: 'Arrive and centre', text: 'Settle the breath and set an intention for the session.' },
      { title: 'Practise with detail', text: 'Move through asana with clear cues and attention to how each pose is built.' },
      { title: 'Close in stillness', text: 'End with breath and grounding practice, and give the practice time to land.' },
    ],
    help: [
      { title: 'Refine your poses', text: 'Close attention helps you notice habits you cannot see alone.' },
      { title: 'Keep a steady rhythm', text: 'A fixed class supports a practice you can rely on, week after week.' },
      { title: 'Deepen breath and stillness', text: 'Breathwork and grounding sit alongside movement, not after it.' },
      { title: 'Stay curious', text: 'A teacher can offer new ways into familiar poses.' },
    ],
    formats: ['studio', 'online'],
    faqs: [
      { q: 'How do I know if this is the right level?', a: 'If you already practise regularly, this is for you. Tell us about your practice and we will match the session to it.' },
      faq.when(),
      faq.start,
      faq.cost,
    ],
    reviewIndex: 2,
    related: ['yoga/guided-yoga', 'yoga/private-sessions', 'healing/breathwork'],
  },
  {
    slug: 'yoga/prenatal',
    category: 'Yoga',
    tagline: 'Private, customised sessions for each trimester.',
    intro: 'Private, customised sessions for each trimester, focused on comfort, breath and a calm connection with your baby. One-on-one, shaped around you.',
    image: prenatalImg,
    imageAlt: 'A pregnant woman in a white shirt and pale trousers resting her hands on her belly',
    what: [
      'Prenatal yoga at AadiVed is one-on-one. Each session is private and customised to your trimester, your body and how you feel that day.',
      'The focus is on comfort, breath and a calm connection with your baby, in a practice that is gentle and unhurried.',
    ],
    who: [
      { title: 'Expecting mothers', text: 'Private sessions for each trimester, with attention to what your body needs now.' },
      { title: 'First pregnancies', text: 'A calm, clearly explained introduction to yoga, if you are new to it.' },
      { title: 'Existing practitioners', text: 'Keep a practice going while it adapts to your changing body.' },
      { title: 'Anyone wanting quiet time', text: 'An hour set aside, just for you and your baby.' },
    ],
    steps: [
      { title: 'Talk it through', text: 'Share how you are feeling and where you are in your pregnancy. The session is built around that.' },
      { title: 'Move gently', text: 'Comfortable movement and breath, adjusted as you go.' },
      { title: 'Rest and connect', text: 'Finish with quiet time and a calm connection with your baby.' },
    ],
    help: [
      { title: 'Support comfort', text: 'Gentle movement helps you find ease in a body that is changing.' },
      { title: 'Practise breath', text: 'Slow, steady breathing supports calm now and is easy to carry forward.' },
      { title: 'Make time to pause', text: 'A private session gives you space to slow down.' },
      { title: 'Feel looked after', text: 'One-on-one attention means nothing is rushed or generic.' },
    ],
    formats: ['one-on-one'],
    faqs: [
      { q: 'Is it private?', a: 'Yes. Prenatal yoga at AadiVed is one-on-one and customised for each trimester.' },
      { q: 'Do I need to speak to my doctor first?', a: 'Yes. Please consult your doctor before starting any prenatal practice, and tell us about anything they advise.' },
      faq.when('Prenatal sessions are one-on-one, so we agree a time around you.'),
      faq.start,
      faq.cost,
    ],
    reviewIndex: 1,
    related: ['yoga/private-sessions', 'healing/breathwork', 'programs/stress-management'],
    prenatalNote: true,
  },
  {
    slug: 'yoga/private-sessions',
    category: 'Yoga',
    tagline: 'One-on-one practice shaped around your body, goals and schedule.',
    intro: 'One-on-one practice shaped around your body, goals and schedule. All of the teacher’s attention, on you.',
    image: privateImg,
    imageAlt: 'A woman in a pale pink top pressing her palms together at her chest in a prayer position',
    what: [
      'A private session is yours alone. The practice is chosen for you, whether you want to learn the basics, work on stress or rebuild balance.',
      'It is also how many people begin: a 1:1 intro session is a calm way to find out what suits you before you join a group.',
    ],
    who: [
      { title: 'Newcomers who prefer one-to-one', text: 'Learn at your own pace, with no one else in the room.' },
      { title: 'Specific goals', text: 'Managing stress, supporting hormonal balance or building a daily practice, each shaped around you.' },
      { title: 'Expecting mothers', text: 'Prenatal yoga is one-on-one by design. See the prenatal page for details.' },
      { title: 'Tight schedules', text: 'A practice planned around the time you actually have.' },
    ],
    steps: [
      { title: 'Share what you need', text: 'Tell us about your body, goals and what a good week would feel like.' },
      { title: 'Practise together', text: 'A session built for you: asana, breath and stillness in the mix that suits you.' },
      { title: 'Plan what next', text: 'Decide together whether to continue one-on-one, join a class, or add a daily practice.' },
    ],
    help: [
      { title: 'Personal attention', text: 'Every instruction is for you, so nothing is generic.' },
      { title: 'A practice that fits', text: 'Sessions are matched to your body, goals and schedule.' },
      { title: 'A calm way to begin', text: 'A good first step before joining a group, or instead of one.' },
      { title: 'Room to ask', text: 'Questions are welcome at any point in the session.' },
    ],
    formats: ['one-on-one', 'studio'],
    faqs: [
      { q: 'What is a 1:1 intro session?', a: 'A private first session where you tell us what you would like to feel, and we match the practice to your body, goals and schedule.' },
      { q: 'Can I switch to a group class later?', a: 'Yes. Many people start privately and join a class when they feel ready.' },
      { q: 'Where do private sessions take place?', a: 'At the studio in Megapolis Serenity, Hinjawadi Phase 3.' },
      faq.start,
      faq.cost,
    ],
    reviewIndex: 1,
    related: ['yoga/prenatal', 'yoga/beginners', 'programs/daily-practice'],
  },

  // ---------------------------------------------------------------- MIND & SOUND
  {
    slug: 'healing/meditation',
    category: 'Mind & Sound',
    tagline: 'Simple, guided techniques to quiet a busy mind.',
    intro: 'Simple, guided techniques to quiet a busy mind and steady the breath, easy to carry into your day.',
    image: meditationImg,
    imageAlt: 'A hand resting in a mudra on a knee beside a small lit candle in a clay bowl, on a dark mat',
    what: [
      'Meditation here is guided and simple. You are shown how to sit, where to rest your attention, and what to do when it wanders, which it will.',
      'The techniques are short enough to remember and plain enough to use on an ordinary Tuesday.',
    ],
    who: [
      { title: 'Busy minds', text: 'If your thoughts will not slow down, guidance gives your attention something steady to follow.' },
      { title: 'Complete beginners', text: 'No experience, special posture or silence skills needed.' },
      { title: 'Yoga students', text: 'Add stillness to a movement practice, so the calm has somewhere to settle.' },
      { title: 'People building a routine', text: 'Techniques you can repeat at home, in the same few minutes each day.' },
    ],
    steps: [
      { title: 'Find your seat', text: 'Settle into a comfortable position, with support if you need it.' },
      { title: 'Follow the guidance', text: 'Simple, guided techniques lead your attention to breath and sensation.' },
      { title: 'Return gently', text: 'Come back slowly, and think about how to repeat it at home.' },
    ],
    help: [
      { title: 'Quiet a busy mind', text: 'Guided techniques give your attention somewhere steady to rest.' },
      { title: 'Steady the breath', text: 'Slower breathing supports a calmer body.' },
      { title: 'Ease stress', text: 'A few quiet minutes can support a less crowded day.' },
      { title: 'Take it with you', text: 'Techniques are simple enough to use outside the studio.' },
    ],
    formats: ['studio', 'online'],
    faqs: [
      { q: 'I cannot stop my thoughts. Will this work for me?', a: 'Wandering thoughts are normal. The guidance shows you how to come back to your breath without frustration.' },
      faq.when(),
      faq.start,
      faq.cost,
    ],
    reviewIndex: 0,
    related: ['healing/breathwork', 'healing/sound-healing', 'programs/stress-management'],
  },
  {
    slug: 'healing/breathwork',
    category: 'Mind & Sound',
    tagline: 'Guided breath practices to steady the mind and body.',
    intro: 'Guided breath practices to steady the mind and body, taught in simple steps you can carry into your day.',
    image: breathworkImg,
    imageAlt: 'A person in rose-coloured leggings seated in a mudra by a bright window, face out of frame',
    what: [
      'Breath is one part of your nervous system you can steer on purpose. Breathwork teaches you how, with clear, guided techniques.',
      'It is part of every AadiVed class, and it also stands alone as its own practice.',
    ],
    who: [
      { title: 'Anyone who feels tense', text: 'Slow breathing is a practical first thing to reach for.' },
      { title: 'Yoga students', text: 'Go deeper into the breath work that already runs through your classes.' },
      { title: 'Busy professionals', text: 'Short techniques that fit between meetings, or before sleep.' },
      { title: 'Expecting mothers', text: 'Breath is a central part of prenatal sessions. Please consult your doctor first.' },
    ],
    steps: [
      { title: 'Settle', text: 'Find a comfortable position and notice your natural breath.' },
      { title: 'Practise', text: 'Follow guided techniques, one at a time, with clear cues.' },
      { title: 'Rest and notice', text: 'Return to natural breathing and notice how you feel.' },
    ],
    help: [
      { title: 'Steady the mind', text: 'Slower breath supports a calmer, clearer head.' },
      { title: 'Settle the body', text: 'Steady breathing helps the body shift out of rush mode.' },
      { title: 'Ease stress', text: 'A simple technique you can use anywhere.' },
      { title: 'Support other practices', text: 'Breath makes movement and meditation easier to enter.' },
    ],
    formats: ['studio', 'online'],
    faqs: [
      { q: 'Is breathwork safe for everyone?', a: 'Techniques are taught gently and clearly. Tell us about any health condition first, and talk to your doctor if you are unsure.' },
      { q: 'Do I need experience?', a: 'No. Each technique is taught in simple steps.' },
      faq.when(),
      faq.start,
      faq.cost,
    ],
    reviewIndex: 1,
    related: ['healing/meditation', 'programs/anxiety-relief', 'yoga/guided-yoga'],
  },
  {
    slug: 'healing/grounding',
    category: 'Mind & Sound',
    tagline: 'Slow, steady practices that bring you back into the body.',
    intro: 'Slow, steady practices that bring you back into the body, so you can feel steadier when life is moving fast.',
    image: groundingImg,
    imageAlt: 'An arm and hand resting on a bent knee, with soft green foliage out of focus behind',
    what: [
      'Grounding practices turn your attention to the body and the ground beneath it. They are slow, simple and surprisingly effective at settling a restless mind.',
      'They are part of every class and can also be practised on their own.',
    ],
    who: [
      { title: 'Scattered or restless minds', text: 'Bring your attention out of your head and into your body.' },
      { title: 'Long workdays', text: 'A reset between work and home, so the day does not follow you in.' },
      { title: 'People rebuilding balance', text: 'A steady place to start after a big life change.' },
      { title: 'Yoga students', text: 'Add a quieter counterpart to an active practice.' },
    ],
    steps: [
      { title: 'Arrive', text: 'Feel the weight of your body and the support beneath you.' },
      { title: 'Move slowly', text: 'Slow, steady movement and breath bring attention into the body.' },
      { title: 'Stay a moment', text: 'Rest, and notice what has settled.' },
    ],
    help: [
      { title: 'Settle the mind', text: 'Attention in the body supports a quieter head.' },
      { title: 'Ease tension', text: 'Slow movement gives the body a way to let go.' },
      { title: 'Feel steadier', text: 'Practices you can come back to when things feel fast.' },
      { title: 'Carry calm off the mat', text: 'Simple enough to use anywhere in your day.' },
    ],
    formats: ['studio', 'online'],
    faqs: [
      { q: 'What does a grounding practice involve?', a: 'Slow, steady movement and breath, with attention on the body and the ground beneath you.' },
      { q: 'Do I need experience?', a: 'No. The practices are simple and clearly guided.' },
      faq.when(),
      faq.start,
      faq.cost,
    ],
    reviewIndex: 0,
    related: ['healing/meditation', 'programs/stress-management', 'programs/energy-reset'],
  },

  // ---------------------------------------------------------------- WELLNESS PROGRAMS
  {
    slug: 'programs/hormonal-balance',
    category: 'Wellness Programs',
    tagline: 'Gentle sequences and breath practices that support your cycle, energy and mood.',
    intro: 'Gentle sequences and breath practices that support your cycle, energy and mood through every season of life.',
    image: hormonalImg,
    imageAlt: 'A hand holding a glass cup of dark tea beside a vase of pale purple wildflowers on white linen',
    what: [
      'This programme uses gentle yoga sequences and breath practices to support your cycle, energy and mood. It is calm and unhurried, and it pays attention to where you are right now.',
      'It is a supportive practice, not medical care. It sits alongside whatever your doctor recommends.',
    ],
    who: [
      { title: 'Women through every season', text: 'The practice is shaped to support you through different stages of life.' },
      { title: 'Uneven energy', text: 'If your energy and mood rise and fall, gentle, steady practice can offer a rhythm.' },
      { title: 'People who want a gentler approach', text: 'No pushing. The sequences are kind to the body.' },
      { title: 'Anyone building a routine', text: 'A short, repeatable practice that you can keep up.' },
    ],
    steps: [
      { title: 'Talk it through', text: 'Share what you are noticing about your cycle, energy and mood.' },
      { title: 'Practise gently', text: 'Slow sequences and breath practices, adjusted to how you feel on the day.' },
      { title: 'Keep a rhythm', text: 'Agree a routine you can repeat at home between sessions.' },
    ],
    help: [
      { title: 'Support your cycle', text: 'Gentle movement and breath help you feel more in step with your body.' },
      { title: 'Steady your energy', text: 'A regular, calm practice supports more even energy through the week.' },
      { title: 'Support your mood', text: 'Slow breathing helps the mind settle.' },
      { title: 'Feel listened to', text: 'Sessions respond to what you tell us about how you feel.' },
    ],
    formats: ['studio', 'online'],
    faqs: [
      { q: 'Is this a medical treatment?', a: 'No. It is a gentle yoga and breath practice that supports wellbeing. Please talk to your doctor about any health concern.' },
      faq.when(),
      faq.start,
      faq.cost,
    ],
    reviewIndex: 1,
    related: ['programs/stress-management', 'programs/daily-practice', 'yoga/private-sessions'],
    careNote: 'This programme supports wellbeing and does not replace medical care.',
  },
  {
    slug: 'programs/stress-management',
    category: 'Wellness Programs',
    tagline: 'Slow, grounding practice for busy minds and long workdays.',
    intro: 'Slow, grounding practice for busy minds and long workdays. Leave lighter than you arrived.',
    image: stressImg,
    imageAlt: 'The silhouette of a person with their back to the camera, facing a hazy sunrise over low hills',
    what: [
      'Stress builds up quietly. This programme gives it somewhere to go, with slow movement, steady breath and grounding practices.',
      'It is designed for the real pace of your week: fixed, unhurried sessions you can come back to.',
    ],
    who: [
      { title: 'Long workdays', text: 'Come out of the rush and give the day somewhere to land.' },
      { title: 'Busy minds', text: 'When your head will not switch off, guided practice gives it something steady.' },
      { title: 'People feeling stretched', text: 'A regular space where nothing is expected of you.' },
      { title: 'Beginners', text: 'No yoga experience needed. Everything is explained.' },
    ],
    steps: [
      { title: 'Slow down', text: 'Arrive, settle and let your breath lengthen.' },
      { title: 'Release tension', text: 'Gentle movement and grounding practices, with clear guidance.' },
      { title: 'Rest', text: 'Finish in stillness, so the calm has time to settle.' },
    ],
    help: [
      { title: 'Ease stress', text: 'Slow practice supports the body in shifting out of rush mode.' },
      { title: 'Quiet the mind', text: 'Breath and grounding help the head feel less crowded.' },
      { title: 'Rest better', text: 'A calmer evening supports a calmer night.' },
      { title: 'Build a buffer', text: 'Regular sessions help you meet the week with more room.' },
    ],
    formats: ['studio', 'online'],
    faqs: [
      { q: 'Is this the same as therapy?', a: 'No. It is a yoga and breath practice that supports wellbeing. If you are struggling, please talk to your doctor or a mental health professional.' },
      faq.when(),
      faq.start,
      faq.cost,
    ],
    reviewIndex: 0,
    related: ['programs/anxiety-relief', 'healing/grounding', 'healing/sound-healing'],
    careNote: 'This programme supports wellbeing and does not replace professional care.',
  },
  {
    slug: 'programs/anxiety-relief',
    category: 'Wellness Programs',
    tagline: 'Calming practice to help you leave lighter than you arrived.',
    intro: 'Calming practice for an anxious mind. Slow breath, steady movement and quiet help you leave lighter than you arrived.',
    image: anxietyImg,
    imageAlt: 'A woman with long hair seen from behind, standing by a calm lake at sunset',
    what: [
      'When your mind races, slow, steady practice can help. This programme uses breath, gentle movement and stillness to support a calmer state.',
      'It is a supportive practice, not a treatment, and it works alongside professional care if you have it.',
    ],
    who: [
      { title: 'Racing minds', text: 'Simple breath practices that give your attention somewhere to rest.' },
      { title: 'People who feel on edge', text: 'A quiet room and a steady pace, with nothing expected of you.' },
      { title: 'Beginners', text: 'No experience needed. Each technique is clearly explained.' },
      { title: 'Anyone already seeing a professional', text: 'A calm practice can sit alongside the care you already have.' },
    ],
    steps: [
      { title: 'Arrive slowly', text: 'There is no rush. Settle, and let the breath find its pace.' },
      { title: 'Breathe and move', text: 'Gentle breath practices and slow movement, guided step by step.' },
      { title: 'Rest', text: 'End in stillness, and notice what has softened.' },
    ],
    help: [
      { title: 'Calm the breath', text: 'Slow, steady breathing supports a calmer body.' },
      { title: 'Steady the mind', text: 'Guided practice gives anxious thoughts less to grip.' },
      { title: 'Feel safe in the room', text: 'A quiet, supportive space with unhurried pacing.' },
      { title: 'Take tools home', text: 'Simple breath practices you can use any time.' },
    ],
    formats: ['studio', 'online'],
    faqs: [
      { q: 'Is this a treatment for anxiety?', a: 'No. It is a calming practice that supports wellbeing. If anxiety is affecting your daily life, please talk to your doctor or a mental health professional.' },
      faq.when(),
      faq.start,
      faq.cost,
    ],
    reviewIndex: 1,
    related: ['healing/breathwork', 'programs/stress-management', 'healing/meditation'],
    careNote: 'This programme supports wellbeing and does not replace professional care. If you are struggling, please talk to your doctor or a mental health professional.',
  },
  {
    slug: 'programs/energy-reset',
    category: 'Wellness Programs',
    tagline: 'A restorative reset for body and nervous system.',
    intro: 'A restorative reset for body and nervous system. Slow down, recharge and begin again.',
    image: energyImg,
    imageAlt: 'A person seated on a wooden deck, seen from behind, looking at a vivid orange sunrise over distant hills',
    what: [
      'An energy reset is a pause, not a push. It uses restorative movement, breath and stillness to help your body and nervous system recover.',
      'It suits the days and seasons when you feel drained and need a gentler way back.',
    ],
    who: [
      { title: 'Run-down weeks', text: 'When you feel flat, a restorative session gives you a place to start again.' },
      { title: 'Demanding seasons', text: 'After a big project, a hard stretch or a lot of travel.' },
      { title: 'Active people', text: 'A counterpart to hard training or a packed schedule.' },
      { title: 'Anyone who wants to pause', text: 'No performance, no pressure.' },
    ],
    steps: [
      { title: 'Soften', text: 'Slow down, and let the breath lengthen.' },
      { title: 'Restore', text: 'Gentle, supported movement and stillness.' },
      { title: 'Begin again', text: 'Return slowly, with a few quiet minutes before you go.' },
    ],
    help: [
      { title: 'Support recovery', text: 'Restorative practice gives the body room to recover.' },
      { title: 'Settle the nervous system', text: 'Slow breath supports a calmer baseline.' },
      { title: 'Restore energy', text: 'A pause can leave you feeling more like yourself.' },
      { title: 'Reset your rhythm', text: 'A calm place to start a better routine.' },
    ],
    formats: ['studio', 'online'],
    faqs: [
      { q: 'Is it energetic or restful?', a: 'Restful. It is a restorative reset, so the pace is slow and supportive.' },
      faq.when(),
      faq.start,
      faq.cost,
    ],
    reviewIndex: 0,
    related: ['healing/sound-healing', 'healing/grounding', 'programs/daily-practice'],
  },
  {
    slug: 'programs/daily-practice',
    category: 'Wellness Programs',
    tagline: 'Breath, movement and stillness you can return to every day.',
    intro: 'Build a practice that lasts, with breath, movement and stillness you can return to every day.',
    image: dailyImg,
    imageAlt: 'Woman in a low lunge with arms raised, practising yoga on a beach at sunset',
    what: [
      'A practice only changes things if you do it. This programme helps you shape a daily routine that fits your life and that you can keep up.',
      'You begin with what you need now, and the routine grows with you.',
    ],
    who: [
      { title: 'People who start and stop', text: 'Build a rhythm you can keep, with guidance when it wobbles.' },
      { title: 'Busy schedules', text: 'A routine sized to the time you have, not the time you wish you had.' },
      { title: 'New practitioners', text: 'Turn a few classes into a habit that lasts.' },
      { title: 'Experienced practitioners', text: 'Put structure around what you already do.' },
    ],
    steps: [
      { title: 'Choose your anchor', text: 'Pick one small thing, such as a few breaths or a short sequence, at a set time.' },
      { title: 'Practise with guidance', text: 'Learn the sequence in a session, so you can do it alone.' },
      { title: 'Keep going', text: 'Check in, adjust and add, one step at a time.' },
    ],
    help: [
      { title: 'Build consistency', text: 'A small routine that you keep beats a big one that you drop.' },
      { title: 'Support wellbeing', text: 'Regular breath and movement help the body and mind settle.' },
      { title: 'Feel your progress', text: 'Daily practice helps you notice small changes.' },
      { title: 'Carry calm through the day', text: 'Short practices you can use anywhere.' },
    ],
    formats: ['studio', 'online'],
    faqs: [
      { q: 'Do I need to come to the studio every day?', a: 'No. Sessions help you build a routine you then practise at home.' },
      faq.when(),
      faq.start,
      faq.cost,
    ],
    reviewIndex: 2,
    related: ['yoga/guided-yoga', 'yoga/private-sessions', 'healing/meditation'],
  },

  // ---------------------------------------------------------------- SOUND HEALING (approved sample)
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
      { q: 'When are sessions?', a: `${site.hours.label}. ${site.hours.note} Ask us which sessions include sound healing.` },
      faq.start,
      faq.cost,
    ],
    reviewIndex: 0,
    related: ['healing/meditation', 'healing/breathwork', 'programs/stress-management'],
  },
];

export function getPractice(slug: string): Practice | undefined {
  return practices.find((p) => p.slug === slug);
}
