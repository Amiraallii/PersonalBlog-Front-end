interface PersonStructuredDataProps {
  name: string;
  alternateName?: string;
  description?: string;
  image?: string;
  sameAs?: string[];
}

const PersonStructuredData = ({
  name,
  alternateName,
  description,
  image,
  sameAs = [],
}: PersonStructuredDataProps) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      "@id": "https://amirali.me/#person",
      name,
      ...(alternateName && { alternateName }),
      ...(description && { description }),
      ...(image && { image }),
      url: "https://amirali.me/AboutMe",
      ...(sameAs.length > 0 && { sameAs }),
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

export default PersonStructuredData;