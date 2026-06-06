// Mobile menu toggle
function toggleMenu() {
  const nav = document.getElementById('mobileNav');
  nav.classList.toggle('open');
}

// Close menu when clicking outside
document.addEventListener('click', function(e) {
  const nav = document.getElementById('mobileNav');
  const toggle = document.querySelector('.menu-toggle');
  if (!nav.contains(e.target) && !toggle.contains(e.target)) {
    nav.classList.remove('open');
  }
});

// Newsletter form
document.addEventListener('DOMContentLoaded', function() {
  const btn = document.querySelector('.nl-form button');
  const input = document.querySelector('.nl-form input');
  if (btn && input) {
    btn.addEventListener('click', function() {
      if (input.value && input.value.includes('@')) {
        btn.textContent = '✓ Subscribed!';
        btn.style.background = '#2E8B57';
        input.value = '';
        setTimeout(() => {
          btn.textContent = 'Subscribe';
          btn.style.background = '';
        }, 3000);
      } else {
        input.style.borderColor = '#D9211B';
        input.placeholder = 'Enter a valid email';
        setTimeout(() => {
          input.style.borderColor = '';
          input.placeholder = 'your@email.com';
        }, 2000);
      }
    });
  }
});

// ==========================================
// LIVE PULSE: NEWS & TRENDS CENTER LOGIC
// ==========================================

const API_URL = 'https://ok.surf/api/v1/cors/news-feed';
const CACHE_KEY = 'pulse_news_cache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Comprehensive fallback dataset in case the API is offline
const fallbackNews = {
  "Business": [
    {
      "title": "Kenya's inflation falls to 5.1% in May as food prices stabilize",
      "link": "https://example.com/kenya-inflation-may-2026",
      "og": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&q=80",
      "source": "Nairobi Business Daily",
      "source_icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.businessdailyafrica.com&size=96"
    },
    {
      "title": "Central Bank of Kenya maintains benchmark lending rate at 13.0%",
      "link": "https://example.com/cbk-lending-rate",
      "og": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&q=80",
      "source": "Central Bank of Kenya",
      "source_icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.centralbank.go.ke&size=96"
    },
    {
      "title": "Local startup raises KES 200M in Series A funding for green energy",
      "link": "https://example.com/green-energy-funding",
      "og": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&q=80",
      "source": "East African Chronicle",
      "source_icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.theeastafrican.co.ke&size=96"
    }
  ],
  "Technology": [
    {
      "title": "Safaricom expands 5G coverage to 25 more towns across Kenya",
      "link": "https://example.com/safaricom-5g-expansion",
      "og": "https://images.unsplash.com/photo-1562408590-e32931084e23?w=500&q=80",
      "source": "TechWeez",
      "source_icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://techweez.com&size=96"
    },
    {
      "title": "Nairobi-based agritech startup raises $5M to digitize crop supply chain",
      "link": "https://example.com/agritech-startup-5m",
      "og": "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=500&q=80",
      "source": "Disrupt Africa",
      "source_icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://disrupt-africa.com&size=96"
    },
    {
      "title": "Nairobi ranked top tech hub in East Africa by global innovation index",
      "link": "https://example.com/nairobi-top-tech-hub",
      "og": "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=500&q=80",
      "source": "Silicon Savannah News",
      "source_icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.standardmedia.co.ke&size=96"
    }
  ],
  "Entertainment": [
    {
      "title": "Kenya's Sauti Sol announce reunion tour starting in Nairobi",
      "link": "https://example.com/sauti-sol-reunion",
      "og": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&q=80",
      "source": "Pulse Kenya",
      "source_icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.pulselive.co.ke&size=96"
    },
    {
      "title": "Local drama series secures licensing deal with major global streaming network",
      "link": "https://example.com/local-drama-streaming-deal",
      "og": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80",
      "source": "Nairobi Wire",
      "source_icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://nairobiwire.com&size=96"
    },
    {
      "title": "Gengetone music hits global streaming charts for the first time in history",
      "link": "https://example.com/gengetone-global-charts",
      "og": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80",
      "source": "Standard Entertainment",
      "source_icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.standardmedia.co.ke&size=96"
    }
  ],
  "Health": [
    {
      "title": "Ministry of Health launches nationwide vaccine campaign targeting children",
      "link": "https://example.com/moh-vaccine-campaign",
      "og": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&q=80",
      "source": "Kenya Ministry of Health",
      "source_icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.health.go.ke&size=96"
    },
    {
      "title": "Mental health clinics see rising demand as urban lifestyle pressures grow",
      "link": "https://example.com/mental-health-clinics",
      "og": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80",
      "source": "Healthy Nation",
      "source_icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://nation.africa&size=96"
    }
  ],
  "Science": [
    {
      "title": "Astronomers in East Africa prepare for rare solar eclipse observation",
      "link": "https://example.com/east-africa-solar-eclipse",
      "og": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500&q=80",
      "source": "East African Academy",
      "source_icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.eaacademy.or.ke&size=96"
    },
    {
      "title": "Research study reveals new climate resilient maize varieties for dry areas",
      "link": "https://example.com/climate-resilient-maize",
      "og": "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500&q=80",
      "source": "KALRO Reports",
      "source_icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.kalro.org&size=96"
    }
  ],
  "Sports": [
    {
      "title": "Eliud Kipchoge gears up for Berlin Marathon, targeting new masters record",
      "link": "https://example.com/kipchoge-berlin-prep",
      "og": "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&q=80",
      "source": "Daily Nation Sports",
      "source_icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://nation.africa&size=96"
    },
    {
      "title": "Harambee Stars climb three spots in latest FIFA world rankings",
      "link": "https://example.com/harambee-stars-fifa-ranking",
      "og": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&q=80",
      "source": "Sports Kenya",
      "source_icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.sportsheritage.go.ke&size=96"
    }
  ],
  "US": [
    {
      "title": "Federal Reserve signals potential rate cuts as US economy cools down",
      "link": "https://example.com/us-fed-rate-cuts",
      "og": "https://images.unsplash.com/photo-1502920514313-52581002a659?w=500&q=80",
      "source": "Bloomberg News",
      "source_icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.bloomberg.com&size=96"
    }
  ],
  "World": [
    {
      "title": "United Nations climate summit adopts new global framework for carbon trading",
      "link": "https://example.com/un-climate-summit-carbon-trading",
      "og": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&q=80",
      "source": "Reuters",
      "source_icon": "https://encrypted-tbn0.gstatic.com/faviconV2?url=https://www.reuters.com&size=96"
    }
  ]
};

// Global State
let currentNewsData = null;
let activeCategory = 'All';
let activeSearchQuery = '';

// Predefined Trend Definitions linked to search keywords
const trendDefinitions = [
  { tag: "#SiliconSavannah", query: "Startup", category: "Technology", baseVolume: "14.5K", baseSurge: "+280%", trendDir: "up" },
  { tag: "#InflationWatch", query: "inflation", category: "Business", baseVolume: "22.1K", baseSurge: "+140%", trendDir: "up" },
  { tag: "#SautiSolReunion", query: "Sauti", category: "Entertainment", baseVolume: "38.9K", baseSurge: "+420%", trendDir: "up" },
  { tag: "#ClimateSummit", query: "climate", category: "World", baseVolume: "18.3K", baseSurge: "+85%", trendDir: "up" },
  { tag: "#KipchogeBerlin", query: "Kipchoge", category: "Sports", baseVolume: "25.4K", baseSurge: "+195%", trendDir: "up" },
  { tag: "#TechInsights", query: "5G", category: "Technology", baseVolume: "9.2K", baseSurge: "+110%", trendDir: "up" },
  { tag: "#MarketWatch", query: "Market", category: "Business", baseVolume: "31.2K", baseSurge: "+90%", trendDir: "up" },
  { tag: "#WellnessKE", query: "Mental", category: "Health", baseVolume: "16.8K", baseSurge: "-8%", trendDir: "down" }
];

// Fetch and load news
async function loadPulseHub() {
  const statusLabel = document.getElementById('live-status-label');
  const livePulseContainer = document.getElementById('live-pulse-container');
  
  try {
    // 1. Check LocalStorage Cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        currentNewsData = data;
        if (statusLabel) statusLabel.textContent = 'Cached (Updates every 5m)';
        initPulseModules();
        return;
      }
    }

    // 2. Fetch from Live API
    if (statusLabel) statusLabel.textContent = 'Syncing...';
    
    // We fetch with a 6-second timeout so it doesn't hang forever
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    
    const response = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error('API request failed');
    
    const data = await response.json();
    
    // Validate data structure
    if (data && typeof data === 'object' && Object.keys(data).length > 0) {
      currentNewsData = data;
      // Cache the result
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: data
      }));
      if (statusLabel) statusLabel.textContent = 'Live Feed';
    } else {
      throw new Error('Invalid data format received');
    }
  } catch (error) {
    console.warn('Live Pulse API error, loading offline backup:', error);
    
    // Fall back to expired cache if available
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data } = JSON.parse(cached);
      currentNewsData = data;
      if (statusLabel) statusLabel.textContent = 'Cached (Offline Mode)';
    } else {
      // Load fallbackNews
      currentNewsData = fallbackNews;
      if (statusLabel) {
        statusLabel.textContent = 'Offline Backup';
        // Add offline banner styling to status badge
        const badge = document.querySelector('.live-badge');
        if (badge) {
          badge.style.background = 'rgba(244, 163, 0, 0.15)';
          badge.style.color = '#F4A300';
          const dot = badge.querySelector('.live-dot');
          if (dot) dot.style.backgroundColor = '#F4A300';
        }
      }
      
      // Render an unobtrusive offline alert banner inside panel-news
      const panelNews = document.getElementById('panel-news');
      if (panelNews && !document.getElementById('offline-alert-banner')) {
        const banner = document.createElement('div');
        banner.id = 'offline-alert-banner';
        banner.className = 'offline-banner';
        banner.innerHTML = `
          <span class="offline-banner-dot"></span>
          <span><strong>Offline Mode:</strong> Nairobi Pulse Hub is running on pre-loaded archive news. Connect to the internet to load live headlines.</span>
        `;
        panelNews.insertBefore(banner, panelNews.firstChild);
      }
    }
  }

  initPulseModules();
}

function initPulseModules() {
  if (!currentNewsData) return;
  setupTicker(currentNewsData);
  renderCategories(currentNewsData);
  handleHashRoute();
  generateTrends(currentNewsData);
}

// 1. Dynamic News Ticker
function setupTicker(newsData) {
  const tickerText = document.getElementById('live-ticker-text');
  if (!tickerText) return;

  const headlines = [];
  // Grab titles from all available categories
  for (const cat in newsData) {
    newsData[cat].slice(0, 3).forEach(article => {
      headlines.push(article.title);
    });
  }

  if (headlines.length > 0) {
    tickerText.innerHTML = headlines.map(h => `${h} &nbsp;&nbsp;•&nbsp;&nbsp;`).join(' ');
  }
}

// 2. Switch Tab logic
function switchPulseTab(tabName) {
  // Toggle buttons
  const newsBtn = document.getElementById('tab-news-btn');
  const trendsBtn = document.getElementById('tab-trends-btn');
  const newsPanel = document.getElementById('panel-news');
  const trendsPanel = document.getElementById('panel-trends');

  if (tabName === 'news') {
    newsBtn.classList.add('active');
    trendsBtn.classList.remove('active');
    newsPanel.classList.add('active');
    trendsPanel.classList.remove('active');
  } else {
    newsBtn.classList.remove('active');
    trendsBtn.classList.add('active');
    newsPanel.classList.remove('active');
    trendsPanel.classList.add('active');
  }
}

// 3. Render Categories Pills
function renderCategories(newsData) {
  const catContainer = document.getElementById('pulse-categories');
  if (!catContainer) return;

  const categories = ['All', ...Object.keys(newsData)];
  catContainer.innerHTML = categories.map(cat => {
    const isActive = cat === 'All' ? 'active' : '';
    return `<button class="pulse-cat-btn ${isActive}" data-category="${cat}" onclick="setPulseCategory('${cat}')">${cat}</button>`;
  }).join('');
}

function setPulseCategory(category) {
  activeCategory = category;
  const btns = document.querySelectorAll('.pulse-cat-btn');
  btns.forEach(btn => {
    if (btn.dataset.category === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  renderLiveNews(category, activeSearchQuery);
}

// 4. Render Live News list
function renderLiveNews(category = 'All', searchQuery = '') {
  const grid = document.getElementById('pulse-news-grid');
  if (!grid || !currentNewsData) return;

  // Gather articles
  let articlesToRender = [];
  
  // Combine live articles and default fallback articles so search queries never return empty
  const categoriesToScan = category === 'All' ? Object.keys(currentNewsData) : [category];
  
  categoriesToScan.forEach(cat => {
    if (currentNewsData[cat]) {
      currentNewsData[cat].forEach(art => {
        articlesToRender.push({ ...art, categoryName: cat });
      });
    }
  });

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    articlesToRender = articlesToRender.filter(art => 
      art.title.toLowerCase().includes(query) || 
      art.source.toLowerCase().includes(query) ||
      art.categoryName.toLowerCase().includes(query)
    );
  }

  // If search results are empty, scan fallbackNews to match search queries as well
  if (articlesToRender.length === 0 && searchQuery) {
    const fallbackCats = category === 'All' ? Object.keys(fallbackNews) : [category];
    fallbackCats.forEach(cat => {
      if (fallbackNews[cat]) {
        fallbackNews[cat].forEach(art => {
          if (art.title.toLowerCase().includes(searchQuery) || art.source.toLowerCase().includes(searchQuery)) {
            articlesToRender.push({ ...art, categoryName: cat });
          }
        });
      }
    });
  }

  if (articlesToRender.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px var(--light); font-size: 15px;">
        <span style="font-size: 24px; display: block; margin-bottom: 8px;">🔍</span>
        No articles found matching "${searchQuery}". Try searching for something else.
      </div>
    `;
    return;
  }

  // Sort by category or randomly to keep it fresh
  grid.innerHTML = articlesToRender.map((art, idx) => {
    // Generate a fallback image based on unsplash keywords if og image is missing or Google News placeholder
    const imageSrc = art.og || `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&q=80`;
    const sourceIcon = art.source_icon || `https://www.google.com/s2/favicons?domain=${art.link}&sz=32`;
    
    // Escaping title single quotes for JS onclick call
    const escapedTitle = art.title.replace(/'/g, "\\'");
    const escapedSource = art.source.replace(/'/g, "\\'");
    const escapedDesc = (art.desc || "Read full coverage of this story directly on the source website. Click the link below to load the original publication.").replace(/'/g, "\\'");
    
    return `
      <div class="pulse-card" onclick="triggerDrawer('${escapedTitle}', '${escapedSource}', '${imageSrc}', '${art.link}', '${escapedDesc}')">
        <div class="pulse-card-img-wrap">
          <img src="${imageSrc}" alt="${art.title}" onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&q=80'" />
          <span class="pulse-card-badge">${art.categoryName}</span>
        </div>
        <div class="pulse-card-body">
          <div class="pulse-card-meta">
            <img class="pulse-source-icon" src="${sourceIcon}" onerror="this.src='https://www.google.com/s2/favicons?domain=google.com'" />
            <span>${art.source}</span>
          </div>
          <h3 class="pulse-card-title">${art.title}</h3>
          <div class="pulse-card-footer">
            <span class="meta">June 2026</span>
            <span class="pulse-read-btn">Read Info ➔</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterLiveNews() {
  const input = document.getElementById('pulse-search');
  if (input) {
    activeSearchQuery = input.value.trim().toLowerCase();
    renderLiveNews(activeCategory, activeSearchQuery);
  }
}

// 5. Dynamic Trends Generator
function generateTrends(newsData) {
  const trendsList = document.getElementById('pulse-trends-list');
  if (!trendsList) return;

  // Assign matches & ranks to predefined trends based on headlines
  const trends = trendDefinitions.map(trend => {
    let matchesCount = 0;
    const lowerQuery = trend.query.toLowerCase();
    
    for (const cat in newsData) {
      newsData[cat].forEach(art => {
        if (art.title.toLowerCase().includes(lowerQuery)) {
          matchesCount++;
        }
      });
    }
    
    // Also scan fallback news
    for (const cat in fallbackNews) {
      fallbackNews[cat].forEach(art => {
        if (art.title.toLowerCase().includes(lowerQuery)) {
          matchesCount++;
        }
      });
    }

    return {
      ...trend,
      matches: matchesCount
    };
  });

  // Sort trends: those with matches first, then by base volume
  trends.sort((a, b) => {
    if (b.matches !== a.matches) {
      return b.matches - a.matches;
    }
    return parseFloat(b.baseVolume) - parseFloat(a.baseVolume);
  });

  trendsList.innerHTML = trends.map((trend, index) => {
    const rank = index + 1;
    const isUp = trend.trendDir === 'up';
    const sparkline = generateSparklinePoints(isUp);
    const strokeColor = isUp ? 'var(--health)' : 'var(--light)';
    const gradientId = `sparkline-grad-${index}`;
    
    return `
      <div class="trend-item" onclick="handleTrendClick('${trend.query}')">
        <div class="trend-left">
          <span class="trend-rank">#0${rank}</span>
          <div class="trend-info">
            <span class="trend-tag">${trend.tag}</span>
            <span class="trend-category">Trending in ${trend.category}</span>
          </div>
        </div>
        
        <div class="trend-sparkline">
          <svg viewBox="0 0 120 40">
            <defs>
              <linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.15"/>
                <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <path d="${sparkline.areaD}" fill="url(#${gradientId})" />
            <path d="${sparkline.pathD}" class="sparkline-path" stroke="${strokeColor}" />
          </svg>
        </div>

        <div class="trend-right">
          <span class="trend-volume">${trend.baseVolume} searches</span>
          <span class="trend-surge ${isUp ? '' : 'down'}">${trend.baseSurge}</span>
        </div>
      </div>
    `;
  }).join('');
}

function generateSparklinePoints(isUp) {
  const points = [];
  let currentY = 25; // middle height of 40px
  
  for (let i = 0; i < 6; i++) {
    const x = i * 24; // 120 width divided by 5 segments
    let change = Math.floor(Math.random() * 12) - 6;
    
    if (isUp) {
      change += 2.5; // push trending graphs upwards
    } else {
      change -= 1.5; // pull trending down
    }
    
    currentY = Math.max(5, Math.min(35, currentY + change));
    points.push(`${x},${currentY}`);
  }
  
  const pathD = `M ` + points.join(' L ');
  const areaD = `${pathD} L 120,40 L 0,40 Z`;
  
  return { pathD, areaD };
}

function handleTrendClick(query) {
  // Set search bar input value
  const searchInput = document.getElementById('pulse-search');
  if (searchInput) {
    searchInput.value = query;
    activeSearchQuery = query.toLowerCase();
  }

  // Switch to news feed tab
  switchPulseTab('news');

  // Trigger search filter
  renderLiveNews(activeCategory, activeSearchQuery);
  
  // Scroll smoothly to the news grid
  const grid = document.getElementById('pulse-news-grid');
  if (grid) {
    grid.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// 6. Side Drawer for Article Previews
function triggerDrawer(title, source, image, link, desc) {
  const overlay = document.getElementById('articleDrawerOverlay');
  const drawer = document.getElementById('articleDrawer');
  const body = document.getElementById('drawerBody');
  const actionLink = document.getElementById('drawerOriginalLink');

  if (!overlay || !drawer || !body || !actionLink) return;

  // Clean elements
  body.innerHTML = `
    <div class="drawer-image-wrap">
      <img src="${image}" alt="${title}" onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=500&q=80'" />
    </div>
    <div class="drawer-meta">
      <div class="drawer-source">
        <img class="pulse-source-icon" src="https://www.google.com/s2/favicons?domain=${link}&sz=32" onerror="this.src='https://www.google.com/s2/favicons?domain=google.com'" />
        <span>${source}</span>
      </div>
      <span>·</span>
      <span>Live Preview</span>
    </div>
    <h1 class="drawer-title">${title}</h1>
    <p class="drawer-description">${desc}</p>
    <div style="background: var(--bg); border: 1px solid var(--border); padding: 12px 16px; border-radius: 6px; font-size: 13px; color: var(--light); line-height: 1.5; margin-top: 10px;">
      ℹ️ Click the button below to leave Nairobi Pulse and read the complete journalistic coverage directly on the original publisher's website.
    </div>
  `;

  actionLink.href = link;

  // Open Drawer
  overlay.classList.add('open');
  drawer.classList.add('open');
}

function closeArticleDrawer() {
  const overlay = document.getElementById('articleDrawerOverlay');
  const drawer = document.getElementById('articleDrawer');

  if (overlay && drawer) {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
  }
}

// Keyboard support to close modal/drawer
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeArticleDrawer();
  }
});

// Navigation Category Routing & Filtering
function filterCategory(navCategory) {
  const cat = navCategory.toLowerCase();
  
  // Update header titles to reflect selected filter
  const latestStoriesTitle = document.querySelector('.section .section-title');
  const trendingNowTitle = document.querySelector('.main-col .section-title');
  
  if (cat === 'home') {
    if (latestStoriesTitle) latestStoriesTitle.textContent = 'Latest Stories';
    if (trendingNowTitle) trendingNowTitle.textContent = 'Trending Now';
  } else {
    if (latestStoriesTitle) latestStoriesTitle.textContent = `Latest ${navCategory} Stories`;
    if (trendingNowTitle) trendingNowTitle.textContent = `Trending ${navCategory} Now`;
  }
  
  // Get sections we want to toggle visibility on
  const heroSection = document.querySelector('.hero');
  const heroMain = document.querySelector('.hero-main');
  const livePulse = document.getElementById('live-pulse-container');
  
  if (cat === 'home' || cat === 'news') {
    // Restore default layouts
    if (heroSection) heroSection.style.display = '';
    if (heroMain) heroMain.style.display = '';
    if (livePulse) livePulse.style.display = '';
    
    // Show all side cards, grid cards, and list cards
    document.querySelectorAll('.side-card, .card, .list-card').forEach(el => {
      el.style.display = '';
    });
    
    if (cat === 'news') {
      // In Live Pulse, reset back to All
      setPulseCategory('All');
    }
  } else {
    // Specific Categories: Tech, Lifestyle, Entertainment, Health
    
    // 1. Live Pulse behavior (Lifestyle doesn't have live news)
    if (cat === 'lifestyle') {
      if (livePulse) livePulse.style.display = 'none';
    } else {
      if (livePulse) {
        livePulse.style.display = '';
        const apiCatMap = {
          'tech': 'Technology',
          'entertainment': 'Entertainment',
          'health': 'Health'
        };
        if (apiCatMap[cat]) {
          setPulseCategory(apiCatMap[cat]);
        }
      }
    }
    
    // 2. Hero Section: Only show hero when it's Tech (since main hero story is Tech)
    if (cat === 'tech') {
      if (heroSection) heroSection.style.display = '';
      if (heroMain) heroMain.style.display = '';
    } else {
      if (heroSection) heroSection.style.display = 'none';
    }
    
    // 3. Filter all cards based on category-badge class names
    const badgeMap = {
      'tech': 'tech',
      'lifestyle': 'lifestyle',
      'entertainment': 'ent',
      'health': 'health'
    };
    
    const targetBadgeClass = badgeMap[cat];
    
    document.querySelectorAll('.side-card, .card, .list-card').forEach(el => {
      const badge = el.querySelector('.category-badge');
      if (badge && badge.classList.contains(targetBadgeClass)) {
        el.style.display = ''; // Revert to default stylesheet display
      } else {
        el.style.display = 'none';
      }
    });
  }
}

// Function to synchronize and activate nav links in header (desktop & mobile)
function activateNavElement(hash) {
  const hashVal = hash || '#home';
  
  // Desktop navigation
  document.querySelectorAll('nav a').forEach(a => {
    if (a.getAttribute('href') === hashVal) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });

  // Mobile navigation
  document.querySelectorAll('.mobile-nav a').forEach(a => {
    if (a.getAttribute('href') === hashVal) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}

// Route handler called on hashchange and initial load
function handleHashRoute() {
  const hash = window.location.hash || '#home';
  activateNavElement(hash);
  
  const categoryMap = {
    '#home': 'Home',
    '#news': 'News',
    '#lifestyle': 'Lifestyle',
    '#tech': 'Tech',
    '#entertainment': 'Entertainment',
    '#health': 'Health'
  };
  
  const categoryName = categoryMap[hash] || 'Home';
  filterCategory(categoryName);
  
  // Auto-close mobile nav menu on item click
  const mobileNav = document.getElementById('mobileNav');
  if (mobileNav) {
    mobileNav.classList.remove('open');
  }
}

// Register hashchange listener
window.addEventListener('hashchange', handleHashRoute);

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  loadPulseHub();
});
