import { Property } from '../types/property';

export const listingProperties: Property[] = [
  {
    id: 101,
    price: '$2,450,000',
    title: 'Skyline Residences Penthouse',
    description: 'Luxury penthouse with panoramic city views.',
    location: 'Upper East Side, New York, NY',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByoqrvBLuWZiOAdhnL3inZHR5nrJUsd81-Q5cKzijmNn5N_DqKQh936H-cAol401laqHuKgiaU_RfFaMLfHOsZsaHAq8iLjZEEUh_sC5Ncvf5-FIfWU2vjlDQCF1S2VfUDTah3m_vyG0Lg6rGxYDAk91qMN7FCApGlaFlwc3r5PN3F0hA6Y8njUBuP6gbaIty04JR7DVq00FZHgsrxDdfM_MvRXd9DjlNDTOFHiDV0zgC6yU2Jjxeye29M7y1YOIKc3CM6xkyKekQ',
    badge: 'New Launch',
    badgeVariant: 'secondary',
    isVerified: true,
    meta: [
      { icon: 'bed', value: '3 BHK' },
      { icon: 'bathtub', value: '2 Bath' },
      { icon: 'square_foot', value: '2,150 sqft' },
    ],
  },
  {
    id: 102,
    price: '$1,890,000',
    title: 'Oakwood Luxury Villa',
    description: 'Contemporary villa in a premium suburb.',
    location: 'Scarsdale, Westchester County, NY',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMgaDO-11dlXemxUbZjYFZBlmu_MK6-QqJMHuvSLQRUHrKp0HfPqbXO47GJUn92vgFlG4EpBv9Yg5K7oey6T8zapKX_8rp_a_Mk7qmoTybgLMflfwgbN0EGymJ9Y4OFJ07vxGGpJQf7MEJLyYJaJW5thvV8lSKQrCp9rw1293ouDswSIc5ZX6LZbVIxqTOtKfNs4R7XTN--9a60qaTgBxM7h5moZDpliyto_GS4eA6YtFd7neNDvtDNn1DlYX_XtLiI79iTfBl5TI',
    badge: 'Ready to Move',
    badgeVariant: 'primary',
    isFavourited: true,
    meta: [
      { icon: 'bed', value: '4 BHK' },
      { icon: 'bathtub', value: '3 Bath' },
      { icon: 'garage', value: '2 Pkg' },
    ],
  },
  {
    id: 103,
    price: '$3,200,000',
    title: 'Horizon Beachfront Estate',
    description: 'Beachfront estate with private pool access.',
    location: 'Southampton, Long Island, NY',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-cwfopU4ruluVfxpVEGuUq5EHr-uugN_gR6k4T_pei8Bd-fE5wlHA5hVnFhUVwzlnWzV0ZJC-jVMORSxPaxZXayZ6Jxm_u-UOcyAnmiSit9Dop9NKshDWWjfkJmAWjOXE9Spget5Qj81T0v5gbWhAqlR7FiDBVQdn1INA36CbjJ0jNcPAog8tFjzBH-33WjO9J0uVTXIYHMmkH0prV87dCnUxyyHAGwQO_9plSupGv2k2Hk0S2Foy8_Uc2kMdAiiTpm2VkBN4y5A',
    meta: [
      { icon: 'bed', value: '5 BHK' },
      { icon: 'pool', value: 'Pool' },
    ],
  },
];
