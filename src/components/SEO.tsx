import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  type?: string;
  noindex?: boolean;
}

const SEO = ({
  title = "Halo Business Finance | SBA Loans, Commercial Financing & Bridge Loans",
  description = "Get SBA loans, conventional commercial financing, bridge loans, and equipment financing. Fast approval, competitive rates. Trusted by 2,500+ businesses nationwide.",
  keywords = "SBA loans, commercial loans, business financing, bridge loans, equipment financing, working capital, conventional loans, business capital, commercial real estate loans",
  canonical,
  image = "https://halobusinessfinance.com/og-image.jpg",
  type = "website",
  noindex = false
}: SEOProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      {canonical && <meta property="og:url" content={canonical} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;