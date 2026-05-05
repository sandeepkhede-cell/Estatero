import { Property } from '../types/property';

export const mockDetail: Property = {
  id: 'detail-1',
  price: 42500000,
  pricePerSqft: '₹22,973/sq.ft',
  title: 'Skyline Residences',
  description:
    'Experience luxury living in this sprawling 3 BHK apartment located in the heart of Bandra. This property features premium Italian marble flooring, a modern modular kitchen, and breathtaking views of the Arabian Sea. Perfect for families seeking a blend of comfort and style.',
  location: 'Bandra West, Mumbai',
  city: 'Mumbai',
  locality: 'Bandra West',
  listingType: 'sale',
  propertyType: 'apartment',
  bedrooms: 3,
  bathrooms: 2,
  areaSqft: 1850,
  area: '1,850 sqft',
  facing: 'East',
  furnishing: 'semi-furnished',
  availability: 'ready-to-move',
  isVerified: true,
  isFeatured: true,
  isReraRegistered: true,
  reraNumber: 'P51900029019',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCvg-7y1cCjXbXP9cJ3_l4O63TtetFFQt9Q12Kb4HTHVGsboSNBJENwMT6ot2ZYTMZbJK8QQ1n2UPhoKB37cflRkfondK7G0ufYOCQK-0sDTN90vZsp2nvySmwLzcYv_tIZQPOunUG7eUH0XyM4yCSv4erwhYW2dG5mgIeaprfSsVaSAMDsfciy0eA2NmqvD94iBG66141d04XIBK44QGEm-0-Uet41wayZnQlaTv6MPx4bkd7kAh18B1-UeQMCeHS2P53HBcHYAQ',
  images: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCCvg-7y1cCjXbXP9cJ3_l4O63TtetFFQt9Q12Kb4HTHVGsboSNBJENwMT6ot2ZYTMZbJK8QQ1n2UPhoKB37cflRkfondK7G0ufYOCQK-0sDTN90vZsp2nvySmwLzcYv_tIZQPOunUG7eUH0XyM4yCSv4erwhYW2dG5mgIeaprfSsVaSAMDsfciy0eA2NmqvD94iBG66141d04XIBK44QGEm-0-Uet41wayZnQlaTv6MPx4bkd7kAh18B1-UeQMCeHS2P53HBcHYAQ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDfF4FeQDrIiBbKD0q2jA0_77xcaGqGSOvqFDOWYgaGOORHF7uNK74XfD5LT1SD-bRqkBbtVCYI84Dqny7H3G8L_9US7wZBp7fh4NqS1SjBMc1ug4_9iEeLuBIh9m4ShoWLSwx9NUcDNagAA0BH5suD86wyAgAQtOoBEUFAQwPKOhsC81A8bNAThmKsiDZOfIrWbfYwqaEO4y5RPVAnmKC0JhF8UJQXV1TilXOt8YeOu_wM0QiBcqk-ZH-Xz4J576AHYac89DYfkRE',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBkcQLZalua41lhHitOVCtxAPJglmbm8nlLTRaIAcFfKXfYIRc8eFOhGReOz09s7tidmkzovD3GYTvdutN8DMeVwOKybMVtPmQYujaulAOAEN5FntbUpA4HHK8GEGmrs5GJ0QepcVaQLTK-Cfm1L4_5Mv1zOzQEOLtdZ5QcZbZOn-trcCGdve5c-7o1CfjzENbmOC6HEu0LMrhQ_0DVrGeF63XxQJA3to3s0qinqiWzMPNRh9OQsdThZqi8ycuX7Pycla3jBtZzMX0',
  ],
  meta: [
    { icon: 'bed',       value: '3 BHK' },
    { icon: 'straighten',value: '1,850 sqft' },
  ],
  amenities: [
    { icon: 'pool',            label: 'Swimming Pool' },
    { icon: 'fitness_center',  label: 'Modern Gym' },
    { icon: 'local_parking',   label: '2 Car Parking' },
    { icon: 'security',        label: '24/7 Security' },
  ],
  nearbyPlaces: [
    { icon: 'school',         name: 'St. Stanislaus School', distance: '0.8 km' },
    { icon: 'local_hospital', name: 'Lilavati Hospital',     distance: '1.5 km' },
  ],
  agent: {
    id:      'agent-1',
    name:    'Rajesh Khanna',
    role:    'agent',
    tagline: 'Top Platinum Agent • 8 yrs exp.',
    avatar:  'https://lh3.googleusercontent.com/aida-public/AB6AXuBavWx4C0wUyn8apqBTxy8DzLGszIySjaZvchEL6JPZAiXTi6g44Hdd4P3dLYoQsp23uaHW9wH1QVGF6LjyFkdBRZtwfeapK74IPm1zOjy6Iumj8PIXvSGR6fz8xPK3enE7byfMyFPHZAdCZo-t5tGoIWsxn1mpOugpX8m69vpYfX57GhoS0i28gDl0I2CqPcC_lMaEjpEhQtEIiqO4JxVQbtvJbk432mfi0Iqvk69NN6_kPwXE7qeS3vL-hQQOR81TLRQn-cPKzqw',
  },
};
