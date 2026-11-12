export interface CrewMember {
  id: string;
  name: string;
  role: string;
  trait: string;
  suitAccent: string;
  happyQuote: string;
  tightQuote: string;
}

export const CREW_ROSTER: CrewMember[] = [
  {
    id: 'maya',
    name: 'Dr. Maya Lin',
    role: 'Botanist',
    trait: 'Grows cherry tomatoes in microgravity',
    suitAccent: '#5E9C94',
    happyQuote: 'The greenhouse smells like fresh basil today.',
    tightQuote: 'Watching the water gauges closely—plants need a steady sip.',
  },
  {
    id: 'leo',
    name: 'Cmdr. Leo Vance',
    role: 'Flight Engineer',
    trait: 'Always carries a roll of Kapton tape',
    suitAccent: '#E8622C',
    happyQuote: 'Solar arrays are clean and pulling steady watts.',
    tightQuote: 'Running diagnostics on the power bus—let’s keep margins safe.',
  },
  {
    id: 'samira',
    name: 'Samira Patel',
    role: 'Life Support Tech',
    trait: 'Knows every valve in the water recycler',
    suitAccent: '#D99B26',
    happyQuote: 'Air is crisp and water recycling is at 98%.',
    tightQuote: 'CO2 scrubbers are working overtime. Maintenance helps!',
  },
  {
    id: 'tomas',
    name: 'Tomás Rivera',
    role: 'Geology & Shielding',
    trait: 'Collects interesting moon and Mars rocks',
    suitAccent: '#8FA6CB',
    happyQuote: 'Regolith berm looks solid. Ready for any solar weather.',
    tightQuote: 'Keeping an eye on the radiation meter—shelter is prepped.',
  },
];
