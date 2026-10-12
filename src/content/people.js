const SECTION_ORDER = [
  'Principal Investigator',
  'Postdocs',
  'PhD Students',
  "Master's Students",
  'Undergraduate Students',
  'Visiting Scholars',
  'Alumni',
  'Other Members',
];

const getSectionTitle = (person) => {
  if ((person.status || '').toLowerCase() === 'alumni') return 'Alumni';
  const role = person.role || '';
  const normalized = role.trim().toLowerCase();

  if (normalized.includes('principal investigator') || normalized === 'pi') return 'Principal Investigator';
  if (normalized.includes('postdoc')) return 'Postdocs';
  if (normalized.includes('phd')) return 'PhD Students';
  if (normalized.includes('master')) return "Master's Students";
  if (normalized.includes('undergrad')) return 'Undergraduate Students';
  if (normalized.includes('visiting')) return 'Visiting Scholars';
  if (normalized.includes('alumni')) return 'Alumni';

  return 'Other Members';
};

export const getVisiblePeople = (people) => (
  people.filter((person) => person.showOnPage)
    .sort((a, b) => {
      const orderDiff = (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999);
      if (orderDiff !== 0) return orderDiff;
      return a.name.localeCompare(b.name);
    })
);

export const groupPeople = (visiblePeople) => {
  const grouped = visiblePeople.reduce((acc, person) => {
    const section = getSectionTitle(person);
    if (!acc[section]) acc[section] = [];
    acc[section].push(person);
    return acc;
  }, {});

  return SECTION_ORDER
    .filter((section) => grouped[section]?.length)
    .map((section) => ({
      title: section,
      members: grouped[section],
    }));
};
