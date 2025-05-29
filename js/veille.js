// Configuration des APIs
const APIs = {
    // The Hacker News API
    hackerNewsApi: 'https://hacker-news.firebaseio.com/v0',

    // CoinGecko API : https://www.coingecko.com/en/api
    // Pas besoin de clé API pour l'utilisation basique
    // Limite : 10-50 requêtes par minute selon le plan
    cryptoApi: 'https://api.coingecko.com/api/v3',
};

// Fonction pour gérer les erreurs CORS avec un proxy
const proxyUrl = 'https://api.allorigins.win/raw?url=';

// Chargement des actualités cybersécurité
async function loadCyberNews() {
    const container = document.getElementById('newsContent');
    
    try {
        // Récupérer les IDs des 30 derniers articles
        const response = await fetch(`${APIs.hackerNewsApi}/topstories.json`);
        const storyIds = await response.json();

        // Récupérer les détails des 5 premiers articles
        const stories = await Promise.all(
            storyIds.slice(0, 5).map(id => 
                fetch(`${APIs.hackerNewsApi}/item/${id}.json`).then(res => res.json())
            )
        );

        let html = '';
        stories.forEach(story => {
            const date = new Date(story.time * 1000).toLocaleDateString('fr-FR');
            html += `
                <div class="news-item">
                    <div class="item-title">${story.title}</div>
                    <div class="item-meta">📰 ${story.by} • ${date} • ${story.score} points</div>
                    <div class="item-description">${story.url ? `Source: ${new URL(story.url).hostname}` : 'Discussion sur Hacker News'}</div>
                    <a href="${story.url || `https://news.ycombinator.com/item?id=${story.id}`}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">Lire l'article</a>
                </div>
            `;
        });

        container.innerHTML = html;
        document.getElementById('newsCount').textContent = stories.length;

    } catch (error) {
        container.innerHTML = `<div class="error">Erreur lors du chargement des actualités: ${error.message}</div>`;
    }
}

// Chargement des CVE récentes
/*
async function loadCVEData() {
    const container = document.getElementById('cveContent');
    
    try {
        const response = await fetch(`${APIs.cveApi}?resultsPerPage=5&pubStartDate=${getDateOneWeekAgo()}`);
        const data = await response.json();

        let html = '';
        data.vulnerabilities.forEach(cve => {
            const cvssScore = cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 
                            cve.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore || 0;
            const severity = cvssScore >= 9 ? 'high' : cvssScore >= 7 ? 'medium' : 'low';
            const severityText = cvssScore >= 9 ? 'CRITIQUE' : cvssScore >= 7 ? 'ÉLEVÉ' : 'MOYEN';
            const date = new Date(cve.published).toLocaleDateString('fr-FR');
            
            html += `
                <div class="cve-item severity-${severity}">
                    <div class="item-title">${cve.cve.id}</div>
                    <div class="item-meta">🎯 CVSS: ${cvssScore.toFixed(1)}/10 (${severityText}) • ${date}</div>
                    <div class="item-description">${cve.descriptions[0]?.value || 'Aucune description disponible'}</div>
                    <a href="https://nvd.nist.gov/vuln/detail/${cve.cve.id}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">Plus de détails</a>
                </div>
            `;
        });

        container.innerHTML = html;
        document.getElementById('cveCount').textContent = data.totalResults;

    } catch (error) {
        container.innerHTML = `<div class="error">Erreur lors du chargement des CVE: ${error.message}</div>`;
    }
}
*/

// Fonction utilitaire pour obtenir la date d'il y a une semaine
function getDateOneWeekAgo() {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
}

// Chargement des tendances tech (désactivé pour ne pas utiliser l'API GitHub avec clé)
/*
async function loadTechTrends() {
    const container = document.getElementById('trendsContent');
    
    try {
        // API GitHub nécessite une clé ou peut être limitée
        // const response = await fetch(`${APIs.githubApi}/search/repositories?q=stars:>1000&sort=stars&order=desc`);
        // const data = await response.json();

        // Simulation de données ou message d'indisponibilité
        let html = '';
        html += `<div class="loading">Tendances Tech non disponibles (API GitHub désactivée).</div>`;

        container.innerHTML = html;
        document.getElementById('trendsCount').textContent = '-'; // Afficher '-' ou '0'

    } catch (error) {
        container.innerHTML = `<div class="error">Erreur lors du chargement des tendances: ${error.message}</div>`;
    }
}
*/

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
    // loadCVEData(); // Supprimé
    // loadTechTrends(); // Désactivé
    loadCryptoData();
}

// Chargement initial
document.addEventListener('DOMContentLoaded', function() {
    refreshAllData();
    
    // Actualisation automatique toutes les 5 minutes
    setInterval(refreshAllData, 5 * 60 * 1000);
}); 