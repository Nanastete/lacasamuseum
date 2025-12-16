// src/pages/BlogPostPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../context/LanguageContext';
import { getBlogPost, getRelatedPosts, calculateReadingTime } from '../utils/contentLoader';
import SEOHelmet from '../components/SEOHelmet';
import BlogCard from '../components/BlogCard';
import WhatsAppButton from '../components/WhatsAppButton';

const BlogPostPage = () => {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const locale = language === 'es' ? es : enUS;
  
  useEffect(() => {
    loadPost();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, language]);
  
  const loadPost = async () => {
    setLoading(true);
    try {
      const loadedPost = await getBlogPost(slug, language);
      setPost(loadedPost);
      
      if (loadedPost) {
        const related = await getRelatedPosts(loadedPost, language);
        setRelatedPosts(related);
      }
    } catch (error) {
      console.error('Error loading blog post:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#A85C32]"></div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#F8F5F2]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-[#2D5A4A] mb-4">
            {t.blog.notFound}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t.blog.notFoundMessage}
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-[#A85C32] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8B4926] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            {t.blog.backToBlog}
          </Link>
        </div>
      </div>
    );
  }
  
  const formattedDate = format(new Date(post.date), 'MMMM d, yyyy', { locale });
  const readingTime = calculateReadingTime(post.body);
  
  return (
    <div className="min-h-screen pt-20 bg-white">
      <SEOHelmet
        title={post.title}
        description={post.metaDescription || post.excerpt}
        image={post.image}
        url={`/blog/${post.slug}`}
        type="article"
        article={{
          publishedTime: post.date,
          category: post.category
        }}
      />
      
      {/* Hero Image */}
      <div className="relative h-96 md:h-[500px] bg-gray-900">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        
        {/* Back Button */}
        <Link
          to="/blog"
          className="absolute top-4 left-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
        >
          <ArrowLeft className="h-6 w-6 text-[#2D5A4A]" />
        </Link>
      </div>
      
      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="inline-block px-4 py-2 bg-[#A85C32] text-white rounded-full font-semibold mb-4">
            {post.category}
          </div>
          
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D5A4A] mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{readingTime} min read</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-[#A85C32] hover:text-[#8B4926] transition-colors"
            >
              <Share2 className="h-5 w-5" />
              Share
            </button>
          </div>
        </header>
        
        {/* Article Body */}
        <div className="prose prose-lg max-w-none mb-12">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({node, ...props}) => <h2 className="text-3xl font-bold text-[#2D5A4A] mt-8 mb-4" style={{ fontFamily: "'Playfair Display', serif" }} {...props} />,
              h3: ({node, ...props}) => <h3 className="text-2xl font-bold text-[#2D5A4A] mt-6 mb-3" style={{ fontFamily: "'Playfair Display', serif" }} {...props} />,
              p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#A85C32] pl-6 italic text-gray-600 my-6" {...props} />,
              img: ({node, ...props}) => <img className="rounded-lg shadow-lg my-8 w-full" {...props} />,
              a: ({node, ...props}) => <a className="text-[#A85C32] hover:text-[#8B4926] underline" {...props} />
            }}
          >
            {post.body}
          </ReactMarkdown>
        </div>
        
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#2D5A4A] to-[#A85C32] p-8 rounded-xl text-white text-center mb-12">
          <h3 className="text-2xl font-bold mb-4">Ready to Experience La Casa de Teresita?</h3>
          <p className="mb-6">Book your stay in our historic boutique hotel and live the stories you just read about.</p>
          <Link
            to="/"
            className="inline-block bg-white text-[#2D5A4A] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            View Rooms & Availability
          </Link>
        </div>
      </article>
      
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-[#F8F5F2] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-3xl md:text-4xl font-bold text-[#2D5A4A] mb-12 text-center"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t.blog.relatedPosts}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      <WhatsAppButton />
    </div>
  );
};

export default BlogPostPage;