// src/components/SEOHelmet.jsx
import { Helmet } from 'react-helmet-async';

const SEOHelmet = ({ 
  title, 
  description, 
  image, 
  type = 'website', 
  url,
  article = null 
}) => {
  const siteUrl = 'https://lacasadeteresita.netlify.app';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image?.startsWith('http') ? image : `${siteUrl}${image || '/house1.jpg'}`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title} | La Casa de Teresita</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="La Casa de Teresita" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      
      {/* Article specific meta tags */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:author" content="La Casa de Teresita" />
          {article.category && (
            <meta property="article:section" content={article.category} />
          )}
          {article.tags && article.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
          
          {/* Schema.org for Articles */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": title,
              "description": description,
              "image": fullImage,
              "datePublished": article.publishedTime,
              "author": {
                "@type": "Organization",
                "name": "La Casa de Teresita"
              },
              "publisher": {
                "@type": "Organization",
                "name": "La Casa de Teresita",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${siteUrl}/house1.jpg`
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": fullUrl
              }
            })}
          </script>
        </>
      )}
    </Helmet>
  );
};

export default SEOHelmet;