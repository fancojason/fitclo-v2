const fs = require('fs');
const https = require('https');
const path = require('path');

const TOKEN = process.env.GITHUB_TOKEN; // Use env var for security
const REPO = 'fancojason/fitclo-v2';
const BRANCH = 'main';

async function request(method, urlPath, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '20.205.243.168', // IP for api.github.com
      port: 443,
      path: urlPath,
      method,
      headers: {
        'Authorization': `token ${TOKEN}`,
        'User-Agent': 'Node.js',
        'Content-Type': 'application/json',
        'Host': 'api.github.com',
      },
      servername: 'api.github.com',
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

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
      }
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });
  return arrayOfFiles;
}

async function deploy() {
  try {
    console.log('Fetching latest commit...');
    const branchInfo = await request('GET', `/repos/${REPO}/branches/${BRANCH}`);
    const lastCommitSha = branchInfo.commit.sha;
    const baseTreeSha = branchInfo.commit.commit.tree.sha;

    console.log('Building tree from all local files...');
    const allLocalFiles = getAllFiles('.');
    const tree = [];

    // Filter and normalize paths for GitHub
    for (let filePath of allLocalFiles) {
      let relativePath = path.relative('.', filePath).replace(/\\/g, '/');
      
      // Skip certain files
      if (relativePath.startsWith('.accio') || relativePath === 'package-lock.json' || relativePath.startsWith('node_modules') || relativePath.startsWith('dist')) {
        continue;
      }

      if (fs.existsSync(filePath)) {
        tree.push({
          path: relativePath,
          mode: '100644',
          type: 'blob',
          content: fs.readFileSync(filePath, 'utf8'),
        });
      }
    }

    // Explicitly delete package-lock.json
    tree.push({
      path: 'package-lock.json',
      mode: '100644',
      type: 'blob',
      sha: null
    });

    console.log(`Uploading ${tree.length} items to tree...`);
    const newTree = await request('POST', `/repos/${REPO}/git/trees`, {
      base_tree: baseTreeSha,
      tree,
    });

    console.log('Creating commit...');
    const newCommit = await request('POST', `/repos/${REPO}/git/commits`, {
      message: 'fix: header syntax error and clean build v8',
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
