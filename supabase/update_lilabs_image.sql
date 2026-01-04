-- ============================================
-- UPDATE LILABS IMAGE TO LIVE SCREENSHOT
-- ============================================

UPDATE projects
SET image_url = 'https://image.thum.io/get/width/1200/crop/800/noanimate/https://lilabs-blog.vercel.app/'
WHERE slug = 'lilabs-blog';
