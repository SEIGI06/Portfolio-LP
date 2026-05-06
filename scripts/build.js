const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const xml2js = require('xml2js');
const { ncp } = require('ncp');

// Configuration
const SUPABASE_URL = "https://luetejjufuemdqpkcbrk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1ZXRlamp1ZnVlbWRxcGtjYnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyOTMwNzQsImV4cCI6MjA4Mjg2OTA3NH0.pxyT7Jva4ZyU5gCYaP1a30pSkN5dO9KMQL30lmA670I";
const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const SITEMAP_PATH = path.join(SRC_DIR, 'sitemap.xml');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const BASE_URL = 'https://www.seigi-tech.fr';

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function build() {
    console.log('🚀 Starting build process...');

    try {
        let docs = [];
        
        // --- 1. SITEMAP GENERATION ---
        try {
            console.log('🔄 Generating sitemap...');
            console.log('📡 Fetching documentations from Supabase...');
            
            const { data, error } = await supabase
                .from('documentations')
                .select('slug, title, excerpt, content, updated_at, created_at')
                .eq('is_published', true);

            if (error) throw error;
            docs = data;
            console.log(`✅ Found ${docs.length} documentation articles.`);

            console.log('📂 Reading source sitemap.xml...');
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

            // Write updated sitemap to SRC (it will be copied to public later)
            fs.writeFileSync(SITEMAP_PATH, newSitemap);
            console.log('💾 sitemap.xml updated in src/ successfully!');
        } catch (sitemapError) {
            console.warn('⚠️ Sitemap generation failed (Supabase unreachable). Using existing sitemap.');
            console.warn('   Details:', sitemapError.message);
        }


        // --- 2. COPY TO PUBLIC ---
        console.log('📂 Copying files from src/ to ./public directory...');

        // Create public dir if not exists
        if (!fs.existsSync(PUBLIC_DIR)){
            fs.mkdirSync(PUBLIC_DIR);
        }

        // Options for ncp
        const options = {
            filter: (source) => {
                const basename = path.basename(source);
                if (basename.startsWith('.') || 
                    basename === 'node_modules' || 
                    basename === 'scripts') {
                    return false;
                }
                return true;
            }
        };

        // Wrap ncp in a promise
        await new Promise((resolve, reject) => {
            ncp(SRC_DIR, PUBLIC_DIR, options, function (err) {
                if (err) reject(err);
                else resolve();
            });
        });
        console.log('✅ Build completed! Files copied to ./public');

        // --- 3. PRERENDER DOCUMENTATION PAGES FOR SEO ---
        console.log('📄 Prerendering documentation pages for SEO...');
        const docTemplatePath = path.join(PUBLIC_DIR, 'documentation.html');
        if (fs.existsSync(docTemplatePath)) {
            let docTemplate = fs.readFileSync(docTemplatePath, 'utf-8');
            
            const docDir = path.join(PUBLIC_DIR, 'doc');
            if (!fs.existsSync(docDir)){
                fs.mkdirSync(docDir);
            }

            docs.forEach(doc => {
                let pageHtml = docTemplate;
                
                // SEO: Title
                pageHtml = pageHtml.replace(
                    /<title>.*?<\/title>/,
                    `<title>${doc.title} | Documentation | Lilian Peyr</title>`
                );
                
                // SEO: Meta Description
                const excerpt = (doc.content || '').substring(0, 160).replace(/\n/g, ' ').replace(/"/g, '&quot;');
                pageHtml = pageHtml.replace(
                    /<meta name="description"\s+content="[^"]*">/,
                    `<meta name="description" content="${excerpt}">`
                );
                
                // SEO: Canonical URL
                pageHtml = pageHtml.replace(
                    /<link rel="canonical" href="https:\/\/www\.seigi-tech\.fr\/documentation" \/>/,
                    `<link rel="canonical" href="https://www.seigi-tech.fr/doc/${doc.slug}" />`
                );
                
                // SEO: Content Fallback in <noscript>
                const safeContent = (doc.content || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                const seoContent = `
                        <!-- SEO Prerendered Content -->
                        <noscript>
                            <div style="padding: 2rem; background: rgba(0,0,0,0.2); border-radius: var(--radius-lg); margin-top: 2rem;">
                                <h1>${doc.title}</h1>
                                <pre style="white-space: pre-wrap; font-family: inherit;">${safeContent}</pre>
                            </div>
                        </noscript>
                `;
                
                // Inject right after the loading text inside doc-container
                pageHtml = pageHtml.replace(
                    '<p class="loading" style="text-align: center;">Chargement des articles...</p>',
                    '<p class="loading" style="text-align: center;">Chargement des articles...</p>\n' + seoContent
                );

                const pagePath = path.join(docDir, `${doc.slug}.html`);
                fs.writeFileSync(pagePath, pageHtml);
            });
            console.log(`✅ Prerendered ${docs.length} documentation pages successfully!`);
        }

    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

build();
