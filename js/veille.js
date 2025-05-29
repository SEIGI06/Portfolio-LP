// Configuration des APIs
const APIs = {
    newsApi: 'YOUR_NEWS_API_KEY', // À remplacer par votre clé
    cryptoApi: 'https://api.coingecko.com/api/v3',
    cveApi: 'https://cve.circl.lu/api',
    hackerNewsApi: 'https://hacker-news.firebaseio.com/v0'
};

// Fonction pour gérer les erreurs CORS avec un proxy
const proxyUrl = 'https://api.allorigins.win/raw?url=';

// Chargement des actualités cybersécurité
async function loadCyberNews() {
    const container = document.getElementById('newsContent');
    
    try {
        // Simulation de données car NewsAPI nécessite une clé
        const mockNews = [
            {
                title: "Nouvelle campagne de phishing visant les entreprises",
                description: "Les cybercriminels utilisent des techniques d'ingénierie sociale avancées...",
                publishedAt: new Date().toISOString(),
                source: { name: "CyberScoop" }
            },
            {
                title: "Mise à jour critique de sécurité pour Apache",
                description: "Une vulnérabilité critique découverte dans Apache HTTP Server...",
                publishedAt: new Date(Date.now() - 3600000).toISOString(),
                source: { name: "Security Week" }
            },
            {
                title: "Nouvelle réglementation NIS2 en Europe",
                description: "La directive NIS2 renforce les exigences de cybersécurité...",
                publishedAt: new Date(Date.now() - 7200000).toISOString(),
                source: { name: "ENISA" }
            }
        ];

        let html = '';
        mockNews.forEach(article => {
            const date = new Date(article.publishedAt).toLocaleDateString('fr-FR');
            html += `
                <div class="news-item">
                    <div class="item-title">${article.title}</div>
                    <div class="item-meta">📰 ${article.source.name} • ${date}</div>
                    <div class="item-description">${article.description}</div>
                </div>
            `;
        });

        container.innerHTML = html;
        document.getElementById('newsCount').textContent = mockNews.length;

    } catch (error) {
        container.innerHTML = `<div class="error">Erreur lors du chargement des actualités: ${error.message}</div>`;
    }
}

// Chargement des CVE récentes
async function loadCVEData() {
    const container = document.getElementById('cveContent');
    
    try {
        // Simulation de données CVE
        const mockCVEs = [
            {
                id: "CVE-2024-1234",
                summary: "Remote code execution in Apache Struts",
                cvss: 9.8,
                published: new Date().toISOString()
            },
            {
                id: "CVE-2024-5678",
                summary: "SQL injection vulnerability in WordPress plugin",
                cvss: 7.5,
                published: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: "CVE-2024-9012",
                summary: "Privilege escalation in Linux kernel",
                cvss: 6.2,
                published: new Date(Date.now() - 172800000).toISOString()
            }
        ];

        let html = '';
        mockCVEs.forEach(cve => {
            const severity = cve.cvss >= 9 ? 'high' : cve.cvss >= 7 ? 'medium' : 'low';
            const severityText = cve.cvss >= 9 ? 'CRITIQUE' : cve.cvss >= 7 ? 'ÉLEVÉ' : 'MOYEN';
            const date = new Date(cve.published).toLocaleDateString('fr-FR');
            
            html += `
                <div class="cve-item severity-${severity}">
                    <div class="item-title">${cve.id}</div>
                    <div class="item-meta">🎯 CVSS: ${cve.cvss}/10 (${severityText}) • ${date}</div>
                    <div class="item-description">${cve.summary}</div>
                </div>
            `;
        });

        container.innerHTML = html;
        document.getElementById('cveCount').textContent = mockCVEs.length;

    } catch (error) {
        container.innerHTML = `<div class="error">Erreur lors du chargement des CVE: ${error.message}</div>`;
    }
}

// Chargement des tendances tech
async function loadTechTrends() {
    const container = document.getElementById('trendsContent');
    
    try {
        // Simulation de tendances GitHub
        const mockTrends = [
            {
                name: "kubernetes/kubernetes",
                description: "Production-Grade Container Scheduling and Management",
                language: "Go",
                stars: 108000
            },
            {
                name: "microsoft/vscode",
                description: "Visual Studio Code",
                language: "TypeScript",
                stars: 159000
            },
            {
                name: "ansible/ansible",
                description: "Simple, agentless IT automation",
                language: "Python",
                stars: 61000
            }
        ];

        let html = '';
        mockTrends.forEach(repo => {
            html += `
                <div class="trend-item">
                    <div class="item-title">🚀 ${repo.name}</div>
                    <div class="item-meta">💻 ${repo.language} • ⭐ ${repo.stars.toLocaleString()} stars</div>
                    <div class="item-description">${repo.description}</div>
                </div>
            `;
        });

        container.innerHTML = html;
        document.getElementById('trendsCount').textContent = mockTrends.length;

    } catch (error) {
        container.innerHTML = `<div class="error">Erreur lors du chargement des tendances: ${error.message}</div>`;
    }
}

// Chargement des cryptomonnaies
async function loadCryptoData() {
    const container = document.getElementById('cryptoContent');
    
    try {
        // API CoinGecko gratuite
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