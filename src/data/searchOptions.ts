export const destinations = [
  'Argentina', 'Asia Triple Centre', 'Asia Twin Centre', 'Austria', 'Brazil',
  'Bulgaria', 'Cambodia', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark',
  'Egypt', 'Estonia', 'Europe Triple Centre', 'Europe Twin Centre', 'Finland',
  'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'India', 'Indonesia',
  'Italy', 'Kenya', 'Latvia', 'Malaysia', 'Maldives', 'Malta', 'Mauritius',
  'Montenegro', 'Morocco', 'Nepal', 'Peru', 'Poland', 'Portugal', 'Singapore',
  'Slovakia', 'Slovenia', 'South Africa', 'South America Twin Centre', 'Spain',
  'Sri Lanka', 'Sweden', 'Thailand', 'Turkey', 'UAE', 'Vietnam',
];

export const airports = [
  'Aberdeen', 'Birmingham', 'Bristol', 'Dublin', 'Edinburgh', 'Glasgow',
  'Leeds-Bradford', 'Liverpool', 'London All', 'London Gatwick', 'London Heathrow',
  'London Luton', 'Manchester', 'Newcastle', 'Stansted',
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Generate next 12 months from today. Call at request time, not module scope. */
export function getMonths(): string[] {
  const now = new Date();
  const result: string[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    result.push(`${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`);
  }
  return result;
}

export const passengers = [
  '2 adults', '3 adults', '4 adults', '5 adults', '6 adults', '7 adults', '8 adults',
];
