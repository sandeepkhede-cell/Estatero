-- ============================================================
-- Estatero — Seed v2 (incremental, idempotent)
-- Pre-req: seed.sql + migrate_001_property_details.sql
-- Run:     psql $DATABASE_URL -f src/db/seed_v2.sql
-- ============================================================

-- ── 1. Populate new detail columns on existing properties ─────

UPDATE properties SET furnishing='fully-furnished', availability='ready-to-move', age_of_property='5-10 years',  rera_registered=TRUE,  rera_number='P51900028980'                           WHERE id=1;
UPDATE properties SET furnishing='semi-furnished',  availability='ready-to-move', age_of_property='1-5 years',   rera_registered=TRUE,  rera_number='PRM/KA/RERA/1251/446/PR/181011/002236'  WHERE id=2;
UPDATE properties SET furnishing='fully-furnished', availability='ready-to-move', age_of_property='5-10 years',  rera_registered=TRUE,  rera_number='P02400003267'                           WHERE id=3;
UPDATE properties SET furnishing='unfurnished',     availability='ready-to-move', age_of_property='1-5 years',   rera_registered=FALSE                                                        WHERE id=4;
UPDATE properties SET furnishing='fully-furnished', availability='ready-to-move', age_of_property='0-1 year',    rera_registered=TRUE,  rera_number='P51900029081'                           WHERE id=5;
UPDATE properties SET furnishing='fully-furnished', availability='ready-to-move', age_of_property='1-5 years',   rera_registered=TRUE,  rera_number='PRM/KA/RERA/1251/309/PR/191024/002765'  WHERE id=6;
UPDATE properties SET furnishing='fully-furnished', availability='ready-to-move', age_of_property='10+ years',   rera_registered=FALSE                                                        WHERE id=7;
UPDATE properties SET furnishing='semi-furnished',  availability='ready-to-move', age_of_property='5-10 years',  rera_registered=TRUE,  rera_number='P51900026508'                           WHERE id=8;
UPDATE properties SET furnishing='semi-furnished',  availability='ready-to-move', age_of_property='1-5 years',   rera_registered=TRUE,  rera_number='PRM/KA/RERA/1251/309/PR/200109/003001'  WHERE id=9;
UPDATE properties SET furnishing='fully-furnished', availability='ready-to-move', age_of_property='5-10 years',  rera_registered=TRUE,  rera_number='P51900007823'                           WHERE id=10;
UPDATE properties SET furnishing='unfurnished',     availability='ready-to-move', age_of_property='5-10 years',  rera_registered=FALSE                                                        WHERE id=11;
UPDATE properties SET furnishing='semi-furnished',  availability='under-construction', age_of_property='0-1 year', rera_registered=TRUE, rera_number='GGM/43/262/2018/31'                   WHERE id=12;
UPDATE properties SET furnishing='fully-furnished', availability='ready-to-move', age_of_property='5-10 years',  rera_registered=TRUE,  rera_number='GGM/43/156/2018/15'                    WHERE id=13;
UPDATE properties SET furnishing='unfurnished',     availability='ready-to-move', age_of_property='1-5 years',   rera_registered=FALSE                                                        WHERE id=14;
UPDATE properties SET furnishing='fully-furnished', availability='ready-to-move', age_of_property='5-10 years',  rera_registered=TRUE,  rera_number='P51900021983'                           WHERE id=15;

-- ── 2. New agents ─────────────────────────────────────────────

INSERT INTO users (id, name, email, password_hash, phone, role) VALUES
  (4, 'Neha Sharma',  'neha@estatero.in',   '$2b$10$placeholder_hash_4', '+91-9810002001', 'agent'),
  (5, 'Suresh Kumar', 'suresh@estatero.in', '$2b$10$placeholder_hash_5', '+91-9380002002', 'agent'),
  (6, 'Anita Das',    'anita@estatero.in',  '$2b$10$placeholder_hash_6', '+91-9830002003', 'agent')
ON CONFLICT (id) DO NOTHING;

INSERT INTO agents (id, user_id, agency_name, bio, profile_image, rating, listings_count) VALUES
  (4, 4, 'Delhi Premier Realty',
   'Expert in South and Central Delhi residential properties. 180+ successful deals over 10 years.',
   'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
   4.80, 15),
  (5, 5, 'Chennai Property Hub',
   'OMR, Anna Nagar, and T. Nagar specialist. Both residential and commercial properties.',
   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
   4.65, 11),
  (6, 6, 'East India Homes',
   'Kolkata and Noida specialist with 12+ years of experience across Eastern India.',
   'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
   4.70, 13)
ON CONFLICT (id) DO NOTHING;

SELECT setval('users_id_seq', 10);
SELECT setval('agents_id_seq', 10);

-- ── 3. New properties (IDs 21-46) ─────────────────────────────

INSERT INTO properties (
  id, title, description, price, price_per_sqft, emi,
  location, city, state,
  property_type, status, bedrooms, bathrooms, area_sqft,
  floor, total_floors, facing,
  furnishing, availability, age_of_property, rera_registered, rera_number,
  badge, badge_variant, is_verified, is_featured,
  agent_id
) VALUES

-- ── Delhi ─────────────────────────────────────────────────────
(21,
 'DLF Capital Greens, Moti Nagar',
 'Spacious 3 BHK in DLF Capital Greens with a beautiful garden view. Excellent connectivity to Connaught Place and New Delhi Railway Station. Club with pool and gym.',
 17500000, 9722, 120000,
 'Moti Nagar, Delhi', 'Delhi', 'Delhi',
 'apartment', 'for_sale', 3, 3, 1800,
 10, 22, 'North',
 'semi-furnished', 'ready-to-move', '5-10 years', TRUE, 'DLRRERA001234',
 NULL, 'primary', TRUE, FALSE, 4),

(22,
 'Ansal API Palam Vihar',
 'Well-maintained 2 BHK in a quiet Palam Vihar colony. Close to Dwarka Metro and local markets. Ample parking and park within society.',
 6500000, 5893, 44000,
 'Palam Vihar, Dwarka, Delhi', 'Delhi', 'Delhi',
 'apartment', 'for_sale', 2, 2, 1103,
 4, 10, 'East',
 'unfurnished', 'ready-to-move', '10+ years', FALSE, NULL,
 NULL, 'primary', FALSE, FALSE, 4),

(23,
 'Vasant Vihar Luxury Bungalow',
 'Stunning 5 BHK independent bungalow in the leafy greens of Vasant Vihar. Private garden, covered parking for 4 cars. Minutes from South Extension market and Vasant Kunj mall.',
 85000000, 28333, 584000,
 'Vasant Vihar, South Delhi', 'Delhi', 'Delhi',
 'villa', 'for_sale', 5, 5, 3000,
 NULL, NULL, 'South-West',
 'fully-furnished', 'ready-to-move', '10+ years', TRUE, 'DLRRERA005678',
 'FEATURED', 'primary', TRUE, TRUE, 4),

(24,
 'Saket District One, Phase 1',
 'Premium 4 BHK apartment with panoramic views in the iconic Saket District One. Rooftop infinity pool, concierge, and club. Walking distance to Select Citywalk mall.',
 55000000, 30556, 378000,
 'Saket, South Delhi', 'Delhi', 'Delhi',
 'apartment', 'for_sale', 4, 4, 1800,
 15, 20, 'West',
 'fully-furnished', 'ready-to-move', '1-5 years', TRUE, 'DLRRERA002345',
 'FEATURED', 'primary', TRUE, TRUE, 4),

(25,
 'Rohini Sector 9 — 2 BHK for Rent',
 'Affordable 2 BHK in a well-maintained society in Rohini. Metro connectivity, local markets nearby. Ideal for families looking for value in North Delhi.',
 28000, NULL, NULL,
 'Sector 9, Rohini, Delhi', 'Delhi', 'Delhi',
 'apartment', 'for_rent', 2, 1, 1000,
 3, 7, 'North',
 'semi-furnished', 'ready-to-move', '10+ years', FALSE, NULL,
 NULL, 'primary', FALSE, FALSE, 4),

-- ── Noida ─────────────────────────────────────────────────────
(26,
 'ATS Greens Village, Sector 93-A',
 'Spacious 3 BHK in ATS Greens Village — a meticulously planned township with 70% green cover. Close to Noida Expressway and Jaypee Golf Course.',
 11200000, 8000, 77000,
 'Sector 93-A, Noida', 'Noida', 'Uttar Pradesh',
 'apartment', 'for_sale', 3, 2, 1400,
 8, 14, 'North',
 'semi-furnished', 'ready-to-move', '5-10 years', TRUE, 'UPRERAPRJ009876',
 'Ready to Move', 'primary', TRUE, FALSE, 6),

(27,
 'Mahagun Moderne, Sector 78',
 'Contemporary 2 BHK in Mahagun Moderne with smart-home features and EV charging. Proximity to Sector 52 Metro station and Sector 18 market.',
 7800000, 7500, 53000,
 'Sector 78, Noida', 'Noida', 'Uttar Pradesh',
 'apartment', 'for_sale', 2, 2, 1040,
 5, 18, 'East',
 'unfurnished', 'under-construction', '0-1 year', TRUE, 'UPRERAPRJ011234',
 'New Launch', 'secondary', TRUE, FALSE, 6),

(28,
 'Gaur City 2, Sector 16C',
 'Compact 1 BHK in Gaur City 2 with swimming pool and club. Perfect for young IT professionals commuting to Noida Expressway tech parks.',
 3800000, 6333, 26000,
 'Sector 16C, Greater Noida West', 'Noida', 'Uttar Pradesh',
 'apartment', 'for_sale', 1, 1, 600,
 2, 12, 'South',
 'unfurnished', 'ready-to-move', '1-5 years', FALSE, NULL,
 NULL, 'primary', FALSE, FALSE, 6),

(29,
 'Fully Furnished PG, Sector 62',
 'Premium PG accommodation near Sector 62 office hub. All meals included. AC rooms, high-speed Wi-Fi, laundry, and 24/7 security. 5 min walk from office parks.',
 22000, NULL, NULL,
 'Sector 62, Noida', 'Noida', 'Uttar Pradesh',
 'apartment', 'pg', 1, 1, 300,
 4, 10, 'East',
 'fully-furnished', 'ready-to-move', '5-10 years', FALSE, NULL,
 NULL, 'primary', TRUE, FALSE, 6),

-- ── Chennai ───────────────────────────────────────────────────
(30,
 'Casagrand Supremus, OMR',
 'Elegant 3 BHK in Casagrand Supremus on OMR. Gated township with 40+ amenities including rooftop lounge, kids zone, and temple. Close to IT parks.',
 9500000, 7917, 65000,
 'Perumbakkam, OMR, Chennai', 'Chennai', 'Tamil Nadu',
 'apartment', 'for_sale', 3, 2, 1200,
 6, 16, 'East',
 'unfurnished', 'under-construction', '0-1 year', TRUE, 'TN/01/Building/0178/2022',
 'New Launch', 'secondary', TRUE, FALSE, 5),

(31,
 'Appaswamy Greensville, Sholinganallur',
 'Thoughtfully designed 2 BHK in a quiet avenue off Sholinganallur. Covered car park, generator backup, and landscaped garden within the complex.',
 7200000, 8000, 49000,
 'Sholinganallur, Chennai', 'Chennai', 'Tamil Nadu',
 'apartment', 'for_sale', 2, 2, 900,
 3, 8, 'West',
 'semi-furnished', 'ready-to-move', '1-5 years', TRUE, 'TN/01/Building/0254/2019',
 NULL, 'primary', TRUE, FALSE, 5),

(32,
 'Anna Nagar Luxe Villa',
 'Independent 4 BHK villa with private terrace garden in Anna Nagar East. Teak wood interiors, modular kitchen, and car porch. Close to VR Mall and Metro.',
 32000000, 17778, 220000,
 'Anna Nagar East, Chennai', 'Chennai', 'Tamil Nadu',
 'villa', 'for_sale', 4, 4, 1800,
 NULL, NULL, 'North-East',
 'fully-furnished', 'ready-to-move', '10+ years', FALSE, NULL,
 'FEATURED', 'primary', TRUE, TRUE, 5),

(33,
 'T. Nagar 2 BHK for Rent',
 'Bright and airy 2 BHK in the heart of T. Nagar. Walking distance to Panagal Park, shopping, and Mambalam Railway Station. Partially furnished.',
 28000, NULL, NULL,
 'T. Nagar, Chennai', 'Chennai', 'Tamil Nadu',
 'apartment', 'for_rent', 2, 2, 900,
 2, 5, 'North',
 'semi-furnished', 'ready-to-move', '5-10 years', FALSE, NULL,
 NULL, 'primary', FALSE, FALSE, 5),

(34,
 'PG for Working Women, Adyar',
 'Safe and comfortable PG for working women in Adyar. Furnished AC rooms, home-cooked meals, fast Wi-Fi, and 24/7 security. 10 min walk to Adyar bus depot.',
 12000, NULL, NULL,
 'Adyar, Chennai', 'Chennai', 'Tamil Nadu',
 'apartment', 'pg', 1, 1, 200,
 1, 4, NULL,
 'fully-furnished', 'ready-to-move', '5-10 years', FALSE, NULL,
 NULL, 'primary', TRUE, FALSE, 5),

-- ── Kolkata ───────────────────────────────────────────────────
(35,
 'Merlin Serenia, New Town',
 'Contemporary 3 BHK in Merlin Serenia Action Area II. Green building certified, imported fittings, and a large balcony with Eco Park views.',
 8200000, 6833, 56000,
 'Action Area II, New Town, Kolkata', 'Kolkata', 'West Bengal',
 'apartment', 'for_sale', 3, 2, 1200,
 7, 15, 'North-East',
 'semi-furnished', 'ready-to-move', '1-5 years', TRUE, 'WBRERA2022000123',
 NULL, 'primary', TRUE, FALSE, 6),

(36,
 'Unitech Garden Estate, Rajarhat',
 'Spacious 4 BHK in a premium gated township with cricket ground, gymnasium, and multiple swimming pools. Easy access to EM Bypass and New Town IT hub.',
 12000000, 8000, 82000,
 'Rajarhat, Kolkata', 'Kolkata', 'West Bengal',
 'apartment', 'for_sale', 4, 3, 1500,
 5, 12, 'East',
 'unfurnished', 'ready-to-move', '5-10 years', TRUE, 'WBRERA2018000456',
 NULL, 'primary', TRUE, FALSE, 6),

(37,
 'Salt Lake Sector V — 2 BHK for Rent',
 '2 BHK in the IT hub of Salt Lake Sector V. Office-ready connectivity. Freshly painted, unfurnished. Walking distance from multiple IT parks and cafeterias.',
 22000, NULL, NULL,
 'Sector V, Salt Lake, Kolkata', 'Kolkata', 'West Bengal',
 'apartment', 'for_rent', 2, 2, 950,
 3, 8, 'South',
 'unfurnished', 'ready-to-move', '10+ years', FALSE, NULL,
 NULL, 'primary', FALSE, FALSE, 6),

(38,
 'Ballygunge Heritage Apartment',
 'Rare 3 BHK in a well-maintained colonial-era building in Ballygunge. High ceilings, original mosaic flooring, large verandah. Walking distance to Lake Gardens.',
 18000000, 13333, 124000,
 'Ballygunge, Kolkata', 'Kolkata', 'West Bengal',
 'apartment', 'for_sale', 3, 2, 1350,
 2, 4, 'South-East',
 'semi-furnished', 'ready-to-move', '10+ years', FALSE, NULL,
 'FEATURED', 'primary', TRUE, TRUE, 6),

-- ── Ahmedabad ─────────────────────────────────────────────────
(39,
 'Shilaj Row House, SG Highway',
 'Modern 3 BHK row house with private garden and attached garage. Smart home automation, solar panels, and rainwater harvesting. Minutes from ISCON Mall.',
 13500000, 9000, 93000,
 'Shilaj, SG Highway, Ahmedabad', 'Ahmedabad', 'Gujarat',
 'villa', 'for_sale', 3, 3, 1500,
 NULL, NULL, 'East',
 'semi-furnished', 'ready-to-move', '1-5 years', TRUE, 'GJ/RERA/Project/00003456',
 NULL, 'primary', TRUE, FALSE, 5),

(40,
 'Bopal Heights, Prahlad Nagar',
 'Well-designed 2 BHK in Bopal Heights with good vastu orientation. Society gym, kids play area, and covered parking. Close to ISCON Mall and SG Highway.',
 5800000, 6444, 40000,
 'Bopal, Ahmedabad', 'Ahmedabad', 'Gujarat',
 'apartment', 'for_sale', 2, 2, 900,
 4, 9, 'North',
 'unfurnished', 'ready-to-move', '1-5 years', FALSE, NULL,
 NULL, 'primary', FALSE, FALSE, 5),

(41,
 'Maninagar 1 BHK for Rent',
 'Compact 1 BHK for rent in Maninagar. Suitable for couples. Close to Maninagar Railway Station and local markets. Basic appliances included.',
 12000, NULL, NULL,
 'Maninagar, Ahmedabad', 'Ahmedabad', 'Gujarat',
 'apartment', 'for_rent', 1, 1, 550,
 1, 5, 'East',
 'semi-furnished', 'ready-to-move', '5-10 years', FALSE, NULL,
 NULL, 'primary', FALSE, FALSE, 5),

-- ── More Mumbai ───────────────────────────────────────────────
(42,
 'Lokhandwala Complex, Andheri West',
 'Charming 2 BHK in the iconic Lokhandwala Complex. Semi-furnished with modular kitchen and wardrobes. Walking distance to cafes, metro, and Infiniti Mall.',
 14500000, 10357, 99000,
 'Andheri West, Mumbai', 'Mumbai', 'Maharashtra',
 'apartment', 'for_sale', 2, 2, 1400,
 9, 14, 'West',
 'semi-furnished', 'ready-to-move', '10+ years', FALSE, NULL,
 NULL, 'primary', TRUE, FALSE, 1),

(43,
 'Lodha Palava City, Dombivali',
 '1 BHK starter home in Lodha Palava — a planned city with schools, hospital, and retail. Ideal first home for young professionals. Under construction, possession in 12 months.',
 3900000, 6500, 27000,
 'Dombivali, Thane', 'Mumbai', 'Maharashtra',
 'apartment', 'for_sale', 1, 1, 600,
 6, 20, 'South',
 'unfurnished', 'under-construction', '0-1 year', TRUE, 'P51900043217',
 'New Launch', 'secondary', TRUE, FALSE, 1),

-- ── More Bangalore ────────────────────────────────────────────
(44,
 'Indiranagar 3 BHK — Fully Furnished',
 'Tastefully furnished 3 BHK for rent in the heart of Indiranagar. Walking distance to 100 Feet Road cafes and CMH Road metro station. Available immediately.',
 65000, NULL, NULL,
 '12th Main, Indiranagar, Bangalore', 'Bangalore', 'Karnataka',
 'apartment', 'for_rent', 3, 2, 1400,
 3, 6, 'North',
 'fully-furnished', 'ready-to-move', '5-10 years', FALSE, NULL,
 NULL, 'primary', TRUE, FALSE, 2),

-- ── More Hyderabad ────────────────────────────────────────────
(45,
 'Gachibowli 2 BHK — IT Corridor',
 'Freshly painted 2 BHK for rent near Gachibowli tech corridor. Walking distance from DLF Cyber City and Wipro offices. Unfurnished, ready to occupy.',
 28000, NULL, NULL,
 'Gachibowli, Hyderabad', 'Hyderabad', 'Telangana',
 'apartment', 'for_rent', 2, 2, 1050,
 2, 8, 'East',
 'unfurnished', 'ready-to-move', '1-5 years', FALSE, NULL,
 NULL, 'primary', FALSE, FALSE, 3),

-- ── More Pune ─────────────────────────────────────────────────
(46,
 'Kharadi IT Park Residences',
 'Strategically located 3 BHK for sale in Kharadi — Pune''s fastest growing IT suburb. Close to World Trade Center and EON IT Park. Under construction, possession in 12 months.',
 8800000, 7333, 60000,
 'Kharadi, Pune', 'Pune', 'Maharashtra',
 'apartment', 'for_sale', 3, 2, 1200,
 8, 16, 'North-West',
 'unfurnished', 'under-construction', '0-1 year', TRUE, 'P52100057834',
 'New Launch', 'secondary', TRUE, FALSE, 3)

ON CONFLICT (id) DO NOTHING;

SELECT setval('properties_id_seq', 50);

-- ── 4. Property images for new properties ─────────────────────
-- Rotating through the 8 image URLs already in the DB

INSERT INTO property_images (property_id, url, is_primary, sort_order) VALUES
(21, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMgaDO-11dlXemxUbZjYFZBlmu_MK6-QqJMHuvSLQRUHrKp0HfPqbXO47GJUn92vgFlG4EpBv9Yg5K7oey6T8zapKX_8rp_a_Mk7qmoTybgLMflfwgbN0EGymJ9Y4OFJ07vxGGpJQf7MEJLyYJaJW5thvV8lSKQrCp9rw1293ouDswSIc5ZX6LZbVIxqTOtKfNs4R7XTN--9a60qaTgBxM7h5moZDpliyto_GS4eA6YtFd7neNDvtDNn1DlYX_XtLiI79iTfBl5TI', TRUE, 0),
(22, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoAI3KNR8N3bPD7fkSTlTYyEPT_sliIIBVS12grRM3svfDowk2fGjS-jEhp-S9xy0haIR027JSkbYuJr85fPCf_jWoeA_JdRYgsr7wTwSMXx1OkjbxzYY4pTejZY02ZjJHR_4U9azh5Q1UMMSxdUrhglITaDQ5WoFtPfB0l-o6v35tEAgvqaBrRBZ1Cmh2VZafHFSWnrp_c_Ca7tMP9YQZxI4LioeXIT86fhCE1w45KIJOJamVcVuX16nrA05b-yXcQq4snOnWYxw', TRUE, 0),
(23, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-cwfopU4ruluVfxpVEGuUq5EHr-uugN_gR6k4T_pei8Bd-fE5wlHA5hVnFhUVwzlnWzV0ZJC-jVMORSxPaxZXayZ6Jxm_u-UOcyAnmiSit9Dop9NKshDWWjfkJmAWjOXE9Spget5Qj81T0v5gbWhAqlR7FiDBVQdn1INA36CbjJ0jNcPAog8tFjzBH-33WjO9J0uVTXIYHMmkH0prV87dCnUxyyHAGwQO_9plSupGv2k2Hk0S2Foy8_Uc2kMdAiiTpm2VkBN4y5A', TRUE, 0),
(24, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAA_79d2VJAnVfnBv-JyNvubVeF4ulFQBicztwjvIDX8Y916pXDf586ol5bi7WK0rn-HuqqIlY7yiht4cGezwR2KRARqEWvtb6N6xhuLZnIzK2PMhUrG36_CcM8rIR64ltuF7COG5-WZizmkYz3Z16SYnYR79un8JORk2vpIe9qqsp4WNaO1KsTFC90xZJECPXg69xnwm8mwj3Z1o1A0Yg9aq1FyJYCWQdc170cH4XFRKuyV5tL8DBf2Ha0KSvao_E3U8bGrZt9U4', TRUE, 0),
(25, 'https://lh3.googleusercontent.com/aida-public/AB6AXuABsPmnEGOKNVWjWa0b_Nbq81srgTDgOJmSUSyrXqXbdaKvJFi743wdlI2b-PzDTBmESwNV2yHriaTd2fHwR-smZl4WCCytylQ0ea9oRLr35kvWGDdOeh3z35PQdwxgvc9wXKqRBD0yF-R8UpB5XtaZtGN4LX2YpFnQO1zuDiVVSVga5Rd1HNFKmJehDYRys7VYcefRGI8Vjt9IT6L1EBq8MKXWkyEMVYhEZjUmPPP1-TBYuTCUvAY11FNjtn6QQ3A4npguKUE2YNc', TRUE, 0),
(26, 'https://lh3.googleusercontent.com/aida-public/AB6AXuByoqrvBLuWZiOAdhnL3inZHR5nrJUsd81-Q5cKzijmNn5N_DqKQh936H-cAol401laqHuKgiaU_RfFaMLfHOsZsaHAq8iLjZEEUh_sC5Ncvf5-FIfWU2vjlDQCF1S2VfUDTah3m_vyG0Lg6rGxYDAk91qMN7FCApGlaFlwc3r5PN3F0hA6Y8njUBuP6gbaIty04JR7DVq00FZHgsrxDdfM_MvRXd9DjlNDTOFHiDV0zgC6yU2Jjxeye29M7y1YOIKc3CM6xkyKekQ', TRUE, 0),
(27, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPmVeqyMaHguC3rJwXlrOf42_W0KmbLnJsgn23zKBVUdqXQY214wQS5PnSKM0xQZvbU89zNUJmGqqxbXKK7zUMvGFMohwhey7gPwLLvlO9oHKoG9SND3-GPBDPiUj1CtmWtmG-tog2wMeNFkYQpDke_i7_sIM2iOtJ3LKqfQpHM-dl83aBlldQalaAqjcjBm_7-jcF3Zkh28Yx3bJgMRPp2cdOg4v-hUsOKREH_ez0IigJ7H0_o-QGxfoSBlD5yG6enCaMYTXdwlg', TRUE, 0),
(28, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoAI3KNR8N3bPD7fkSTlTYyEPT_sliIIBVS12grRM3svfDowk2fGjS-jEhp-S9xy0haIR027JSkbYuJr85fPCf_jWoeA_JdRYgsr7wTwSMXx1OkjbxzYY4pTejZY02ZjJHR_4U9azh5Q1UMMSxdUrhglITaDQ5WoFtPfB0l-o6v35tEAgvqaBrRBZ1Cmh2VZafHFSWnrp_c_Ca7tMP9YQZxI4LioeXIT86fhCE1w45KIJOJamVcVuX16nrA05b-yXcQq4snOnWYxw', TRUE, 0),
(29, 'https://lh3.googleusercontent.com/aida-public/AB6AXuABsPmnEGOKNVWjWa0b_Nbq81srgTDgOJmSUSyrXqXbdaKvJFi743wdlI2b-PzDTBmESwNV2yHriaTd2fHwR-smZl4WCCytylQ0ea9oRLr35kvWGDdOeh3z35PQdwxgvc9wXKqRBD0yF-R8UpB5XtaZtGN4LX2YpFnQO1zuDiVVSVga5Rd1HNFKmJehDYRys7VYcefRGI8Vjt9IT6L1EBq8MKXWkyEMVYhEZjUmPPP1-TBYuTCUvAY11FNjtn6QQ3A4npguKUE2YNc', TRUE, 0),
(30, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAA_79d2VJAnVfnBv-JyNvubVeF4ulFQBicztwjvIDX8Y916pXDf586ol5bi7WK0rn-HuqqIlY7yiht4cGezwR2KRARqEWvtb6N6xhuLZnIzK2PMhUrG36_CcM8rIR64ltuF7COG5-WZizmkYz3Z16SYnYR79un8JORk2vpIe9qqsp4WNaO1KsTFC90xZJECPXg69xnwm8mwj3Z1o1A0Yg9aq1FyJYCWQdc170cH4XFRKuyV5tL8DBf2Ha0KSvao_E3U8bGrZt9U4', TRUE, 0),
(31, 'https://lh3.googleusercontent.com/aida-public/AB6AXuByoqrvBLuWZiOAdhnL3inZHR5nrJUsd81-Q5cKzijmNn5N_DqKQh936H-cAol401laqHuKgiaU_RfFaMLfHOsZsaHAq8iLjZEEUh_sC5Ncvf5-FIfWU2vjlDQCF1S2VfUDTah3m_vyG0Lg6rGxYDAk91qMN7FCApGlaFlwc3r5PN3F0hA6Y8njUBuP6gbaIty04JR7DVq00FZHgsrxDdfM_MvRXd9DjlNDTOFHiDV0zgC6yU2Jjxeye29M7y1YOIKc3CM6xkyKekQ', TRUE, 0),
(32, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-cwfopU4ruluVfxpVEGuUq5EHr-uugN_gR6k4T_pei8Bd-fE5wlHA5hVnFhUVwzlnWzV0ZJC-jVMORSxPaxZXayZ6Jxm_u-UOcyAnmiSit9Dop9NKshDWWjfkJmAWjOXE9Spget5Qj81T0v5gbWhAqlR7FiDBVQdn1INA36CbjJ0jNcPAog8tFjzBH-33WjO9J0uVTXIYHMmkH0prV87dCnUxyyHAGwQO_9plSupGv2k2Hk0S2Foy8_Uc2kMdAiiTpm2VkBN4y5A', TRUE, 0),
(33, 'https://lh3.googleusercontent.com/aida-public/AB6AXuABsPmnEGOKNVWjWa0b_Nbq81srgTDgOJmSUSyrXqXbdaKvJFi743wdlI2b-PzDTBmESwNV2yHriaTd2fHwR-smZl4WCCytylQ0ea9oRLr35kvWGDdOeh3z35PQdwxgvc9wXKqRBD0yF-R8UpB5XtaZtGN4LX2YpFnQO1zuDiVVSVga5Rd1HNFKmJehDYRys7VYcefRGI8Vjt9IT6L1EBq8MKXWkyEMVYhEZjUmPPP1-TBYuTCUvAY11FNjtn6QQ3A4npguKUE2YNc', TRUE, 0),
(34, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoAI3KNR8N3bPD7fkSTlTYyEPT_sliIIBVS12grRM3svfDowk2fGjS-jEhp-S9xy0haIR027JSkbYuJr85fPCf_jWoeA_JdRYgsr7wTwSMXx1OkjbxzYY4pTejZY02ZjJHR_4U9azh5Q1UMMSxdUrhglITaDQ5WoFtPfB0l-o6v35tEAgvqaBrRBZ1Cmh2VZafHFSWnrp_c_Ca7tMP9YQZxI4LioeXIT86fhCE1w45KIJOJamVcVuX16nrA05b-yXcQq4snOnWYxw', TRUE, 0),
(35, 'https://lh3.googleusercontent.com/aida-public/AB6AXuByoqrvBLuWZiOAdhnL3inZHR5nrJUsd81-Q5cKzijmNn5N_DqKQh936H-cAol401laqHuKgiaU_RfFaMLfHOsZsaHAq8iLjZEEUh_sC5Ncvf5-FIfWU2vjlDQCF1S2VfUDTah3m_vyG0Lg6rGxYDAk91qMN7FCApGlaFlwc3r5PN3F0hA6Y8njUBuP6gbaIty04JR7DVq00FZHgsrxDdfM_MvRXd9DjlNDTOFHiDV0zgC6yU2Jjxeye29M7y1YOIKc3CM6xkyKekQ', TRUE, 0),
(36, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPmVeqyMaHguC3rJwXlrOf42_W0KmbLnJsgn23zKBVUdqXQY214wQS5PnSKM0xQZvbU89zNUJmGqqxbXKK7zUMvGFMohwhey7gPwLLvlO9oHKoG9SND3-GPBDPiUj1CtmWtmG-tog2wMeNFkYQpDke_i7_sIM2iOtJ3LKqfQpHM-dl83aBlldQalaAqjcjBm_7-jcF3Zkh28Yx3bJgMRPp2cdOg4v-hUsOKREH_ez0IigJ7H0_o-QGxfoSBlD5yG6enCaMYTXdwlg', TRUE, 0),
(37, 'https://lh3.googleusercontent.com/aida-public/AB6AXuABsPmnEGOKNVWjWa0b_Nbq81srgTDgOJmSUSyrXqXbdaKvJFi743wdlI2b-PzDTBmESwNV2yHriaTd2fHwR-smZl4WCCytylQ0ea9oRLr35kvWGDdOeh3z35PQdwxgvc9wXKqRBD0yF-R8UpB5XtaZtGN4LX2YpFnQO1zuDiVVSVga5Rd1HNFKmJehDYRys7VYcefRGI8Vjt9IT6L1EBq8MKXWkyEMVYhEZjUmPPP1-TBYuTCUvAY11FNjtn6QQ3A4npguKUE2YNc', TRUE, 0),
(38, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCvg-7y1cCjXbXP9cJ3_l4O63TtetFFQt9Q12Kb4HTHVGsboSNBJENwMT6ot2ZYTMZbJK8QQ1n2UPhoKB37cflRkfondK7G0ufYOCQK-0sDTN90vZsp2nvySmwLzcYv_tIZQPOunUG7eUH0XyM4yCSv4erwhYW2dG5mgIeaprfSsVaSAMDsfciy0eA2NmqvD94iBG66141d04XIBK44QGEm-0-Uet41wayZnQlaTv6MPx4bkd7kAh18B1-UeQMCeHS2P53HBcHYAQ', TRUE, 0),
(39, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMgaDO-11dlXemxUbZjYFZBlmu_MK6-QqJMHuvSLQRUHrKp0HfPqbXO47GJUn92vgFlG4EpBv9Yg5K7oey6T8zapKX_8rp_a_Mk7qmoTybgLMflfwgbN0EGymJ9Y4OFJ07vxGGpJQf7MEJLyYJaJW5thvV8lSKQrCp9rw1293ouDswSIc5ZX6LZbVIxqTOtKfNs4R7XTN--9a60qaTgBxM7h5moZDpliyto_GS4eA6YtFd7neNDvtDNn1DlYX_XtLiI79iTfBl5TI', TRUE, 0),
(40, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoAI3KNR8N3bPD7fkSTlTYyEPT_sliIIBVS12grRM3svfDowk2fGjS-jEhp-S9xy0haIR027JSkbYuJr85fPCf_jWoeA_JdRYgsr7wTwSMXx1OkjbxzYY4pTejZY02ZjJHR_4U9azh5Q1UMMSxdUrhglITaDQ5WoFtPfB0l-o6v35tEAgvqaBrRBZ1Cmh2VZafHFSWnrp_c_Ca7tMP9YQZxI4LioeXIT86fhCE1w45KIJOJamVcVuX16nrA05b-yXcQq4snOnWYxw', TRUE, 0),
(41, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAA_79d2VJAnVfnBv-JyNvubVeF4ulFQBicztwjvIDX8Y916pXDf586ol5bi7WK0rn-HuqqIlY7yiht4cGezwR2KRARqEWvtb6N6xhuLZnIzK2PMhUrG36_CcM8rIR64ltuF7COG5-WZizmkYz3Z16SYnYR79un8JORk2vpIe9qqsp4WNaO1KsTFC90xZJECPXg69xnwm8mwj3Z1o1A0Yg9aq1FyJYCWQdc170cH4XFRKuyV5tL8DBf2Ha0KSvao_E3U8bGrZt9U4', TRUE, 0),
(42, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCvg-7y1cCjXbXP9cJ3_l4O63TtetFFQt9Q12Kb4HTHVGsboSNBJENwMT6ot2ZYTMZbJK8QQ1n2UPhoKB37cflRkfondK7G0ufYOCQK-0sDTN90vZsp2nvySmwLzcYv_tIZQPOunUG7eUH0XyM4yCSv4erwhYW2dG5mgIeaprfSsVaSAMDsfciy0eA2NmqvD94iBG66141d04XIBK44QGEm-0-Uet41wayZnQlaTv6MPx4bkd7kAh18B1-UeQMCeHS2P53HBcHYAQ', TRUE, 0),
(43, 'https://lh3.googleusercontent.com/aida-public/AB6AXuByoqrvBLuWZiOAdhnL3inZHR5nrJUsd81-Q5cKzijmNn5N_DqKQh936H-cAol401laqHuKgiaU_RfFaMLfHOsZsaHAq8iLjZEEUh_sC5Ncvf5-FIfWU2vjlDQCF1S2VfUDTah3m_vyG0Lg6rGxYDAk91qMN7FCApGlaFlwc3r5PN3F0hA6Y8njUBuP6gbaIty04JR7DVq00FZHgsrxDdfM_MvRXd9DjlNDTOFHiDV0zgC6yU2Jjxeye29M7y1YOIKc3CM6xkyKekQ', TRUE, 0),
(44, 'https://lh3.googleusercontent.com/aida-public/AB6AXuABsPmnEGOKNVWjWa0b_Nbq81srgTDgOJmSUSyrXqXbdaKvJFi743wdlI2b-PzDTBmESwNV2yHriaTd2fHwR-smZl4WCCytylQ0ea9oRLr35kvWGDdOeh3z35PQdwxgvc9wXKqRBD0yF-R8UpB5XtaZtGN4LX2YpFnQO1zuDiVVSVga5Rd1HNFKmJehDYRys7VYcefRGI8Vjt9IT6L1EBq8MKXWkyEMVYhEZjUmPPP1-TBYuTCUvAY11FNjtn6QQ3A4npguKUE2YNc', TRUE, 0),
(45, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPmVeqyMaHguC3rJwXlrOf42_W0KmbLnJsgn23zKBVUdqXQY214wQS5PnSKM0xQZvbU89zNUJmGqqxbXKK7zUMvGFMohwhey7gPwLLvlO9oHKoG9SND3-GPBDPiUj1CtmWtmG-tog2wMeNFkYQpDke_i7_sIM2iOtJ3LKqfQpHM-dl83aBlldQalaAqjcjBm_7-jcF3Zkh28Yx3bJgMRPp2cdOg4v-hUsOKREH_ez0IigJ7H0_o-QGxfoSBlD5yG6enCaMYTXdwlg', TRUE, 0),
(46, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAA_79d2VJAnVfnBv-JyNvubVeF4ulFQBicztwjvIDX8Y916pXDf586ol5bi7WK0rn-HuqqIlY7yiht4cGezwR2KRARqEWvtb6N6xhuLZnIzK2PMhUrG36_CcM8rIR64ltuF7COG5-WZizmkYz3Z16SYnYR79un8JORk2vpIe9qqsp4WNaO1KsTFC90xZJECPXg69xnwm8mwj3Z1o1A0Yg9aq1FyJYCWQdc170cH4XFRKuyV5tL8DBf2Ha0KSvao_E3U8bGrZt9U4', TRUE, 0)
ON CONFLICT DO NOTHING;

-- ── 5. Amenity links for new properties ───────────────────────
-- pool=1 gym=2 parking=3 security=4 elevator=5 wifi=6 ac=7 garden=8 club=9 power=10 laundry=11 kids=12

INSERT INTO property_amenities (property_id, amenity_id) VALUES
(21,1),(21,2),(21,3),(21,4),(21,5),(21,7),(21,9),
(22,3),(22,4),
(23,1),(23,3),(23,4),(23,8),(23,9),(23,10),
(24,1),(24,2),(24,3),(24,4),(24,5),(24,6),(24,7),(24,10),
(25,3),(25,4),
(26,1),(26,2),(26,3),(26,4),(26,8),(26,9),(26,12),
(27,2),(27,3),(27,4),(27,5),(27,10),
(28,1),(28,3),(28,4),(28,9),
(29,4),(29,6),(29,11),
(30,2),(30,3),(30,4),(30,5),(30,9),(30,12),
(31,3),(31,4),(31,8),(31,10),
(32,1),(32,3),(32,4),(32,8),
(33,3),(33,4),
(34,4),(34,6),(34,11),
(35,2),(35,3),(35,4),(35,5),(35,9),
(36,1),(36,2),(36,3),(36,4),(36,9),(36,12),
(37,3),(37,4),
(38,3),(38,4),(38,8),
(39,3),(39,4),(39,8),(39,10),
(40,2),(40,3),(40,4),(40,12),
(41,3),(41,4),
(42,2),(42,3),(42,4),(42,5),
(43,1),(43,2),(43,3),(43,4),(43,5),(43,9),(43,12),
(44,2),(44,3),(44,4),(44,6),(44,7),
(45,3),(45,4),(45,5),
(46,1),(46,2),(46,3),(46,4),(46,9),(46,12)
ON CONFLICT DO NOTHING;

-- ── 6. Nearby places for key new properties ───────────────────

INSERT INTO nearby_places (property_id, icon, name, distance) VALUES
(21, 'train',          'Moti Nagar Metro Station',   '0.4 km'),
(21, 'local_hospital', 'Deen Dayal Hospital',         '1.2 km'),
(21, 'school',         'DAV Public School',           '0.7 km'),
(24, 'local_mall',     'Select Citywalk Mall',        '0.3 km'),
(24, 'train',          'Saket Metro Station',         '0.5 km'),
(24, 'local_hospital', 'Fortis Escorts Hospital',     '1.0 km'),
(26, 'local_mall',     'Logix City Centre Mall',      '2.0 km'),
(26, 'train',          'Botanical Garden Metro',      '3.5 km'),
(26, 'school',         'Lotus Valley School',         '1.0 km'),
(30, 'school',         'Velammal School',             '0.8 km'),
(30, 'train',          'Perumbakkam Bus Depot',       '0.5 km'),
(30, 'local_mall',     'Phoenix Marketcity Mall',     '4.0 km'),
(32, 'train',          'Anna Nagar Metro Station',    '0.6 km'),
(32, 'local_mall',     'VR Mall Chennai',             '1.5 km'),
(35, 'local_mall',     'City Centre II Mall',         '1.5 km'),
(35, 'train',          'New Town Metro Station',      '0.8 km'),
(35, 'school',         'DPS New Town',                '1.2 km'),
(38, 'train',          'Rabindra Sarobar Metro',      '0.9 km'),
(38, 'local_mall',     'South City Mall',             '2.0 km'),
(39, 'local_mall',     'ISCON Mega Mall',             '2.5 km'),
(39, 'school',         'Udgam School',                '1.0 km'),
(46, 'train',          'Kharadi Bus Depot',           '0.5 km'),
(46, 'local_mall',     'World Trade Centre Pune',     '1.2 km')
ON CONFLICT DO NOTHING;

-- ── 7. Additional popular searches ────────────────────────────

INSERT INTO popular_searches (query, count) VALUES
  ('3 BHK in Delhi',            88),
  ('Flats in Noida',            72),
  ('Apartments in Chennai',     67),
  ('Property in Kolkata',       55),
  ('2 BHK Ahmedabad',           49),
  ('PG in Noida',               44),
  ('Furnished Flat for Rent',   38),
  ('Under Construction Noida',  32)
ON CONFLICT (query) DO UPDATE SET count = EXCLUDED.count;
