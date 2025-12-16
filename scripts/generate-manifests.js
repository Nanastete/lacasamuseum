// scripts/generate-manifests.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate manifest files for content directories
 */
function generateManifests() {
  console.log('🔄 Generating content manifests...\n');
  
  const contentDir = path.join(__dirname, '../public/content');
  
  // Ensure content directory exists
  if (!fs.existsSync(contentDir)) {
    console.log('⚠️  Content directory does not exist, creating it...');
    fs.mkdirSync(contentDir, { recursive: true });
  }
  
  // Generate blog manifests
  generateBlogManifests(contentDir);
  
  // Generate museum manifests
  generateMuseumManifests(contentDir);
  
  console.log('\n✅ All manifests generated successfully!');
}

function generateBlogManifests(contentDir) {
  const blogDir = path.join(contentDir, 'blog');
  
  if (!fs.existsSync(blogDir)) {
    console.log('📁 Creating blog directory...');
    fs.mkdirSync(blogDir, { recursive: true });
  }
  
  ['en', 'es'].forEach(lang => {
    const langDir = path.join(blogDir, lang);
    
    if (!fs.existsSync(langDir)) {
      console.log(`📁 Creating blog/${lang} directory...`);
      fs.mkdirSync(langDir, { recursive: true });
    }
    
    // Read all files in the directory
    let allFiles = [];
    try {
      allFiles = fs.readdirSync(langDir);
    } catch (error) {
      console.log(`⚠️  Cannot read blog/${lang} directory`);
      allFiles = [];
    }
    
    // Filter only .md files and sort by date
    const files = allFiles
      .filter(file => {
        // Only .md files, exclude manifest.json and other files
        if (!file.endsWith('.md')) return false;
        
        // Check if file has content (not empty)
        try {
          const filePath = path.join(langDir, file);
          const stats = fs.statSync(filePath);
          return stats.size > 100; // File must have at least 100 bytes
        } catch {
          return false;
        }
      })
      .sort((a, b) => {
        // Sort by date (newest first) based on filename pattern: YYYY-MM-DD-slug.md
        const dateA = a.split('-').slice(0, 3).join('-');
        const dateB = b.split('-').slice(0, 3).join('-');
        return dateB.localeCompare(dateA);
      });
    
    const manifest = {
      files: files,
      count: files.length,
      lastUpdated: new Date().toISOString(),
      language: lang
    };
    
    const manifestPath = path.join(langDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.log(`📝 Blog (${lang}): ${files.length} posts`);
    if (files.length > 0) {
      console.log(`   Files: ${files.join(', ')}`);
    }
  });
}

function generateMuseumManifests(contentDir) {
  const museumDir = path.join(contentDir, 'museum');
  
  if (!fs.existsSync(museumDir)) {
    console.log('📁 Creating museum directory...');
    fs.mkdirSync(museumDir, { recursive: true });
  }
  
  ['en', 'es'].forEach(lang => {
    const langDir = path.join(museumDir, lang);
    
    if (!fs.existsSync(langDir)) {
      console.log(`📁 Creating museum/${lang} directory...`);
      fs.mkdirSync(langDir, { recursive: true });
    }
    
    // Read all files in the directory
    let allFiles = [];
    try {
      allFiles = fs.readdirSync(langDir);
    } catch (error) {
      console.log(`⚠️  Cannot read museum/${lang} directory`);
      allFiles = [];
    }
    
    // Filter only .md files
    const files = allFiles
      .filter(file => {
        // Only .md files, exclude manifest.json
        if (!file.endsWith('.md')) return false;
        
        // Check if file has content
        try {
          const filePath = path.join(langDir, file);
          const stats = fs.statSync(filePath);
          return stats.size > 100;
        } catch {
          return false;
        }
      })
      .sort();
    
    const manifest = {
      files: files,
      count: files.length,
      lastUpdated: new Date().toISOString(),
      language: lang
    };
    
    const manifestPath = path.join(langDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.log(`🏛️  Museum (${lang}): ${files.length} artworks`);
    if (files.length > 0) {
      console.log(`   Files: ${files.join(', ')}`);
    }
  });
}

// Run the script
try {
  generateManifests();
} catch (error) {
  console.error('❌ Error generating manifests:', error);
  process.exit(1);
}
