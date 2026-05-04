import { Link } from 'react-router-dom';
import SectionHeader from '../ui/SectionHeader';
import BentoCard from './BentoCard';

interface Collection {
  id: string | number;
  image: string;
  title: string;
  description?: string;
  badge?: string;
  large?: boolean;
  href?: string;
}

interface CuratedCollectionsSectionProps {
  title?: string;
  collections?: Collection[];
  onCardClick?: (id: Collection['id']) => void;
}

const defaultCollections: Collection[] = [
  {
    id: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaIX_4khA3RBfXheNB-tKoP1YG8kannN3ghdnBeDPK0_aHsB6YznjgBh67brwA7G9cGQu7i_JnPYVqjnZqdbtoouX36oLPYD8_q7AoXk3G1g-Bkz75SDJVHx_nb5PeSTLrhiJzCiyZWWlv76mRO8DJV1B1olKTdRfpdFi0daP3uhSyINvAliSDHCQffWLcLdpqJ5jjUF4WNxDlIaRFEr3jU60nkuk3qmVbO8MfFEQjwTJpSNsnz39xo6bk_B8b_2NfZ9QOvQKe34M',
    title: 'Luxury Penthouses',
    description: 'Exclusive sky-high living with panoramic city views.',
    badge: 'PREMIUM',
    large: true,
  },
  {
    id: 2,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCn7azt5wyl52ne1IuowozRoRMMevYWKT2DjHqY_M3KYQCeBYHQIjMXxV-IUsUhx5cW_qHofpvLKip-xCUdQA1xfnaP2pr7d40qoshunYpHkQ31loGROFTFkse6HtNHz6yUwjD0wIV3N90vUzIYLEjT1_ftvvDal-VQo7d4AG0MRAmalTkwFMrr5veURnCHHOiAFrIok9DLvi7SDj_uXhm8RVwh8zaFjpVlIAcJdIsBhUpr9tDAURWCD49Iwq93CXHRx_rZL6i1Fu8',
    title: 'Family Homes',
    description: 'Perfect for growing families.',
  },
  {
    id: 3,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmchTCcg5zlIoGSwlvY-gy2s2ZG9qQkVgOSRa952zlZmEIEByWhuKP3PvWEwmUqyhvslandpjecFrcg2gZK6CEOpmAdNJWAAIthYBe5_jbxcNU5z5_3MfQFycTXwC43gtqXvfaF7F7I-EmE7XYq_zUth-_saVizytx6vrPxgpvvOiIUG5-hU7qn1WSh_65yCgzUB4j3gT61kD508glVCD76SENvQusXq4rzCC_1qjuU8Eg2QuOdtEKLnpoo9LH57k8KP9kc0tLaPg',
    title: 'Office Spaces',
    description: 'Modern workspaces in prime hubs.',
  },
];

const CuratedCollectionsSection = ({
  title = 'Curated Collections',
  collections = defaultCollections,
  onCardClick,
}: CuratedCollectionsSectionProps) => (
  <section className="max-w-[1200px] mx-auto px-6 py-xl">
    <SectionHeader
      title={title}
      action={
        <Link
          to="/listings"
          className="text-primary font-label-bold flex items-center hover:underline"
        >
          View All
          <span className="material-symbols-outlined ml-1">arrow_forward</span>
        </Link>
      }
    />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter min-h-[500px]">
      {collections.map((col) => (
        <BentoCard
          key={col.id}
          image={col.image}
          title={col.title}
          description={col.description}
          badge={col.badge}
          large={col.large}
          onClick={() => onCardClick?.(col.id)}
        />
      ))}
    </div>
  </section>
);

export default CuratedCollectionsSection;
