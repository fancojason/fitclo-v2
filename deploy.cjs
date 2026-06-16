const fs = require('fs');
const https = require('https');

const TOKEN = process.env.GITHUB_TOKEN; // GitHub Token from environment variable
const REPO = 'fancojason/fitclo-v2';
const BRANCH = 'main';

async function request(method, path, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      port: 443,
      path,
      method,
      headers: {
        'Authorization': `token ${TOKEN}`,
        'User-Agent': 'Node.js',
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Request failed with status ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function deploy() {
  try {
    console.log('Fetching latest commit...');
    const branchInfo = await request('GET', `/repos/${REPO}/branches/${BRANCH}`);
    const lastCommitSha = branchInfo.commit.sha;
    const baseTreeSha = branchInfo.commit.commit.tree.sha;

    const files = [
      'src/layouts/BaseLayout.astro',
      'src/components/Header.astro',
      'src/components/Hero.astro',
      'src/components/Stats.astro',
      'src/components/InquiryForm.astro',
      'src/components/LiveProduction.astro',
      'src/components/ProductGrid.astro',
      'src/components/WholesaleSolutions.astro',
      'src/components/SampleCTA.astro',
      'src/components/BrandingOptions.astro',
      'src/components/FactoryAdvantage.astro',
      'src/components/WhyFitclo.astro',
      'src/components/Certifications.astro',
      'src/components/HowItWorks.astro',
      'src/components/Intelligence.astro',
      'src/components/Testimonials.astro',
      'src/components/GlobalPresence.astro',
      'src/components/TrustStats.astro',
      'src/components/BlogPosts.astro',
      'src/components/BlogIntelligence.astro',
      'src/components/Footer.astro',
      'src/components/AccessoriesBanner.astro',
      'src/components/FloatingButtons.astro',
      'src/components/ClientSuccess.astro',
      'astro.config.mjs',
      'src/pages/index.astro',
      'src/pages/about.astro',
      'src/pages/products.astro',
      'src/pages/ready-to-ship.astro',
      'src/pages/private-label.astro',
      'src/pages/capabilities.astro',
      'src/pages/contact.astro',
      'tailwind.config.mjs',
      'history_summary.md',
    ];

    console.log('Building tree...');
    const tree = [];
    for (const file of files) {
      if (fs.existsSync(file)) {
        tree.push({
          path: file,
          mode: '100644',
          type: 'blob',
          content: fs.readFileSync(file, 'utf8'),
        });
      }
    }

    const newTree = await request('POST', `/repos/${REPO}/git/trees`, {
      base_tree: baseTreeSha,
      tree,
    });

    console.log('Creating commit...');
    const newCommit = await request('POST', `/repos/${REPO}/git/commits`, {
      message: 'feat: sync subpage typography and add Activewear Intelligence section',
      tree: newTree.sha,
      parents: [lastCommitSha],
    });

    console.log('Updating reference...');
    await request('PATCH', `/repos/${REPO}/git/refs/heads/${BRANCH}`, {
      sha: newCommit.sha,
    });

    console.log('Deployment successful!');
  } catch (err) {
    console.error('Deployment failed:', err.message);
    process.exit(1);
  }
}

deploy();
