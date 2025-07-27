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
  keywords = "SBA loans, commercial loans, business financing, bridge loans, equipment financing, working capital, conventional loans, business capital, commercial real estate loans, small business loans, SBA 7a loans, SBA 504 loans, SBA express loans, USDA business loans, commercial mortgage, business loan marketplace, fast business loans, business loan approval, low interest business loans, startup financing, business credit line, term loans, revenue based financing, equipment leasing, heavy equipment financing, medical equipment financing, construction loans, portfolio loans, CMBS loans, business loan calculator, business loan pre qualification, commercial lending, business loan rates, SBA preferred lender, business loan broker, commercial loan broker, business loan application, online business loans, same day business loans, bad credit business loans, no collateral business loans, merchant cash advance alternative, business loan refinancing, commercial real estate financing, investment property loans, business acquisition loans, franchise financing, restaurant financing, retail financing, manufacturing financing, healthcare financing, technology startup loans, minority business loans, women business loans, veteran business loans, business expansion loans, emergency business funding, cash flow financing, invoice factoring, accounts receivable financing",
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