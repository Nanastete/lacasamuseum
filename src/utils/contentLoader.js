// src/utils/contentLoader.js
import matter from 'gray-matter';

/**
 * Fetch a markdown file from public directory
 * @param {string} path - Relative path from public directory
 * @returns {Promise<string>} File content
 */
async function fetchMarkdownFile(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return null;
  }
}

/**
 * Get list of markdown files from a manifest
 * You need to generate this manifest during build or use a directory listing
 * For now, we'll use a fallback approach with known file patterns
 */
async function getMarkdownFiles(basePath, language) {
  // This is a workaround - ideally you'd have a manifest.json
  // For now, we'll try to fetch files based on common patterns
  const files = [];
  
  // Try to fetch a manifest file first
  try {
    const manifestResponse = await fetch(`${basePath}/manifest.json`);
    if (manifestResponse.ok) {
      const manifest = await manifestResponse.json();
      return manifest.files || [];
    }
  } catch (error) {
    console.log('No manifest found, using fallback approach');
  }
  
  return files;
}

/**
 * Load all blog posts for a specific language
 * @param {string} language - 'en' or 'es'
 * @returns {Promise<Array>} Array of blog posts with metadata and content
 */
export async function getBlogPosts(language = 'en') {
  try {
    // Fetch the blog index/manifest
    const manifestPath = `/content/blog/${language}/manifest.json`;
    const manifestResponse = await fetch(manifestPath);
    
    if (!manifestResponse.ok) {
      console.warn('No blog manifest found, returning empty array');
      return [];
    }
    
    const manifest = await manifestResponse.json();
    const posts = [];
    
    for (const filename of manifest.files) {
      const filePath = `/content/blog/${language}/${filename}`;
      const content = await fetchMarkdownFile(filePath);
      
      if (content) {
        const { data, content: body } = matter(content);
        
        // Only include published posts
        if (data.published !== false) {
          const slug = filename.replace('.md', '');
          posts.push({ 
            ...data, 
            body, 
            slug,
            language 
          });
        }
      }
    }
    
    // Sort by date, newest first
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

/**
 * Load a single blog post by slug
 * @param {string} slug - Post slug
 * @param {string} language - 'en' or 'es'
 * @returns {Promise<Object|null>} Blog post object or null
 */
export async function getBlogPost(slug, language = 'en') {
  try {
    const filePath = `/content/blog/${language}/${slug}.md`;
    const content = await fetchMarkdownFile(filePath);
    
    if (!content) return null;
    
    const { data, content: body } = matter(content);
    
    return {
      ...data,
      body,
      slug,
      language
    };
  } catch (error) {
    console.error('Error loading blog post:', error);
    return null;
  }
}

/**
 * Load all museum artworks for a specific language
 * @param {string} language - 'en' or 'es'
 * @returns {Promise<Array>} Array of artworks with metadata
 */
export async function getMuseumArtworks(language = 'en') {
  try {
    // Fetch the museum index/manifest
    const manifestPath = `/content/museum/${language}/manifest.json`;
    const manifestResponse = await fetch(manifestPath);
    
    if (!manifestResponse.ok) {
      console.warn('No museum manifest found, returning empty array');
      return [];
    }
    
    const manifest = await manifestResponse.json();
    const artworks = [];
    
    for (const filename of manifest.files) {
      const filePath = `/content/museum/${language}/${filename}`;
      const content = await fetchMarkdownFile(filePath);
      
      if (content) {
        const { data, content: body } = matter(content);
        const slug = filename.replace('.md', '');
        
        artworks.push({ 
          ...data, 
          body, 
          slug,
          language 
        });
      }
    }
    
    // Sort by display order
    return artworks.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error loading artworks:', error);
    return [];
  }
}

/**
 * Load a single artwork by slug
 * @param {string} slug - Artwork slug
 * @param {string} language - 'en' or 'es'
 * @returns {Promise<Object|null>} Artwork object or null
 */
export async function getMuseumArtwork(slug, language = 'en') {
  try {
    const filePath = `/content/museum/${language}/${slug}.md`;
    const content = await fetchMarkdownFile(filePath);
    
    if (!content) return null;
    
    const { data, content: body } = matter(content);
    
    return {
      ...data,
      body,
      slug,
      language
    };
  } catch (error) {
    console.error('Error loading artwork:', error);
    return null;
  }
}

/**
 * Get blog posts filtered by category
 * @param {string} category - Category name
 * @param {string} language - 'en' or 'es'
 * @returns {Promise<Array>} Filtered blog posts
 */
export async function getBlogPostsByCategory(category, language = 'en') {
  const posts = await getBlogPosts(language);
  if (!category || category === 'All') return posts;
  return posts.filter(post => post.category === category);
}

/**
 * Get artworks filtered by category
 * @param {string} category - Category name
 * @param {string} language - 'en' or 'es'
 * @returns {Promise<Array>} Filtered artworks
 */
export async function getArtworksByCategory(category, language = 'en') {
  const artworks = await getMuseumArtworks(language);
  if (!category || category === 'All') return artworks;
  return artworks.filter(artwork => artwork.category === category);
}

/**
 * Calculate reading time for blog post
 * @param {string} content - Post content
 * @returns {number} Reading time in minutes
 */
export function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Get related blog posts
 * @param {Object} currentPost - Current post object
 * @param {string} language - 'en' or 'es'
 * @param {number} limit - Max number of related posts
 * @returns {Promise<Array>} Related posts
 */
export async function getRelatedPosts(currentPost, language = 'en', limit = 3) {
  const allPosts = await getBlogPosts(language);
  
  // Filter out current post and get posts from same category
  const related = allPosts
    .filter(post => post.slug !== currentPost.slug && post.category === currentPost.category)
    .slice(0, limit);
  
  // If not enough posts in same category, add random posts
  if (related.length < limit) {
    const remaining = allPosts
      .filter(post => post.slug !== currentPost.slug && !related.includes(post))
      .slice(0, limit - related.length);
    related.push(...remaining);
  }
  
  return related;
}