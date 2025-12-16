// src/pages/BlogPage.jsx
import { useState, useEffect } from 'react';
import { BookOpen, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getBlogPostsByCategory } from '../utils/contentLoader';
import BlogCard from '../components/BlogCard';
import SEOHelmet from '../components/SEOHelmet';

const BlogPage = () => {
  const { language, t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Travel', 'History', 'Culture', 'Tips'];
  
  useEffect(() => {
    loadPosts();
  }, [language, selectedCategory]);
  
  const loadPosts = async () => {
  setLoading(true);
  try {
    console.log('🔍 Loading posts for:', language, 'category:', selectedCategory);
    const loadedPosts = await getBlogPostsByCategory(
      selectedCategory === 'All' ? null : selectedCategory, 
      language
    );
    console.log('✅ Posts loaded:', loadedPosts);
    setPosts(loadedPosts);
  } catch (error) {
    console.error('Error loading blog posts:', error);
    setPosts([]);
  } finally {
    setLoading(false);
  }
};
  
  return (
    <div className="min-h-screen pt-20 bg-[#F8F5F2]">
      <SEOHelmet
        title={t.blog.title}
        description={t.blog.metaDescription}
        url="/blog"
        type="website"
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2D5A4A] via-[#3D6A5A] to-[#A85C32] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-12 w-12" />
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t.blog.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            {t.blog.subtitle}
          </p>
        </div>
      </section>
      
      {/* Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter className="h-5 w-5" />
            <span className="font-semibold">{t.blog.filterBy}:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-[#A85C32] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Blog Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#A85C32] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">{t.blog.noPosts}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogPage;
