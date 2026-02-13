const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const xml2js = require('xml2js');

// Configuration
const SUPABASE_URL = "https://luetejjufuemdqpkcbrk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1ZXRlamp1ZnVlbWRxcGtjYnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyOTMwNzQsImV4cCI6MjA4Mjg2OTA3NH0.pxyT7Jva4ZyU5gCYaP1a30pSkN5dO9KMQL30lmA670I";
const SITEMAP_PATH = path.join(__dirname, '../sitemap.xml');
const BASE_URL = 'https://www.seigi-tech.fr';

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function generateSitemap() {
    console.log('🔄 Starting sitemap generation...');

    try {
        // 1. Fetch documentation slugs
        console.log('📡 Fetching documentations from Supabase...');
        const { data: docs, error } = await supabase
            .from('documentations')
            .select('slug, updated_at, created_at')
            .eq('is_published', true);

        if (error) throw error;
        console.log(`✅ Found ${docs.length} documentation articles.`);

        // 2. Read existing sitemap
        console.log('qm Reading existing sitemap.xml...');
        const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');
        const parser = new xml2js.Parser();
        const builder = new xml2js.Builder();

        const result = await parser.parseStringPromise(sitemapContent);
        
        // 3. Filter out existing dynamic URLs to avoid duplicates (clean start for dynamic part)
        // We keep static pages, remove old /doc/ entries
        const staticUrls = result.urlset.url.filter(url => !url.loc[0].includes('/doc/'));
        
        // 4. Create new URL entries
        const docUrls = docs.map(doc => {
            const lastMod = new Date(doc.updated_at || doc.created_at).toISOString().split('T')[0];
            return {
                loc: [`${BASE_URL}/doc/${doc.slug}`],
                lastmod: [lastMod],
                changefreq: ['weekly'],
                priority: ['0.7']
            };
        });

        // 5. Merge and rebuild
        result.urlset.url = [...staticUrls, ...docUrls];
        const newSitemap = builder.buildObject(result);

        // 6. Write back to file
        fs.writeFileSync(SITEMAP_PATH, newSitemap);
        console.log('💾 sitemap.xml updated successfully!');

    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
        process.exit(1);
    }
}

generateSitemap();
