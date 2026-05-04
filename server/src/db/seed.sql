-- ============================================================
-- Estatero — Seed Data
-- Run: psql $DATABASE_URL -f src/db/seed.sql
-- ============================================================

-- ── Amenities lookup ─────────────────────────────────────────
INSERT INTO amenities (icon, label) VALUES
  ('pool',           'Swimming Pool'),
  ('fitness_center', 'Modern Gym'),
  ('local_parking',  'Car Parking'),
  ('security',       '24/7 Security'),
  ('elevator',       'Elevator'),
  ('wifi',           'High-Speed Wi-Fi'),
  ('ac_unit',        'Air Conditioning'),
  ('yard',           'Garden / Lawn'),
  ('sports_tennis',  'Club House'),
  ('bolt',           'Power Backup'),
  ('local_laundry_service', 'Laundry Room'),
  ('child_care',     'Children Play Area')
ON CONFLICT (label) DO NOTHING;

-- ── Users (agents) ───────────────────────────────────────────
INSERT INTO users (id, name, email, password_hash, phone, role) VALUES
  (1, 'Rajesh Khanna',  'rajesh@estatero.in',  '$2b$10$placeholder_hash_1', '+91-9820001001', 'agent'),
  (2, 'Priya Mehta',    'priya@estatero.in',   '$2b$10$placeholder_hash_2', '+91-9820001002', 'agent'),
  (3, 'Vikram Singh',   'vikram@estatero.in',  '$2b$10$placeholder_hash_3', '+91-9820001003', 'agent')
ON CONFLICT (id) DO NOTHING;

SELECT setval('users_id_seq', 10);

-- ── Agents ───────────────────────────────────────────────────
INSERT INTO agents (id, user_id, agency_name, bio, profile_image, rating, listings_count) VALUES
  (1, 1, 'Top Platinum Agent • 8 yrs exp.',
   'Specialises in luxury apartments across Mumbai. RERA certified with 200+ transactions.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuBavWx4C0wUyn8apqBTxy8DzLGszIySjaZvchEL6JPZAiXTi6g44Hdd4P3dLYoQsp23uaHW9wH1QVGF6LjyFkdBRZtwfeapK74IPm1zOjy6Iumj8PIXvSGR6fz8xPK3enE7byfMyFPHZAdCZo-t5tGoIWsxn1mpOugpX8m69vpYfX57GhoS0i28gDl0I2CqPcC_lMaEjpEhQtEIiqO4JxVQbtvJbk432mfi0Iqvk69NN6_kPwXE7qeS3vL-hQQOR81TLRQn-cPKzqw',
   4.90, 12),
  (2, 2, 'Priya Realty Group',
   'Expert in Bangalore tech-corridor properties. 150+ successful handovers.',
   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
   4.75, 9),
  (3, 3, 'Singh & Associates',
   'Hyderabad and Pune specialist. Commercial and residential both.',
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
   4.60, 7)
ON CONFLICT (id) DO NOTHING;

SELECT setval('agents_id_seq', 10);

-- ── Properties ───────────────────────────────────────────────
-- IDs 1-4 match mockProperties.ts (home page recommended)
-- IDs 5-7 match mockListings.ts  (listings page)
-- ID  8   matches mockDetail.ts  (detail page)
-- IDs 9-15 are extra for pagination / filter testing

INSERT INTO properties (
  id, title, description, price, price_per_sqft, emi,
  location, city, state,
  property_type, status, bedrooms, bathrooms, area_sqft,
  floor, total_floors, facing,
  badge, badge_variant, is_verified, is_featured,
  agent_id
) VALUES

-- ── Recommended (home page) ──────────────────────────────────
(1,
 'Skyline Residency, Worli',
 'Stunning 3 BHK apartment with sea-facing views in Mumbai''s premium Worli locality. Modern interiors, spacious living areas, and world-class amenities.',
 12400000, 8052, 85000,
 'Worli, Mumbai', 'Mumbai', 'Maharashtra',
 'apartment', 'for_sale', 3, 2, 1540,
 22, 30, 'West',
 'FEATURED', 'primary', TRUE, TRUE,
 1),

(2,
 'Green Meadows, Sarjapur',
 'Well-planned 2 BHK apartment in Sarjapur with lush green surroundings. Close to tech parks. Excellent connectivity.',
 8500000, 7589, 58000,
 'Sarjapur, Bangalore', 'Bangalore', 'Karnataka',
 'apartment', 'for_sale', 2, 2, 1120,
 5, 12, 'North',
 NULL, 'primary', FALSE, TRUE,
 2),

(3,
 'The Grand Villa, Jubilee Hills',
 'Opulent 4 BHK villa in the most coveted Jubilee Hills address. Private garden, home theatre, and servant quarters.',
 24500000, 7656, 168000,
 'Jubilee Hills, Hyderabad', 'Hyderabad', 'Telangana',
 'villa', 'for_sale', 4, 4, 3200,
 NULL, NULL, 'East',
 'FEATURED', 'primary', TRUE, TRUE,
 3),

(4,
 'Zenith Studios, Hinjewadi',
 'Smart 1 BHK studio in Hinjewadi IT hub. Perfect for young professionals. Ready to move.',
 4500000, 6923, 31000,
 'Hinjewadi, Pune', 'Pune', 'Maharashtra',
 'apartment', 'for_sale', 1, 1, 650,
 3, 8, 'South',
 NULL, 'primary', FALSE, FALSE,
 3),

-- ── Listings page ────────────────────────────────────────────
(5,
 'Skyline Residences Penthouse',
 'Luxury penthouse with panoramic city views and a private rooftop terrace. Italian marble, smart-home automation.',
 20400000, 9488, 140000,
 'Bandra West, Mumbai', 'Mumbai', 'Maharashtra',
 'apartment', 'for_sale', 3, 2, 2150,
 28, 28, 'North-East',
 'New Launch', 'secondary', TRUE, TRUE,
 1),

(6,
 'Oakwood Luxury Villa',
 'Contemporary 4 BHK villa in a gated premium suburb. Private pool, landscaped garden, 2-car garage.',
 15700000, 9052, 107000,
 'Whitefield, Bangalore', 'Bangalore', 'Karnataka',
 'villa', 'for_sale', 4, 3, 1735,
 NULL, NULL, 'East',
 'Ready to Move', 'primary', TRUE, FALSE,
 2),

(7,
 'Horizon Beachfront Estate',
 'Rare beachfront estate with direct access to the shore, a private pool, and a home cinema. Ultimate luxury.',
 26600000, 7694, 183000,
 'Versova, Andheri West, Mumbai', 'Mumbai', 'Maharashtra',
 'villa', 'for_sale', 5, 5, 3458,
 NULL, NULL, 'West',
 NULL, 'primary', TRUE, TRUE,
 1),

-- ── Detail-page seed (matches mockDetail.ts) ─────────────────
(8,
 'Skyline Residences',
 'Experience luxury living in this sprawling 3 BHK apartment located in the heart of Bandra. This property features premium Italian marble flooring, a modern modular kitchen, and breathtaking views of the Arabian Sea. Perfect for families seeking a blend of comfort and style.',
 42500000, 32450, 291000,
 'Bandra West, Mumbai', 'Mumbai', 'Maharashtra',
 'apartment', 'for_sale', 3, 2, 1850,
 14, 22, 'East',
 NULL, 'primary', TRUE, TRUE,
 1),

-- ── Extra listings (filter / pagination testing) ─────────────
(9,
 'Prestige Lakeside Habitat',
 'Spacious 3 BHK with stunning lake views. Clubhouse, jogging track, and children''s play area.',
 9800000, 7000, 67000,
 'Whitefield, Bangalore', 'Bangalore', 'Karnataka',
 'apartment', 'for_sale', 3, 2, 1400,
 7, 15, 'North',
 'Ready to Move', 'primary', TRUE, FALSE,
 2),

(10,
 'Lodha World Towers',
 'Ultra-luxury 2 BHK in Lodha World Towers, Lower Parel. Sky-high ceilings, designer interiors.',
 32000000, 20000, 220000,
 'Lower Parel, Mumbai', 'Mumbai', 'Maharashtra',
 'apartment', 'for_sale', 2, 2, 1600,
 40, 70, 'South',
 'FEATURED', 'primary', TRUE, TRUE,
 1),

(11,
 'Brigade Metropolis',
 'Well-connected 2 BHK near ITPL with good rental yield. Ideal for investment.',
 6200000, 5167, 42000,
 'Mahadevapura, Bangalore', 'Bangalore', 'Karnataka',
 'apartment', 'for_rent', 2, 2, 1200,
 4, 10, 'North-West',
 NULL, 'primary', FALSE, FALSE,
 2),

(12,
 'Godrej Air, Sector 85',
 'Premium 4 BHK independent floor with open terrace. Gated society, 24/7 security.',
 18500000, 10278, 127000,
 'Sector 85, Gurugram', 'Gurugram', 'Haryana',
 'apartment', 'for_sale', 4, 3, 1800,
 2, 4, 'East',
 'New Launch', 'secondary', TRUE, FALSE,
 3),

(13,
 'DLF The Crest',
 'Iconic 3 BHK apartment in DLF 5 with forest view. Butler service, concierge, spa.',
 45000000, 25000, 309000,
 'DLF Phase 5, Gurugram', 'Gurugram', 'Haryana',
 'apartment', 'for_sale', 3, 3, 1800,
 18, 24, 'West',
 'FEATURED', 'primary', TRUE, TRUE,
 3),

(14,
 'Sobha Dream Acres',
 'Compact 1 BHK in the heart of Panathur. Excellent amenities, near Outer Ring Road.',
 4200000, 6000, 29000,
 'Panathur, Bangalore', 'Bangalore', 'Karnataka',
 'apartment', 'for_sale', 1, 1, 700,
 2, 14, 'South',
 NULL, 'primary', FALSE, FALSE,
 2),

(15,
 'Peninsula Heights, Bandra',
 '5 BHK sky villa with 270-degree views. Private lift lobby, wine cellar, and terrace garden.',
 95000000, 50000, 653000,
 'Bandra West, Mumbai', 'Mumbai', 'Maharashtra',
 'apartment', 'for_sale', 5, 5, 1900,
 25, 26, 'South-West',
 'FEATURED', 'primary', TRUE, TRUE,
 1)

ON CONFLICT (id) DO NOTHING;

SELECT setval('properties_id_seq', 20);

-- ── Property images ───────────────────────────────────────────
INSERT INTO property_images (property_id, url, is_primary, sort_order) VALUES
-- Property 1 – Skyline Residency Worli
(1, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAA_79d2VJAnVfnBv-JyNvubVeF4ulFQBicztwjvIDX8Y916pXDf586ol5bi7WK0rn-HuqqIlY7yiht4cGezwR2KRARqEWvtb6N6xhuLZnIzK2PMhUrG36_CcM8rIR64ltuF7COG5-WZizmkYz3Z16SYnYR79un8JORk2vpIe9qqsp4WNaO1KsTFC90xZJECPXg69xnwm8mwj3Z1o1A0Yg9aq1FyJYCWQdc170cH4XFRKuyV5tL8DBf2Ha0KSvao_E3U8bGrZt9U4', TRUE, 0),

-- Property 2 – Green Meadows
(2, 'https://lh3.googleusercontent.com/aida-public/AB6AXuABsPmnEGOKNVWjWa0b_Nbq81srgTDgOJmSUSyrXqXbdaKvJFi743wdlI2b-PzDTBmESwNV2yHriaTd2fHwR-smZl4WCCytylQ0ea9oRLr35kvWGDdOeh3z35PQdwxgvc9wXKqRBD0yF-R8UpB5XtaZtGN4LX2YpFnQO1zuDiVVSVga5Rd1HNFKmJehDYRys7VYcefRGI8Vjt9IT6L1EBq8MKXWkyEMVYhEZjUmPPP1-TBYuTCUvAY11FNjtn6QQ3A4npguKUE2YNc', TRUE, 0),

-- Property 3 – Grand Villa
(3, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPmVeqyMaHguC3rJwXlrOf42_W0KmbLnJsgn23zKBVUdqXQY214wQS5PnSKM0xQZvbU89zNUJmGqqxbXKK7zUMvGFMohwhey7gPwLLvlO9oHKoG9SND3-GPBDPiUj1CtmWtmG-tog2wMeNFkYQpDke_i7_sIM2iOtJ3LKqfQpHM-dl83aBlldQalaAqjcjBm_7-jcF3Zkh28Yx3bJgMRPp2cdOg4v-hUsOKREH_ez0IigJ7H0_o-QGxfoSBlD5yG6enCaMYTXdwlg', TRUE, 0),

-- Property 4 – Zenith Studios
(4, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoAI3KNR8N3bPD7fkSTlTYyEPT_sliIIBVS12grRM3svfDowk2fGjS-jEhp-S9xy0haIR027JSkbYuJr85fPCf_jWoeA_JdRYgsr7wTwSMXx1OkjbxzYY4pTejZY02ZjJHR_4U9azh5Q1UMMSxdUrhglITaDQ5WoFtPfB0l-o6v35tEAgvqaBrRBZ1Cmh2VZafHFSWnrp_c_Ca7tMP9YQZxI4LioeXIT86fhCE1w45KIJOJamVcVuX16nrA05b-yXcQq4snOnWYxw', TRUE, 0),

-- Property 5 – Skyline Penthouse
(5, 'https://lh3.googleusercontent.com/aida-public/AB6AXuByoqrvBLuWZiOAdhnL3inZHR5nrJUsd81-Q5cKzijmNn5N_DqKQh936H-cAol401laqHuKgiaU_RfFaMLfHOsZsaHAq8iLjZEEUh_sC5Ncvf5-FIfWU2vjlDQCF1S2VfUDTah3m_vyG0Lg6rGxYDAk91qMN7FCApGlaFlwc3r5PN3F0hA6Y8njUBuP6gbaIty04JR7DVq00FZHgsrxDdfM_MvRXd9DjlNDTOFHiDV0zgC6yU2Jjxeye29M7y1YOIKc3CM6xkyKekQ', TRUE, 0),

-- Property 6 – Oakwood Villa
(6, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMgaDO-11dlXemxUbZjYFZBlmu_MK6-QqJMHuvSLQRUHrKp0HfPqbXO47GJUn92vgFlG4EpBv9Yg5K7oey6T8zapKX_8rp_a_Mk7qmoTybgLMflfwgbN0EGymJ9Y4OFJ07vxGGpJQf7MEJLyYJaJW5thvV8lSKQrCp9rw1293ouDswSIc5ZX6LZbVIxqTOtKfNs4R7XTN--9a60qaTgBxM7h5moZDpliyto_GS4eA6YtFd7neNDvtDNn1DlYX_XtLiI79iTfBl5TI', TRUE, 0),

-- Property 7 – Horizon Beachfront
(7, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-cwfopU4ruluVfxpVEGuUq5EHr-uugN_gR6k4T_pei8Bd-fE5wlHA5hVnFhUVwzlnWzV0ZJC-jVMORSxPaxZXayZ6Jxm_u-UOcyAnmiSit9Dop9NKshDWWjfkJmAWjOXE9Spget5Qj81T0v5gbWhAqlR7FiDBVQdn1INA36CbjJ0jNcPAog8tFjzBH-33WjO9J0uVTXIYHMmkH0prV87dCnUxyyHAGwQO_9plSupGv2k2Hk0S2Foy8_Uc2kMdAiiTpm2VkBN4y5A', TRUE, 0),

-- Property 8 – mockDetail (3 images)
(8, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCvg-7y1cCjXbXP9cJ3_l4O63TtetFFQt9Q12Kb4HTHVGsboSNBJENwMT6ot2ZYTMZbJK8QQ1n2UPhoKB37cflRkfondK7G0ufYOCQK-0sDTN90vZsp2nvySmwLzcYv_tIZQPOunUG7eUH0XyM4yCSv4erwhYW2dG5mgIeaprfSsVaSAMDsfciy0eA2NmqvD94iBG66141d04XIBK44QGEm-0-Uet41wayZnQlaTv6MPx4bkd7kAh18B1-UeQMCeHS2P53HBcHYAQ', TRUE, 0),
(8, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfF4FeQDrIiBbKD0q2jA0_77xcaGqGSOvqFDOWYgaGOORHF7uNK74XfD5LT1SD-bRqkBbtVCYI84Dqny7H3G8L_9US7wZBp7fh4NqS1SjBMc1ug4_9iEeLuBIh9m4ShoWLSwx9NUcDNagAA0BH5suD86wyAgAQtOoBEUFAQwPKOhsC81A8bNAThmKsiDZOfIrWbfYwqaEO4y5RPVAnmKC0JhF8UJQXV1TilXOt8YeOu_wM0QiBcqk-ZH-Xz4J576AHYac89DYfkRE', FALSE, 1),
(8, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkcQLZalua41lhHitOVCtxAPJglmbm8nlLTRaIAcFfKXfYIRc8eFOhGReOz09s7tidmkzovD3GYTvdutN8DMeVwOKybMVtPmQYujaulAOAEN5FntbUpA4HHK8GEGmrs5GJ0QepcVaQLTK-Cfm1L4_5Mv1zOzQEOLtdZ5QcZbZOn-trcCGdve5c-7o1CfjzENbmOC6HEu0LMrhQ_0DVrGeF63XxQJA3to3s0qinqiWzMPNRh9OQsdThZqi8ycuX7Pycla3jBtZzMX0', FALSE, 2),

-- Properties 9-15 (reuse existing image URLs for simplicity)
(9,  'https://lh3.googleusercontent.com/aida-public/AB6AXuABsPmnEGOKNVWjWa0b_Nbq81srgTDgOJmSUSyrXqXbdaKvJFi743wdlI2b-PzDTBmESwNV2yHriaTd2fHwR-smZl4WCCytylQ0ea9oRLr35kvWGDdOeh3z35PQdwxgvc9wXKqRBD0yF-R8UpB5XtaZtGN4LX2YpFnQO1zuDiVVSVga5Rd1HNFKmJehDYRys7VYcefRGI8Vjt9IT6L1EBq8MKXWkyEMVYhEZjUmPPP1-TBYuTCUvAY11FNjtn6QQ3A4npguKUE2YNc', TRUE, 0),
(10, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCvg-7y1cCjXbXP9cJ3_l4O63TtetFFQt9Q12Kb4HTHVGsboSNBJENwMT6ot2ZYTMZbJK8QQ1n2UPhoKB37cflRkfondK7G0ufYOCQK-0sDTN90vZsp2nvySmwLzcYv_tIZQPOunUG7eUH0XyM4yCSv4erwhYW2dG5mgIeaprfSsVaSAMDsfciy0eA2NmqvD94iBG66141d04XIBK44QGEm-0-Uet41wayZnQlaTv6MPx4bkd7kAh18B1-UeQMCeHS2P53HBcHYAQ', TRUE, 0),
(11, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAA_79d2VJAnVfnBv-JyNvubVeF4ulFQBicztwjvIDX8Y916pXDf586ol5bi7WK0rn-HuqqIlY7yiht4cGezwR2KRARqEWvtb6N6xhuLZnIzK2PMhUrG36_CcM8rIR64ltuF7COG5-WZizmkYz3Z16SYnYR79un8JORk2vpIe9qqsp4WNaO1KsTFC90xZJECPXg69xnwm8mwj3Z1o1A0Yg9aq1FyJYCWQdc170cH4XFRKuyV5tL8DBf2Ha0KSvao_E3U8bGrZt9U4', TRUE, 0),
(12, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPmVeqyMaHguC3rJwXlrOf42_W0KmbLnJsgn23zKBVUdqXQY214wQS5PnSKM0xQZvbU89zNUJmGqqxbXKK7zUMvGFMohwhey7gPwLLvlO9oHKoG9SND3-GPBDPiUj1CtmWtmG-tog2wMeNFkYQpDke_i7_sIM2iOtJ3LKqfQpHM-dl83aBlldQalaAqjcjBm_7-jcF3Zkh28Yx3bJgMRPp2cdOg4v-hUsOKREH_ez0IigJ7H0_o-QGxfoSBlD5yG6enCaMYTXdwlg', TRUE, 0),
(13, 'https://lh3.googleusercontent.com/aida-public/AB6AXuByoqrvBLuWZiOAdhnL3inZHR5nrJUsd81-Q5cKzijmNn5N_DqKQh936H-cAol401laqHuKgiaU_RfFaMLfHOsZsaHAq8iLjZEEUh_sC5Ncvf5-FIfWU2vjlDQCF1S2VfUDTah3m_vyG0Lg6rGxYDAk91qMN7FCApGlaFlwc3r5PN3F0hA6Y8njUBuP6gbaIty04JR7DVq00FZHgsrxDdfM_MvRXd9DjlNDTOFHiDV0zgC6yU2Jjxeye29M7y1YOIKc3CM6xkyKekQ', TRUE, 0),
(14, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoAI3KNR8N3bPD7fkSTlTYyEPT_sliIIBVS12grRM3svfDowk2fGjS-jEhp-S9xy0haIR027JSkbYuJr85fPCf_jWoeA_JdRYgsr7wTwSMXx1OkjbxzYY4pTejZY02ZjJHR_4U9azh5Q1UMMSxdUrhglITaDQ5WoFtPfB0l-o6v35tEAgvqaBrRBZ1Cmh2VZafHFSWnrp_c_Ca7tMP9YQZxI4LioeXIT86fhCE1w45KIJOJamVcVuX16nrA05b-yXcQq4snOnWYxw', TRUE, 0),
(15, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-cwfopU4ruluVfxpVEGuUq5EHr-uugN_gR6k4T_pei8Bd-fE5wlHA5hVnFhUVwzlnWzV0ZJC-jVMORSxPaxZXayZ6Jxm_u-UOcyAnmiSit9Dop9NKshDWWjfkJmAWjOXE9Spget5Qj81T0v5gbWhAqlR7FiDBVQdn1INA36CbjJ0jNcPAog8tFjzBH-33WjO9J0uVTXIYHMmkH0prV87dCnUxyyHAGwQO_9plSupGv2k2Hk0S2Foy8_Uc2kMdAiiTpm2VkBN4y5A', TRUE, 0)
ON CONFLICT DO NOTHING;

-- ── Property ↔ Amenity links ──────────────────────────────────
-- (pool=1, gym=2, parking=3, security=4, elevator=5, wifi=6, ac=7, garden=8, club=9, power=10)

INSERT INTO property_amenities (property_id, amenity_id) VALUES
-- Skyline Residency Worli
(1,1),(1,2),(1,3),(1,4),(1,5),(1,7),(1,10),
-- Green Meadows
(2,2),(2,3),(2,4),(2,8),(2,9),(2,12),
-- Grand Villa
(3,1),(3,2),(3,3),(3,4),(3,8),(3,9),(3,10),
-- Zenith Studios
(4,3),(4,4),(4,5),(4,6),
-- Skyline Penthouse
(5,1),(5,2),(5,3),(5,4),(5,5),(5,6),(5,7),(5,10),
-- Oakwood Villa
(6,1),(6,3),(6,4),(6,8),(6,9),
-- Horizon Beachfront
(7,1),(7,3),(7,4),(7,8),(7,10),
-- mockDetail Skyline Residences
(8,1),(8,2),(8,3),(8,4),
-- Extra properties
(9,2),(9,3),(9,4),(9,9),(9,12),
(10,1),(10,2),(10,3),(10,4),(10,5),(10,6),(10,7),(10,10),
(11,3),(11,4),(11,5),
(12,2),(12,3),(12,4),(12,5),(12,10),
(13,1),(13,2),(13,3),(13,4),(13,5),(13,6),(13,7),(13,10),
(14,3),(14,4),
(15,1),(15,2),(15,3),(15,4),(15,5),(15,6),(15,7),(15,8),(15,10)
ON CONFLICT DO NOTHING;

-- ── Nearby places (for detail page seed — property 8) ─────────
INSERT INTO nearby_places (property_id, icon, name, distance) VALUES
(8, 'school',          'St. Stanislaus School',   '0.8 km'),
(8, 'local_hospital',  'Lilavati Hospital',        '1.5 km'),
(8, 'train',           'Bandra Railway Station',   '1.2 km'),
(8, 'local_mall',      'Linking Road Market',      '0.5 km'),
-- Property 1
(1, 'train',           'Worli Sea Face',            '0.3 km'),
(1, 'local_hospital',  'Hinduja Hospital',          '2.1 km'),
-- Property 5
(5, 'school',          'St. Andrews School',        '0.6 km'),
(5, 'local_mall',      'Palladium Mall',            '1.0 km'),
(5, 'train',           'Lower Parel Station',       '0.8 km')
ON CONFLICT DO NOTHING;

-- ── Popular searches ──────────────────────────────────────────
INSERT INTO popular_searches (query, count) VALUES
  ('2 BHK in Mumbai',       120),
  ('Flats in Bangalore',     98),
  ('Villa in Hyderabad',     76),
  ('1 BHK Pune',             65),
  ('Ready to Move Mumbai',   54),
  ('Gurugram Apartments',    43),
  ('Sea View Apartments',    39),
  ('IT Hub Properties',      31)
ON CONFLICT (query) DO UPDATE SET count = EXCLUDED.count;
