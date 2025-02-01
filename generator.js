const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

// 读取配置文件
function loadConfig() {
    try {
        const configFile = fs.readFileSync('config.yml', 'utf8');
        return yaml.load(configFile);
    } catch (e) {
        console.error('Error loading config file:', e);
        process.exit(1);
    }
}

// 生成导航菜单
function generateNavigation(navigation) {
    return navigation.map(nav => `
                <a href="#" class="nav-item${nav.active ? ' active' : ''}" data-page="${nav.id}">
                    <i class="${nav.icon}"></i>
                    <span>${nav.name}</span>
                </a>`).join('\n');
}

// 生成网站卡片HTML
function generateSiteCards(sites) {
    return sites.map(site => `
                        <a href="${site.url}" class="site-card">
                            <i class="${site.icon}"></i>
                            <h3>${site.name}</h3>
                            <p>${site.description}</p>
                        </a>`).join('\n');
}

// 生成分类HTML
function generateCategories(categories) {
    return categories.map(category => `
                <section class="category">
                    <h2><i class="${category.icon}"></i> ${category.name}</h2>
                    <div class="sites-grid">
                        ${generateSiteCards(category.sites)}
                    </div>
                </section>`).join('\n');
}

// 生成社交链接HTML
function generateSocialLinks(social) {
    return social.map(link => `
                <a href="${link.url}" class="nav-item" target="_blank">
                    <i class="${link.icon}"></i>
                    <span>${link.name}</span>
                </a>`).join('\n');
}

// 生成页面内容
function generatePageContent(pageId, data) {
    return `
                <div class="welcome-section">
                    <h2>${data.title}</h2>
                    <p class="subtitle">${data.subtitle}</p>
                </div>
                ${generateCategories(data.categories)}`;
}

// 生成搜索结果页面
function generateSearchResultsPage() {
    return `
            <!-- 搜索结果页 -->
            <div class="page" id="search-results">
                <div class="welcome-section">
                    <h2>搜索结果</h2>
                    <p class="subtitle">在所有页面中找到的匹配项</p>
                </div>

                <section class="category search-section" data-section="home" style="display: none;">
                    <h2><i class="fas fa-home"></i> 首页匹配项</h2>
                    <div class="sites-grid"></div>
                </section>

                <section class="category search-section" data-section="projects" style="display: none;">
                    <h2><i class="fas fa-project-diagram"></i> 项目匹配项</h2>
                    <div class="sites-grid"></div>
                </section>

                <section class="category search-section" data-section="articles" style="display: none;">
                    <h2><i class="fas fa-book"></i> 文章匹配项</h2>
                    <div class="sites-grid"></div>
                </section>

                <section class="category search-section" data-section="friends" style="display: none;">
                    <h2><i class="fas fa-users"></i> 朋友匹配项</h2>
                    <div class="sites-grid"></div>
                </section>
            </div>`;
}

// 生成完整的HTML
function generateHTML(config) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.site.title}</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="loading">
    <div class="layout">
        <!-- 左侧导航 -->
        <nav class="sidebar">
            <div class="logo">
                <h1>导航站</h1>
            </div>
            
            <div class="nav-section">
${generateNavigation(config.navigation)}
            </div>

            <div class="nav-section">
                <div class="section-title">在线账号</div>
${generateSocialLinks(config.social)}
            </div>
        </nav>

        <!-- 右侧内容区 -->
        <main class="content">
            <div class="search-box">
                <input type="text" id="search" placeholder="搜索...">
                <i class="fas fa-search"></i>
            </div>

            <!-- 首页 -->
            <div class="page active" id="home">
                <div class="welcome-section">
                    <h2>${config.profile.title}</h2>
                    <h3>${config.profile.subtitle}</h3>
                    <p class="subtitle">${config.profile.description}</p>
                </div>
${generateCategories(config.categories)}
            </div>

            <!-- 项目页 -->
            <div class="page" id="projects">
${generatePageContent('projects', config.projects)}
            </div>

            <!-- 文章页 -->
            <div class="page" id="articles">
${generatePageContent('articles', config.articles)}
            </div>

            <!-- 朋友页 -->
            <div class="page" id="friends">
${generatePageContent('friends', config.friends)}
            </div>
${generateSearchResultsPage()}
        </main>
    </div>
    <script src="script.js"></script>
</body>
</html>`;
}

// 主函数
function main() {
    const config = loadConfig();
    const html = generateHTML(config);
    
    try {
        fs.writeFileSync('index.html', html);
        console.log('Successfully generated index.html');
    } catch (e) {
        console.error('Error writing index.html:', e);
        process.exit(1);
    }
}

main(); 