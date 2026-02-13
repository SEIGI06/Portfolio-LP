const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const xml2js = require('xml2js');
const { ncp } = require('ncp');

// Configuration
const SUPABASE_URL = "https://luetejjufuemdqpkcbrk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1ZXRlamp1ZnVlbWRxcGtjYnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyOTMwNzQsImV4cCI6MjA4Mjg2OTA3NH0.pxyT7Jva4ZyU5gCYaP1a30pSkN5dO9KMQL30lmA670I";
const ROOT_DIR = path.join(__dirname, '..');
const SITEMAP_PATH = path.join(ROOT_DIR, 'sitemap.xml');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const BASE_URL = 'https://www.seigi-tech.fr';

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function build() {
    console.log('🚀 Starting build process...');

    try {
        // --- 1. SITEMAP GENERATION ---
        console.log('🔄 Generating sitemap...');
        console.log('📡 Fetching documentations from Supabase...');
        
        const { data: docs, error } = await supabase
            .from('documentations')
            .select('slug, updated_at, created_at')
            .eq('is_published', true);

        if (error) throw error;
        console.log(`✅ Found ${docs.length} documentation articles.`);

        console.log('qm Reading existing sitemap.xml...');
        const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');
        const parser = new xml2js.Parser();
        const builder = new xml2js.Builder();

        const result = await parser.parseStringPromise(sitemapContent);
        
        // Filter out existing dynamic URLs
        const staticUrls = result.urlset.url.filter(url => !url.loc[0].includes('/doc/'));
        
        // Create new URL entries
        const docUrls = docs.map(doc => {
            const lastMod = new Date(doc.updated_at || doc.created_at).toISOString().split('T')[0];
            return {
                loc: [`${BASE_URL}/doc/${doc.slug}`],
                lastmod: [lastMod],
                changefreq: ['weekly'],
                priority: ['0.7']
            };
        });

        // Merge and rebuild
        result.urlset.url = [...staticUrls, ...docUrls];
        const newSitemap = builder.buildObject(result);

        // Write updated sitemap to ROOT (will be copied later)
        fs.writeFileSync(SITEMAP_PATH, newSitemap);
        console.log('💾 sitemap.xml updated successfully!');


        // --- 2. COPY TO PUBLIC ---
        console.log('📂 Copying files to ./public directory...');

        // Create public dir if not exists
        if (!fs.existsSync(PUBLIC_DIR)){
            fs.mkdirSync(PUBLIC_DIR);
        }

        // Options for ncp
        const options = {
            filter: (source) => {
                const basename = path.basename(source);
                // Exclude hidden files/dirs, node_modules, public, scripts, and package files
                if (source.includes('node_modules') || 
                    source.includes('.git') || 
                    source.includes('.vercel') ||
                    basename === 'public' ||
                    basename === 'scripts' ||
                    basename === 'package.json' ||
                    basename === 'package-lock.json') {
                    return false;
                }
                return true;
            }
        };

        // Copy everything using ncp
        ncp(ROOT_DIR, PUBLIC_DIR, options, function (err) {
            if (err) {
                return console.error(err);
            }
            console.log('✅ Build completed! Files copied to ./public');
        });

    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

build();
