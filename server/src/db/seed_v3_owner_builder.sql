-- ============================================================
-- Estatero — Seed v3: Owner & Builder users + properties
-- Password for all: Agent@123
-- Run: psql $DATABASE_URL -f src/db/seed_v3_owner_builder.sql
-- ============================================================

-- ── 1. Owner users ───────────────────────────────────────────

INSERT INTO users (id, name, email, password_hash, phone, role) VALUES
  (12, 'Amit Verma',    'amit@estatero.in',   '$2b$10$DfcP3Ex2ug7j3y4HoXm1COE7DByq6y2dAxLU0okmJAgiUZMtxjDau', '+91-9820012001', 'owner'),
  (13, 'Sunita Rao',    'sunita@estatero.in', '$2b$10$DfcP3Ex2ug7j3y4HoXm1COE7DByq6y2dAxLU0okmJAgiUZMtxjDau', '+91-9845013002', 'owner'),
  (14, 'Ramesh Gupta',  'ramesh@estatero.in', '$2b$10$DfcP3Ex2ug7j3y4HoXm1COE7DByq6y2dAxLU0okmJAgiUZMtxjDau', '+91-9810014003', 'owner')
ON CONFLICT (id) DO NOTHING;

-- ── 2. Builder users ─────────────────────────────────────────

INSERT INTO users (id, name, email, password_hash, phone, role) VALUES
  (15, 'Lodha Developers',  'lodha@estatero.in',  '$2b$10$DfcP3Ex2ug7j3y4HoXm1COE7DByq6y2dAxLU0okmJAgiUZMtxjDau', '+91-2261215000', 'builder'),
  (16, 'Sobha Realty',      'sobha@estatero.in',  '$2b$10$DfcP3Ex2ug7j3y4HoXm1COE7DByq6y2dAxLU0okmJAgiUZMtxjDau', '+91-8067009000', 'builder')
ON CONFLICT (id) DO NOTHING;

SELECT setval('users_id_seq', (SELECT GREATEST(MAX(id), 1) FROM users));

-- ── 3. Agents profile rows ───────────────────────────────────
-- Owners: agency_name is NULL (private sellers)
-- Builders: agency_name = company name

INSERT INTO agents (id, user_id, agency_name, bio, profile_image, rating, listings_count) VALUES
  (12, 12, NULL,
   'Software engineer selling my own 3 BHK in Bandra West. All documents clear, no brokerage.',
   'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
   0.00, 0),
  (13, 13, NULL,
   'Koramangala homeowner — relocating to the US. Direct owner sale, zero commission.',
   'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
   0.00, 0),
  (14, 14, NULL,
   'Retired government officer selling ancestral property in Greater Kailash. Clear title, genuine sale.',
   'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
   0.00, 0),
  (15, 15, 'Lodha Developers',
   'One of India''s largest real estate developers with 40+ years of landmark projects across Mumbai, Pune, and Hyderabad.',
   'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80',
   4.85, 0),
  (16, 16, 'Sobha Realty',
   'Award-winning construction and real estate company known for quality and timely delivery across Bangalore, Pune, and Gurgaon.',
   'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80',
   4.78, 0)
ON CONFLICT (id) DO NOTHING;

SELECT setval('agents_id_seq', (SELECT GREATEST(MAX(id), 1) FROM agents));

-- ── 4. Owner properties (IDs 57–62) ─────────────────────────

INSERT INTO properties (
  id, title, description, price, price_per_sqft, emi,
  location, city, state,
  property_type, status, bedrooms, bathrooms, area_sqft,
  floor, total_floors, facing,
  furnishing, availability, age_of_property, rera_registered, rera_number,
  badge, badge_variant, is_verified, is_featured, listing_status,
  agent_id
) VALUES

-- Amit Verma (owner, Mumbai)
(57,
 'Owner Sale — 3 BHK Sea-View Flat, Bandra West',
 'Selling my own 3 BHK flat in a posh Bandra West society. Partial sea view from the balcony. Fully furnished with modular kitchen and wardrobes. All original documents ready. No brokerage — deal directly with owner.',
 28500000, 17813, 196000,
 'Hill Road, Bandra West, Mumbai', 'Mumbai', 'Maharashtra',
 'apartment', 'for_sale', 3, 3, 1600,
 8, 12, 'West',
 'fully-furnished', 'ready-to-move', '5-10 years', TRUE, 'P51900038762',
 'No Brokerage', 'secondary', TRUE, FALSE, 'active',
 12),

(58,
 'Owner — 2 BHK for Rent, Andheri East',
 'Renting out my 2 BHK in a well-maintained society in Andheri East. Minutes from Metro Line 1. Semi-furnished — AC, geyser, and kitchen appliances included. Owner occupies same building.',
 38000, NULL, NULL,
 'Marol, Andheri East, Mumbai', 'Mumbai', 'Maharashtra',
 'apartment', 'for_rent', 2, 2, 1050,
 4, 10, 'East',
 'semi-furnished', 'ready-to-move', '1-5 years', FALSE, NULL,
 'No Brokerage', 'secondary', FALSE, FALSE, 'active',
 12),

-- Sunita Rao (owner, Bangalore)
(59,
 'Direct Owner Sale — 2 BHK in Koramangala 4th Block',
 'Prime 2 BHK in Koramangala 4th Block — one of Bangalore''s most sought-after localities. Walking distance to Forum Mall and top restaurants. Fully furnished. Selling as I am relocating abroad.',
 12500000, 11364, 86000,
 '4th Block, Koramangala, Bangalore', 'Bangalore', 'Karnataka',
 'apartment', 'for_sale', 2, 2, 1100,
 3, 6, 'North',
 'fully-furnished', 'ready-to-move', '5-10 years', FALSE, NULL,
 'No Brokerage', 'secondary', TRUE, FALSE, 'active',
 13),

(60,
 'Owner — 1 BHK for Rent, Whitefield',
 'Freshly painted 1 BHK in Whitefield for rent. Close to ITPL Tech Park and Hope Farm Junction. Unfurnished — move in with your own furniture. Owner stays in the same complex.',
 18000, NULL, NULL,
 'Whitefield Main Road, Bangalore', 'Bangalore', 'Karnataka',
 'apartment', 'for_rent', 1, 1, 620,
 2, 8, 'South',
 'unfurnished', 'ready-to-move', '1-5 years', FALSE, NULL,
 'No Brokerage', 'secondary', FALSE, FALSE, 'active',
 13),

-- Ramesh Gupta (owner, Delhi)
(61,
 'Owner Sale — 4 BHK Villa, Greater Kailash I',
 'Selling our family villa in GK-1. Ground + first floor with a private garden and 3-car porch. Teak wood flooring, spacious rooms. All clear documents, ancestral property with mutation done. Direct deal with owner.',
 65000000, 21667, 447000,
 'M-Block, Greater Kailash I, Delhi', 'Delhi', 'Delhi',
 'villa', 'for_sale', 4, 4, 3000,
 NULL, NULL, 'South',
 'semi-furnished', 'ready-to-move', '10+ years', FALSE, NULL,
 'No Brokerage', 'secondary', TRUE, TRUE, 'active',
 14),

(62,
 'Owner — Residential Plot, Sector 150 Noida',
 '200 sq yd corner plot in Sector 150 Noida Expressway zone. Gated society with 24/7 security. Approved layout with electricity and water connection. Clear title, no legal disputes.',
 7200000, 4320, 49000,
 'Sector 150, Noida', 'Noida', 'Uttar Pradesh',
 'plot', 'for_sale', NULL, NULL, 1667,
 NULL, NULL, NULL,
 'unfurnished', 'ready-to-move', '0-1 year', TRUE, 'UPRERAPRJ021001',
 'Corner Plot', 'primary', FALSE, FALSE, 'active',
 14),

-- ── 5. Builder properties (IDs 63–68) ────────────────────────

-- Lodha Developers (builder, Mumbai)
(63,
 'Lodha Bellagio — 3 BHK Ultra Luxury, Powai',
 'Lodha Bellagio redefines luxury living in Powai. Sky-high ceilings, Italian marble flooring, and panoramic Powai Lake views. Resort-style amenities — infinity pool, concierge, private theatre, and fine dining within the complex. RERA registered, possession in 18 months.',
 32000000, 20000, 220000,
 'Powai, Mumbai', 'Mumbai', 'Maharashtra',
 'apartment', 'for_sale', 3, 3, 1600,
 22, 35, 'West',
 'unfurnished', 'under-construction', '0-1 year', TRUE, 'P51900048321',
 'New Launch', 'secondary', TRUE, TRUE, 'active',
 15),

(64,
 'Lodha Palava Lakeshore — 2 BHK Smart Home',
 'Part of Lodha Palava — India''s first smart city. 2 BHK with home automation, solar water heaters, and EV charging points. The township includes 4 schools, a hospital, and 100+ retail outlets. Under construction, possession Q3 2026.',
 6800000, 7556, 47000,
 'Dombivali East, Thane, Mumbai', 'Mumbai', 'Maharashtra',
 'apartment', 'for_sale', 2, 2, 900,
 9, 25, 'East',
 'unfurnished', 'under-construction', '0-1 year', TRUE, 'P51900051234',
 'Smart City', 'primary', TRUE, FALSE, 'active',
 15),

(65,
 'Lodha The Park — 3 BHK for Rent, Lower Parel',
 'Premium 3 BHK for rent in Lodha The Park, one of Mumbai''s finest addresses. Fully managed building with concierge, valet parking, housekeeping, and world-class club. Walking distance from Phoenix Mills and Lower Parel station.',
 175000, NULL, NULL,
 'Lower Parel, Mumbai', 'Mumbai', 'Maharashtra',
 'apartment', 'for_rent', 3, 3, 1800,
 30, 40, 'North-West',
 'fully-furnished', 'ready-to-move', '1-5 years', TRUE, 'P51900027456',
 'Premium', 'primary', TRUE, TRUE, 'active',
 15),

-- Sobha Realty (builder, Bangalore)
(66,
 'Sobha Dream Acres — 2 BHK, Panathur Road',
 'Sobha Dream Acres is a thoughtfully planned township of 6000 apartments near Panathur–ORR. 2 BHK with Sobha''s signature superior construction quality. Township amenities: 6 clubhouses, 9 swimming pools, and cricket ground. Possession in 12 months.',
 8500000, 8500, 58000,
 'Panathur Road, Marathahalli, Bangalore', 'Bangalore', 'Karnataka',
 'apartment', 'for_sale', 2, 2, 1000,
 7, 18, 'North-East',
 'unfurnished', 'under-construction', '0-1 year', TRUE, 'PRM/KA/RERA/1251/446/PR/210615/004320',
 'Township', 'primary', TRUE, FALSE, 'active',
 16),

(67,
 'Sobha Royal Pavilion — 3 BHK, Haralur Road',
 'Sobha Royal Pavilion offers premium 3 BHK villas and apartments inspired by British colonial architecture. Landscaped courts, private lawns, and a grand clubhouse. Minutes from Sarjapur Road tech corridor.',
 16500000, 11000, 113000,
 'Haralur Road, Sarjapur, Bangalore', 'Bangalore', 'Karnataka',
 'apartment', 'for_sale', 3, 3, 1500,
 4, 10, 'East',
 'unfurnished', 'ready-to-move', '1-5 years', TRUE, 'PRM/KA/RERA/1251/309/PR/200310/003890',
 'Ready to Move', 'primary', TRUE, TRUE, 'active',
 16),

(68,
 'Sobha City — 4 BHK Penthouse, Thanisandra',
 'Crowning jewel of Sobha City — a sprawling 4 BHK penthouse with a private terrace of 800 sqft. Unobstructed views of the city skyline, premium Italian fittings, and private lift lobby. Sobha''s most exclusive offering in North Bangalore.',
 42000000, 25000, 289000,
 'Thanisandra, North Bangalore', 'Bangalore', 'Karnataka',
 'penthouse', 'for_sale', 4, 5, 1680,
 28, 28, 'South-West',
 'unfurnished', 'ready-to-move', '0-1 year', TRUE, 'PRM/KA/RERA/1251/309/PR/220101/005100',
 'FEATURED', 'primary', TRUE, TRUE, 'active',
 16)

ON CONFLICT (id) DO NOTHING;

SELECT setval('properties_id_seq', (SELECT GREATEST(MAX(id), 1) FROM properties));

-- ── 6. Property images ────────────────────────────────────────

INSERT INTO property_images (property_id, url, is_primary, sort_order) VALUES
(57, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-cwfopU4ruluVfxpVEGuUq5EHr-uugN_gR6k4T_pei8Bd-fE5wlHA5hVnFhUVwzlnWzV0ZJC-jVMORSxPaxZXayZ6Jxm_u-UOcyAnmiSit9Dop9NKshDWWjfkJmAWjOXE9Spget5Qj81T0v5gbWhAqlR7FiDBVQdn1INA36CbjJ0jNcPAog8tFjzBH-33WjO9J0uVTXIYHMmkH0prV87dCnUxyyHAGwQO_9plSupGv2k2Hk0S2Foy8_Uc2kMdAiiTpm2VkBN4y5A', TRUE, 0),
(58, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoAI3KNR8N3bPD7fkSTlTYyEPT_sliIIBVS12grRM3svfDowk2fGjS-jEhp-S9xy0haIR027JSkbYuJr85fPCf_jWoeA_JdRYgsr7wTwSMXx1OkjbxzYY4pTejZY02ZjJHR_4U9azh5Q1UMMSxdUrhglITaDQ5WoFtPfB0l-o6v35tEAgvqaBrRBZ1Cmh2VZafHFSWnrp_c_Ca7tMP9YQZxI4LioeXIT86fhCE1w45KIJOJamVcVuX16nrA05b-yXcQq4snOnWYxw', TRUE, 0),
(59, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMgaDO-11dlXemxUbZjYFZBlmu_MK6-QqJMHuvSLQRUHrKp0HfPqbXO47GJUn92vgFlG4EpBv9Yg5K7oey6T8zapKX_8rp_a_Mk7qmoTybgLMflfwgbN0EGymJ9Y4OFJ07vxGGpJQf7MEJLyYJaJW5thvV8lSKQrCp9rw1293ouDswSIc5ZX6LZbVIxqTOtKfNs4R7XTN--9a60qaTgBxM7h5moZDpliyto_GS4eA6YtFd7neNDvtDNn1DlYX_XtLiI79iTfBl5TI', TRUE, 0),
(60, 'https://lh3.googleusercontent.com/aida-public/AB6AXuABsPmnEGOKNVWjWa0b_Nbq81srgTDgOJmSUSyrXqXbdaKvJFi743wdlI2b-PzDTBmESwNV2yHriaTd2fHwR-smZl4WCCytylQ0ea9oRLr35kvWGDdOeh3z35PQdwxgvc9wXKqRBD0yF-R8UpB5XtaZtGN4LX2YpFnQO1zuDiVVSVga5Rd1HNFKmJehDYRys7VYcefRGI8Vjt9IT6L1EBq8MKXWkyEMVYhEZjUmPPP1-TBYuTCUvAY11FNjtn6QQ3A4npguKUE2YNc', TRUE, 0),
(61, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCvg-7y1cCjXbXP9cJ3_l4O63TtetFFQt9Q12Kb4HTHVGsboSNBJENwMT6ot2ZYTMZbJK8QQ1n2UPhoKB37cflRkfondK7G0ufYOCQK-0sDTN90vZsp2nvySmwLzcYv_tIZQPOunUG7eUH0XyM4yCSv4erwhYW2dG5mgIeaprfSsVaSAMDsfciy0eA2NmqvD94iBG66141d04XIBK44QGEm-0-Uet41wayZnQlaTv6MPx4bkd7kAh18B1-UeQMCeHS2P53HBcHYAQ', TRUE, 0),
(62, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAA_79d2VJAnVfnBv-JyNvubVeF4ulFQBicztwjvIDX8Y916pXDf586ol5bi7WK0rn-HuqqIlY7yiht4cGezwR2KRARqEWvtb6N6xhuLZnIzK2PMhUrG36_CcM8rIR64ltuF7COG5-WZizmkYz3Z16SYnYR79un8JORk2vpIe9qqsp4WNaO1KsTFC90xZJECPXg69xnwm8mwj3Z1o1A0Yg9aq1FyJYCWQdc170cH4XFRKuyV5tL8DBf2Ha0KSvao_E3U8bGrZt9U4', TRUE, 0),
(63, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMgaDO-11dlXemxUbZjYFZBlmu_MK6-QqJMHuvSLQRUHrKp0HfPqbXO47GJUn92vgFlG4EpBv9Yg5K7oey6T8zapKX_8rp_a_Mk7qmoTybgLMflfwgbN0EGymJ9Y4OFJ07vxGGpJQf7MEJLyYJaJW5thvV8lSKQrCp9rw1293ouDswSIc5ZX6LZbVIxqTOtKfNs4R7XTN--9a60qaTgBxM7h5moZDpliyto_GS4eA6YtFd7neNDvtDNn1DlYX_XtLiI79iTfBl5TI', TRUE, 0),
(64, 'https://lh3.googleusercontent.com/aida-public/AB6AXuByoqrvBLuWZiOAdhnL3inZHR5nrJUsd81-Q5cKzijmNn5N_DqKQh936H-cAol401laqHuKgiaU_RfFaMLfHOsZsaHAq8iLjZEEUh_sC5Ncvf5-FIfWU2vjlDQCF1S2VfUDTah3m_vyG0Lg6rGxYDAk91qMN7FCApGlaFlwc3r5PN3F0hA6Y8njUBuP6gbaIty04JR7DVq00FZHgsrxDdfM_MvRXd9DjlNDTOFHiDV0zgC6yU2Jjxeye29M7y1YOIKc3CM6xkyKekQ', TRUE, 0),
(65, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAA_79d2VJAnVfnBv-JyNvubVeF4ulFQBicztwjvIDX8Y916pXDf586ol5bi7WK0rn-HuqqIlY7yiht4cGezwR2KRARqEWvtb6N6xhuLZnIzK2PMhUrG36_CcM8rIR64ltuF7COG5-WZizmkYz3Z16SYnYR79un8JORk2vpIe9qqsp4WNaO1KsTFC90xZJECPXg69xnwm8mwj3Z1o1A0Yg9aq1FyJYCWQdc170cH4XFRKuyV5tL8DBf2Ha0KSvao_E3U8bGrZt9U4', TRUE, 0),
(66, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPmVeqyMaHguC3rJwXlrOf42_W0KmbLnJsgn23zKBVUdqXQY214wQS5PnSKM0xQZvbU89zNUJmGqqxbXKK7zUMvGFMohwhey7gPwLLvlO9oHKoG9SND3-GPBDPiUj1CtmWtmG-tog2wMeNFkYQpDke_i7_sIM2iOtJ3LKqfQpHM-dl83aBlldQalaAqjcjBm_7-jcF3Zkh28Yx3bJgMRPp2cdOg4v-hUsOKREH_ez0IigJ7H0_o-QGxfoSBlD5yG6enCaMYTXdwlg', TRUE, 0),
(67, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-cwfopU4ruluVfxpVEGuUq5EHr-uugN_gR6k4T_pei8Bd-fE5wlHA5hVnFhUVwzlnWzV0ZJC-jVMORSxPaxZXayZ6Jxm_u-UOcyAnmiSit9Dop9NKshDWWjfkJmAWjOXE9Spget5Qj81T0v5gbWhAqlR7FiDBVQdn1INA36CbjJ0jNcPAog8tFjzBH-33WjO9J0uVTXIYHMmkH0prV87dCnUxyyHAGwQO_9plSupGv2k2Hk0S2Foy8_Uc2kMdAiiTpm2VkBN4y5A', TRUE, 0),
(68, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCvg-7y1cCjXbXP9cJ3_l4O63TtetFFQt9Q12Kb4HTHVGsboSNBJENwMT6ot2ZYTMZbJK8QQ1n2UPhoKB37cflRkfondK7G0ufYOCQK-0sDTN90vZsp2nvySmwLzcYv_tIZQPOunUG7eUH0XyM4yCSv4erwhYW2dG5mgIeaprfSsVaSAMDsfciy0eA2NmqvD94iBG66141d04XIBK44QGEm-0-Uet41wayZnQlaTv6MPx4bkd7kAh18B1-UeQMCeHS2P53HBcHYAQ', TRUE, 0)
ON CONFLICT DO NOTHING;

-- ── 7. Amenities ──────────────────────────────────────────────
-- pool=1 gym=2 parking=3 security=4 elevator=5 wifi=6 ac=7 garden=8 club=9 power=10 laundry=11 kids=12

INSERT INTO property_amenities (property_id, amenity_id) VALUES
-- owner properties (simpler amenities)
(57,2),(57,3),(57,4),(57,5),(57,7),(57,9),
(58,3),(58,4),(58,7),
(59,2),(59,3),(59,4),(59,5),
(60,3),(60,4),
(61,3),(61,4),(61,8),(61,10),
(62,3),(62,4),
-- builder properties (full amenities)
(63,1),(63,2),(63,3),(63,4),(63,5),(63,6),(63,7),(63,9),(63,10),(63,12),
(64,1),(64,2),(64,3),(64,4),(64,5),(64,9),(64,10),(64,12),
(65,1),(65,2),(65,3),(65,4),(65,5),(65,6),(65,7),(65,9),(65,11),
(66,1),(66,2),(66,3),(66,4),(66,5),(66,9),(66,12),
(67,1),(67,2),(67,3),(67,4),(67,8),(67,9),(67,10),
(68,1),(68,2),(68,3),(68,4),(68,5),(68,7),(68,9),(68,10)
ON CONFLICT DO NOTHING;

-- ── 8. Nearby places ─────────────────────────────────────────

INSERT INTO nearby_places (property_id, icon, name, distance) VALUES
(57, 'train',          'Bandra Railway Station',      '1.2 km'),
(57, 'local_mall',     'Linking Road Market',         '0.8 km'),
(57, 'local_hospital', 'Lilavati Hospital',           '1.5 km'),
(59, 'local_mall',     'Forum Mall Koramangala',      '0.4 km'),
(59, 'train',          'BTM Layout Bus Stand',        '0.6 km'),
(61, 'train',          'Greater Kailash Metro',       '0.7 km'),
(61, 'local_mall',     'DLF South Square Mall',       '1.2 km'),
(61, 'school',         'Delhi Public School',         '0.5 km'),
(63, 'local_mall',     'R City Mall',                 '2.5 km'),
(63, 'train',          'Powai Bus Depot',             '0.8 km'),
(63, 'school',         'Hiranandani Foundation School','0.6 km'),
(65, 'train',          'Lower Parel Station',         '0.3 km'),
(65, 'local_mall',     'Phoenix Mills',               '0.2 km'),
(67, 'train',          'Sarjapur Road Bus Stop',      '0.5 km'),
(67, 'school',         'Inventure Academy',           '1.0 km'),
(68, 'train',          'Hebbal Metro Station',        '2.5 km'),
(68, 'local_mall',     'Elements Mall',               '3.0 km')
ON CONFLICT DO NOTHING;

-- ── 9. Update listings_count for builders ────────────────────

UPDATE agents SET listings_count = (
  SELECT COUNT(*) FROM properties WHERE agent_id = agents.id AND listing_status = 'active'
) WHERE id IN (12, 13, 14, 15, 16);
