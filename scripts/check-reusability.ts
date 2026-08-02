import * as fs from 'fs';
import * as path from 'path';

// Enforce architecture boundaries:
// 1. Components must NOT import from `src/pages` (or circular page imports)
// 2. Component names and implementations should not be duplicated across candidate folders

const candidateDirs = [
  path.join(__dirname, '../apps/client/src/components'),
  path.join(__dirname, '../src/components'),
];

const componentDirs = candidateDirs.filter((d) => fs.existsSync(d));

function getFilesRecursively(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      results.push(filePath);
    }
  });
  return results;
}

if (componentDirs.length === 0) {
  console.log('ℹ️ Components directory not created yet, skipping component duplicate check.');
} else {
  // 1️⃣ Detect duplicate component implementations (identical file content)
  const readFileNorm = (p: string) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

  const allFiles = componentDirs.flatMap((d) => getFilesRecursively(d));
  const contentsMap = new Map<string, string[]>();

  allFiles.forEach((f) => {
    const content = readFileNorm(f);
    const existing = contentsMap.get(content) || [];
    existing.push(f);
    contentsMap.set(content, existing);
  });

  let hasDuplicates = false;
  contentsMap.forEach((paths, content) => {
    if (paths.length > 1 && content.trim().length > 50) {
      console.error(
        `❌ Duplicate component implementation found in files:\n${paths.map((p) => `   - ${p}`).join('\n')}`
      );
      hasDuplicates = true;
    }
  });

  // 2️⃣ Check illegal imports from pages
  let hasIllegalImports = false;
  allFiles.forEach((f) => {
    const content = readFileNorm(f);
    if (content.match(/from\s+['"].*\/pages\/.*['"]/)) {
      console.error(`❌ Illegal import from pages directory in component: ${f}`);
      hasIllegalImports = true;
    }
  });

  if (hasDuplicates || hasIllegalImports) {
    process.exit(1);
  }
}

console.log('✅ Reusability and architectural checks passed.');
