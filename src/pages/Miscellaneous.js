import React from 'react';
import Main from '../layouts/Main';
import AdaptiveCard from '../components/Template/AdaptiveCard';
import PageHeader from '../components/Template/PageHeader';
import PageTools from '../components/Template/PageTools';
import { getMiscItems } from '../content/api';

const ENABLE_PER_CARD_EXPAND = true;
const MISC_TOOLS = [
  { label: 'Top', href: '#miscellaneous' },
  { label: 'Projects', to: '/projects' },
  { label: 'Resources', to: '/resources' },
];

const Miscellaneous = () => (
  <Main title="Miscellaneous" description="Learn about Menglin Zhu's Miscellaneous.">
    <article className="post" id="miscellaneous">
      <PageHeader title="Miscellaneous" />
      <PageTools items={MISC_TOOLS} ariaLabel="Miscellaneous page tools" />
      {getMiscItems().map((badge) => (
        <AdaptiveCard
          data={badge}
          key={badge.label}
          enableExpand={ENABLE_PER_CARD_EXPAND}
        />
      ))}
    </article>
  </Main>
);

export default Miscellaneous;
