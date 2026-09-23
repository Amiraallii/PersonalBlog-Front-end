interface ArticleStructuredDataProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
}

const ArticleStructuredData = ({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName = "Amirali Aghaei",
}: ArticleStructuredDataProps) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    ...(image && { image }),
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      "@type": "Person",
      name: authorName,
      url: "https://amirali.me/AboutMe",
    },
    publisher: {
      "@type": "Person",
      name: authorName,
      url: "https://amirali.me/AboutMe",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
};

export default ArticleStructuredData;