import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope';
import { faGoogleScholar } from '@fortawesome/free-brands-svg-icons/faGoogleScholar';
import { faOrcid } from '@fortawesome/free-brands-svg-icons/faOrcid';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons/faFilePdf';
// See https://fontawesome.com/icons?d=gallery&s=brands,regular&m=free
// to add other icons.

const data = [
  {
    link: `${process.env.PUBLIC_URL}/CV.pdf`,
    label: 'Full CV',
    icon: faFilePdf,
  },
  {
    link: 'https://www.linkedin.com/in/mlzhu',
    label: '\u00A0LinkedIn',
    icon: faLinkedinIn,
  },
  {
    link: 'https://scholar.google.com/citations?user=tkEx8OQAAAAJ',
    label: 'Google Scholar',
    icon: faGoogleScholar,
  },
  {
    link: 'https://orcid.org/0000-0001-6830-2636',
    label: 'ORCID',
    icon: faOrcid,
  },
  {
    link: 'https://github.com/mlz-EM',
    label: 'Github',
    icon: faGithub,
  },
  {
    link: 'mailto:mlz.eMicroscopy@gmail.com',
    label: 'Email',
    icon: faEnvelope,
  },
];

export default data;
