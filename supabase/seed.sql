INSERT INTO locations (
  slug, name_ro, name_en, description_en, lat, lng, category, weather_exposure,
  is_free_tier, video_path, thumb_path, zone_key, sort_order, taxi_fare_min, taxi_fare_max
) VALUES
(
  'stefan-cel-mare-park',
  'Parcul Stefan cel Mare',
  'Stefan cel Mare Central Park',
  'The green heart of Chisinau — perfect for a morning walk under century-old trees.',
  47.0245120, 28.8322920, 'park', 'outdoor', true,
  '/media/park.mp4', '/media/park-thumb.jpg', 'chisinau', 1, 45, 70
),
(
  'national-museum-history',
  'Muzeul National de Istorie',
  'National Museum of History',
  'Discover Moldova from ancient times to independence — air-conditioned and rain-proof.',
  47.0228000, 28.8285000, 'museum', 'indoor', true,
  '/media/museum.mp4', '/media/museum-thumb.jpg', 'chisinau', 2, 40, 65
),
(
  'milestii-mici-tasting',
  'Crama Milestii Mici (degustare)',
  'Milestii Mici Wine Tasting',
  'World''s largest wine cellar — book the classic tour, skip the overpriced souvenir sets.',
  46.9200000, 28.8200000, 'winery', 'indoor', true,
  '/media/winery.mp4', '/media/winery-thumb.jpg', 'chisinau', 3, 120, 180
),
(
  'cricova-cellars',
  'Cricova Underground City',
  'Cricova Underground Wine City',
  'Iconic underground galleries — go early, avoid weekend tourist buses.',
  47.1380000, 28.8610000, 'winery', 'indoor', false,
  '/media/cricova.mp4', '/media/cricova-thumb.jpg', 'chisinau', 4, 150, 220
),
(
  'orheiul-vechi',
  'Orheiul Vechi',
  'Orheiul Vechi Archaeological Complex',
  'Stunning cliff monastery and ancient cave settlements — allow half a day.',
  47.3050000, 28.9780000, 'landmark', 'mixed', false,
  '/media/orhei.mp4', '/media/orhei-thumb.jpg', 'orhei', 5, 350, 500
),
(
  'national-art-museum',
  'Muzeul National de Arta',
  'National Art Museum',
  'Moldovan masters and rotating exhibitions — ideal rainy-day culture fix.',
  47.0265000, 28.8300000, 'gallery', 'indoor', false,
  '/media/gallery.mp4', '/media/gallery-thumb.jpg', 'chisinau', 6, 40, 60
),
(
  'valea-morilor',
  'Parcul Valea Morilor',
  'Valea Morilor Park',
  'Lake, alleys, and open-air concerts — skip when heavy rain is forecast.',
  47.0180000, 28.8150000, 'park', 'outdoor', false,
  '/media/valea.mp4', '/media/valea-thumb.jpg', 'chisinau', 7, 50, 80
),
(
  'la-placinte-restaurant',
  'La Placinte (Piata Marii Adunari)',
  'La Placinte Traditional Restaurant',
  'Authentic placinte and regional dishes — order what locals order, not the tourist platter.',
  47.0280000, 28.8350000, 'restaurant', 'indoor', false,
  '/media/restaurant.mp4', '/media/restaurant-thumb.jpg', 'chisinau', 8, 35, 55
);

INSERT INTO culinary_items (location_id, dish_name_ro, dish_name_en, order_this, avoid_this, audio_path, sort_order)
SELECT id, 'Placinta cu branza', 'Cheese placinta',
  'Ask for fresh placinta cu branza — warm, not reheated. Pair with sour cream if offered.',
  'Avoid the pre-made "assorted placinte" platter aimed at tourists — smaller portions, higher price.',
  '/media/audio/placinta.mp3', 1
FROM locations WHERE slug = 'la-placinte-restaurant';

INSERT INTO culinary_items (location_id, dish_name_ro, dish_name_en, order_this, avoid_this, audio_path, sort_order)
SELECT id, 'Sarmale', 'Stuffed cabbage rolls',
  'Order sarmale in mamaliga sauce with smantana — house-made is best.',
  'Skip "international combo" menus that bundle sarmale with unrelated items at a markup.',
  '/media/audio/sarmale.mp3', 1
FROM locations WHERE slug = 'la-placinte-restaurant';

INSERT INTO culinary_items (location_id, dish_name_ro, dish_name_en, order_this, avoid_this, audio_path, sort_order)
SELECT id, 'Feteasca Neagra', 'Feteasca Neagra wine',
  'Request a glass of dry Feteasca Neagra from a local producer — staff can recommend by budget.',
  'Do not buy the gift-box "premium reserve" at checkout without tasting — often marked up for tourists.',
  '/media/audio/feteasca.mp3', 1
FROM locations WHERE slug = 'milestii-mici-tasting';

INSERT INTO culinary_items (location_id, dish_name_ro, dish_name_en, order_this, avoid_this, audio_path, sort_order)
SELECT id, 'Zeama', 'Zeama (chicken soup)',
  'Zeama with homemade noodles — the benchmark of Moldovan home cooking.',
  'Avoid "tourist lunch set" zeama served from bulk containers at peak hours.',
  '/media/audio/zeama.mp3', 1
FROM locations WHERE slug = 'national-museum-history';
