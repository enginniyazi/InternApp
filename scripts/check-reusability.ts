// scripts/check-reusability.ts
// This script enforces component reuse and architectural constraints.

import { Project } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

const ROOT_DIR = process.cwd();

// Find all components directories
const candidateDirs = [
  path.join(ROOT_DIR, 'apps', 'client', 'src', 'components'),
  path.join(ROOT_DIR, 'src', 'components'),
];

const componentDirs = candidateDirs.filter((d) => fs.existsSync(d));

if (componentDirs.length === 0) {
  console.log('ℹ️ Components directory not created yet, skipping component duplicate check.');
} else {
  // 1️⃣ Detect duplicate component implementations (identical file content)
  const readFileNorm = (p: string) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

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

  const allComponentFiles: string[] = [];
  componentDirs.forEach((dir) => {
    allComponentFiles.push(...getFilesRecursively(dir));
  });

  const duplicates: string[][] = [];
  for (let i = 0; i < allComponentFiles.length; i++) {
    const fileA = allComponentFiles[i];
    const contentA = readFileNorm(fileA);
    for (let j = i + 1; j < allComponentFiles.length; j++) {
      const fileB = allComponentFiles[j];
      const contentB = readFileNorm(fileB);
      if (contentA.trim() === contentB.trim()) {
        duplicates.push([fileA, fileB]);
      }
    }
  }

  if (duplicates.length > 0) {
    console.error('🚫 Duplicate component implementations found:');
    duplicates.forEach((pair) => console.error(`  - ${pair[0]} ↔ ${pair[1]}`));
    process.exit(1);
  }
}

const project = new Project({
  skipAddingFilesFromTsConfig: true,
});

// Load all ts/tsx source files across apps and src
project.addSourceFilesAtPaths([
  path.join(ROOT_DIR, 'apps', '*', 'src', '**/*.ts*'),
  path.join(ROOT_DIR, 'src', '**/*.ts*'),
]);

// 2️⃣ Verify import restrictions (no imports from pages into components, etc.)
const sourceFiles = project.getSourceFiles();
let importViolations = 0;
sourceFiles.forEach((sf) => {
  const filePath = sf.getFilePath();

  sf.getImportDeclarations().forEach((imp) => {
    const resolved = imp.getModuleSpecifierSourceFile();
    if (!resolved) return; // external packages
    const targetPath = resolved.getFilePath();
    // Restriction: components must not import from pages
    if (
      filePath.includes(`${path.sep}components${path.sep}`) &&
      targetPath.includes(`${path.sep}pages${path.sep}`)
    ) {
      console.error(
        `🚫 Import violation: Component ${path.relative(ROOT_DIR, filePath)} imports from page ${path.relative(ROOT_DIR, targetPath)}`
      );
      importViolations++;
    }
  });
});

if (importViolations > 0) {
  process.exit(1);
}

// 3️⃣ Detect circular imports (simple DFS)
const visited = new Set<string>();
const stack = new Set<string>();
let hasCycle = false;

function dfs(filePath: string) {
  if (stack.has(filePath)) {
    console.error(`🚫 Circular import detected involving ${path.relative(ROOT_DIR, filePath)}`);
    hasCycle = true;
    return;
  }
  if (visited.has(filePath)) return;
  visited.add(filePath);
  stack.add(filePath);
  const sf = project.getSourceFile(filePath);
  if (sf) {
    sf.getImportDeclarations().forEach((imp) => {
      const target = imp.getModuleSpecifierSourceFile();
      if (target && target.getFilePath().startsWith(ROOT_DIR)) {
        dfs(target.getFilePath());
      }
    });
  }
  stack.delete(filePath);
}

sourceFiles.forEach((sf) => dfs(sf.getFilePath()));
if (hasCycle) process.exit(1);

console.log('✅ Reusability and architectural checks passed.');
process.exit(0);
