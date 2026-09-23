import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  noIndex?: boolean;
}

const SITE_URL = "https://amirali.me";
const DEFAULT_IMAGE = `${SITE_URL}/pwa-512x512.png`;

const SEO = ({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  noIndex = false,
}: SEOProps) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (
      name: string,
      content: string,
      attribute: "name" | "property" = "name",
    ) => {
      let element = document.head.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${name}"]`,
      );

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    setMeta("description", description);

    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:url", canonical ?? window.location.href, "property");
    setMeta("og:image", image, "property");

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);

    let canonicalElement =
      document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!canonicalElement) {
      canonicalElement = document.createElement("link");
      canonicalElement.rel = "canonical";
      document.head.appendChild(canonicalElement);
    }

    canonicalElement.href =
      canonical ?? `${SITE_URL}${window.location.pathname}`;

    let robotsElement =
      document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');

    if (!robotsElement) {
      robotsElement = document.createElement("meta");
      robotsElement.name = "robots";
      document.head.appendChild(robotsElement);
    }

    robotsElement.content = noIndex
      ? "noindex, nofollow"
      : "index, follow";

    return () => {
      // Intentionally keep metadata in the document.
    };
  }, [title, description, canonical, image, noIndex]);

  return null;
};

export default SEO;