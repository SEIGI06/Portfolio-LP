// Configuration des APIs
const APIs = {
    // NewsAPI : https://newsapi.org/
    // 1. Créez un compte sur newsapi.org
    // 2. Choisissez le plan gratuit (100 requêtes par jour)
    // 3. Copiez votre clé API dans la variable ci-dessous
    newsApi: process.env.NEWS_API_KEY || '',

    // CoinGecko API : https://www.coingecko.com/en/api
    // Pas besoin de clé API pour l'utilisation basique
    // Limite : 10-50 requêtes par minute selon le plan
    cryptoApi: 'https://api.coingecko.com/api/v3',

    // CVE API : https://cve.circl.lu/
    // Pas besoin de clé API
    // Limite : 100 requêtes par heure
    cveApi: 'https://cve.circl.lu/api',

    // GitHub API : https://docs.github.com/en/rest
    // 1. Créez un compte GitHub si ce n'est pas déjà fait
    // 2. Allez dans Settings > Developer settings > Personal access tokens
    // 3. Générez un nouveau token avec les permissions 'repo' et 'read:user'
    // 4. Copiez le token dans la variable ci-dessous
    githubApi: process.env.GITHUB_TOKEN || ''
};

// Fonction pour gérer les erreurs CORS avec un proxy
const proxyUrl = 'https://api.allorigins.win/raw?url=';

// Chargement des actualités cybersécurité
async function loadCyberNews() {
    const container = document.getElementById('newsContent');
    
    try {
        const response = await fetch(`${proxyUrl}https://newsapi.org/v2/everything?q=cybersecurity&language=fr&sortBy=publishedAt&apiKey=${APIs.newsApi}`);
        const data = await response.json();

        if (data.status === 'error') {
            throw new Error(data.message);
        }

        let html = '';
        data.articles.slice(0, 5).forEach(article => {
            const date = new Date(article.publishedAt).toLocaleDateString('fr-FR');
            html += `
                <div class="news-item">
                    <div class="item-title">${article.title}</div>
                    <div class="item-meta">📰 ${article.source.name} • ${date}</div>
                    <div class="item-description">${article.description}</div>
                    <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">Lire l'article</a>
                </div>
            `;
        });

        container.innerHTML = html;
        document.getElementById('newsCount').textContent = data.articles.length;

    } catch (error) {
        container.innerHTML = `<div class="error">Erreur lors du chargement des actualités: ${error.message}</div>`;
    }
}

// Chargement des CVE récentes
async function loadCVEData() {
    const container = document.getElementById('cveContent');
    
    try {
        const response = await fetch(`${APIs.cveApi}/last`);
        const data = await response.json();

        let html = '';
        data.slice(0, 5).forEach(cve => {
            const severity = cve.cvss >= 9 ? 'high' : cve.cvss >= 7 ? 'medium' : 'low';
            const severityText = cve.cvss >= 9 ? 'CRITIQUE' : cve.cvss >= 7 ? 'ÉLEVÉ' : 'MOYEN';
            const date = new Date(cve.published).toLocaleDateString('fr-FR');
            
            html += `
                <div class="cve-item severity-${severity}">
                    <div class="item-title">${cve.id}</div>
                    <div class="item-meta">🎯 CVSS: ${cve.cvss}/10 (${severityText}) • ${date}</div>
                    <div class="item-description">${cve.summary}</div>
                    <a href="https://nvd.nist.gov/vuln/detail/${cve.id}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">Plus de détails</a>
                </div>
            `;
        });

        container.innerHTML = html;
        document.getElementById('cveCount').textContent = data.length;

    } catch (error) {
        container.innerHTML = `<div class="error">Erreur lors du chargement des CVE: ${error.message}</div>`;
    }
}

// Chargement des tendances tech
async function loadTechTrends() {
    const container = document.getElementById('trendsContent');
    
    try {
        const response = await fetch(`${APIs.githubApi}/search/repositories?q=stars:>1000&sort=stars&order=desc`);
        const data = await response.json();

        let html = '';
        data.items.slice(0, 5).forEach(repo => {
            html += `
                <div class="trend-item">
                    <div class="item-title">🚀 ${repo.full_name}</div>
                    <div class="item-meta">💻 ${repo.language} • ⭐ ${repo.stargazers_count.toLocaleString()} stars</div>
                    <div class="item-description">${repo.description}</div>
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">Voir le projet</a>
                </div>
            `;
        });

        container.innerHTML = html;
        document.getElementById('trendsCount').textContent = data.total_count;

    } catch (error) {
        container.innerHTML = `<div class="error">Erreur lors du chargement des tendances: ${error.message}</div>`;
    }
}

// Chargement des cryptomonnaies
async function loadCryptoData() {
    const container = document.getElementById('cryptoContent');
    
    try {
        const response = await fetch(`${APIs.cryptoApi}/simple/price?ids=bitcoin,ethereum,cardano,polkadot,chainlink&vs_currencies=eur&include_24hr_change=true`);
        const data = await response.json();

        const cryptoNames = {
            bitcoin: { name: 'Bitcoin', symbol: '₿' },
            ethereum: { name: 'Ethereum', symbol: 'Ξ' },
            cardano: { name: 'Cardano', symbol: 'ADA' },
            polkadot: { name: 'Polkadot', symbol: 'DOT' },
            chainlink: { name: 'Chainlink', symbol: 'LINK' }
        };

        let html = '';
        Object.entries(data).forEach(([id, info]) => {
            const crypto = cryptoNames[id];
            const change = info.eur_24h_change;
            const changeClass = change >= 0 ? 'positive' : 'negative';
            const changeSymbol = change >= 0 ? '+' : '';
            
            html += `
                <div class="crypto-item">
                    <div class="crypto-price">
                        <div>
                            <div class="item-title">${crypto.symbol} ${crypto.name}</div>
                            <div class="item-meta">💰 ${info.eur.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
                        </div>
                        <div class="price-change ${changeClass}">
                            ${changeSymbol}${change.toFixed(2)}%
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        document.getElementById('cryptoCount').textContent = Object.keys(data).length;

    } catch (error) {
        container.innerHTML = `<div class="error">Erreur lors du chargement des cryptomonnaies: ${error.message}</div>`;
    }
}

// Fonction pour actualiser toutes les données
function refreshAllData() {
    loadCyberNews();
    loadCVEData();
    loadTechTrends();
    loadCryptoData();
}

// Chargement initial
document.addEventListener('DOMContentLoaded', function() {
    refreshAllData();
    
    // Actualisation automatique toutes les 5 minutes
    setInterval(refreshAllData, 5 * 60 * 1000);
}); 