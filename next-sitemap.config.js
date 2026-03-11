module.exports = {
  siteUrl: ((process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.replace(/^https?:\/\/supplementdecoded\.com/i, "https://www.supplementdecoded.com")) || 'https://www.supplementdecoded.com'),
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: ['/admin', '/admin/*', '/api/*', '/draft/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/draft']
      }
    ],
    additionalSitemaps: [
      `${((process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.replace(/^https?:\/\/supplementdecoded\.com/i, "https://www.supplementdecoded.com")) || 'https://www.supplementdecoded.com')}/sitemap-posts.xml`,
      `${((process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.replace(/^https?:\/\/supplementdecoded\.com/i, "https://www.supplementdecoded.com")) || 'https://www.supplementdecoded.com')}/sitemap-pages.xml`
    ]
  },
  transform: async (config, path) => {
    let priority = 0.7;
    let changefreq = 'weekly';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.startsWith('/blog/')) {
      priority = 0.8;
      changefreq = 'monthly';
    } else if (path.startsWith('/category/')) {
      priority = 0.7;
      changefreq = 'weekly';
    } else if (path.startsWith('/tag/')) {
      priority = 0.5;
      changefreq = 'weekly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined
    };
  }
};
