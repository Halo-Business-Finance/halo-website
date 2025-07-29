import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const location = useLocation();
  
  const defaultItems = generateBreadcrumbs(location.pathname);
  const breadcrumbItems = items || defaultItems;

  return (
    <nav aria-label="Breadcrumb" className="bg-muted/30 py-2">
      <div className="container mx-auto px-4">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link 
              to="/" 
              className="flex items-center text-muted-foreground hover:text-primary transition-colors"
              aria-label="Home"
            >
              <Home className="h-4 w-4" />
            </Link>
          </li>
          
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
              {item.href && index < breadcrumbItems.length - 1 ? (
                <Link 
                  to={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const href = i < paths.length - 1 ? `/${paths.slice(0, i + 1).join('/')}` : undefined;
    
    const label = formatBreadcrumbLabel(path);
    breadcrumbs.push({ label, href });
  }
  
  return breadcrumbs;
}

function formatBreadcrumbLabel(path: string): string {
  const labels: Record<string, string> = {
    'sba-loans': 'SBA Loans',
    'sba-7a-loans': 'SBA 7(a) Loans',
    'sba-504-loans': 'SBA 504 Loans',
    'bridge-financing': 'Bridge Financing',
    'conventional-loans': 'Conventional Loans',
    'equipment-financing': 'Equipment Financing',
    'working-capital': 'Working Capital',
    'business-line-of-credit': 'Business Line of Credit',
    'term-loans': 'Term Loans',
    'pre-qualification': 'Pre-Qualification',
    'loan-calculator': 'Loan Calculator',
    'how-it-works': 'How It Works',
    'about-us': 'About Us',
    'contact-us': 'Contact Us',
    'industry-solutions': 'Industry Solutions',
    'resources': 'Resources',
    'multifamily-loans': 'Multifamily Loans',
    'asset-based-loans': 'Asset-Based Loans'
  };
  
  return labels[path] || path.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

export default Breadcrumbs;