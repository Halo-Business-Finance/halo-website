import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, Phone, ChevronDown, Shield, User } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = {
    "Company": {
      title: "Company",
      href: "/company",
      items: ["Company Overview", "How it Works", "Marketplace Benefits", "Contact Us"]
    },
    "SBA & USDA Loans": {
      title: "SBA & USDA Loans",
      href: "/sba-loans",
      items: ["SBA 7(a) Loans", "SBA 504 Loans", "SBA Express Loans", "USDA B&I Loans"]
    },
    "Commercial Loans": {
      title: "Commercial Loans", 
      href: "/commercial-loans",
      items: ["Conventional Loans", "CMBS Loans", "Portfolio Loans", "Construction Loans", "Bridge Financing", "Multifamily Loans", "Asset-Based Loans"]
    },
    "Equipment Financing": {
      title: "Equipment Financing",
      href: "/equipment-financing", 
      items: ["Equipment Loans", "Equipment Leasing", "Heavy Equipment", "Medical Equipment"]
    },
    "Business Capital": {
      title: "Business Capital",
      href: "/business-capital",
      items: ["Working Capital", "Business Line of Credit", "Term Loans", "Factoring-Based Financing"]
    },
    "Resources": {
      title: "Resources",
      href: "/resources",
      items: ["Business Resources", "Loan Calculator", "Industry Solutions", "Technical Support"]
    }
  };

  const linkMap: { [key: string]: { [key: string]: string } } = {
    "Company": {
      "Company Overview": "/company-overview",
      "How it Works": "/how-it-works",
      "Marketplace Benefits": "/marketplace-benefits",
      "Contact Us": "/contact-us"
    },
    "SBA & USDA Loans": {
      "SBA 7(a) Loans": "/sba-7a-loans",
      "SBA 504 Loans": "/sba-504-loans", 
      "SBA Express Loans": "/sba-express-loans",
      "USDA B&I Loans": "/usda-bi-loans"
    },
    "Commercial Loans": {
      "Conventional Loans": "/conventional-loans",
      "CMBS Loans": "/cmbs-loans",
      "Portfolio Loans": "/portfolio-loans",
      "Construction Loans": "/construction-loans",
      "Bridge Financing": "/bridge-financing",
      "Multifamily Loans": "/multifamily-loans",
      "Asset-Based Loans": "/asset-based-loans"
    },
    "Equipment Financing": {
      "Equipment Loans": "/equipment-loans",
      "Equipment Leasing": "/equipment-leasing",
      "Heavy Equipment": "/heavy-equipment",
      "Medical Equipment": "/medical-equipment"
    },
    "Business Capital": {
      "Working Capital": "/working-capital",
      "Business Line of Credit": "/business-line-of-credit",
      "Term Loans": "/term-loans",
      "Factoring-Based Financing": "/factoring-based-financing"
    },
    "Resources": {
      "Business Resources": "/business-finance-resources",
      "Loan Calculator": "/loan-calculator",
      "Industry Solutions": "/industry-solutions",
      "Technical Support": "/technical-support"
    }
  };

  const getItemLink = (parentTitle: string, itemTitle: string) => {
    return linkMap[parentTitle]?.[itemTitle] || "#";
  };

  return (
    <header className="relative bg-white shadow-lg border-b border-slate-200/60 z-50">
      {/* Top utility bar - Professional banking style */}
      <div className="bg-financial-navy text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span className="text-white font-bold">Halo Business Finance</span>
              <span className="hidden sm:inline text-blue-200">|</span>
              <span className="hidden sm:inline text-white">Nationwide Marketplace</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="tel:+18007308461" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
                <Phone className="h-4 w-4" />
                <span>(800) 730-8461</span>
              </a>
              <Link to="/customer-service" className="hidden md:inline hover:text-blue-200 transition-colors">
                Customer Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      <nav className="container mx-auto px-4" aria-label="Main navigation">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Enhanced professional style */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-financial-navy to-financial-blue rounded-xl flex items-center justify-center shadow-[var(--shadow-button)] group-hover:shadow-lg transition-all duration-300">
              <span className="text-white font-bold text-xl">H</span>
            </div>
          </Link>

          {/* Desktop Navigation - Enhanced UI/UX */}
          <div className="hidden lg:flex items-center space-x-0">
            {Object.entries(menuItems).map(([key, item]) => (
              <DropdownMenu key={key}>
                <DropdownMenuTrigger className="flex items-center px-5 py-4 text-slate-700 hover:text-financial-blue hover:bg-slate-50/80 font-semibold transition-all duration-200 rounded-lg group relative">
                  {item.title}
                  <ChevronDown className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-financial-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-slate-200 shadow-[var(--shadow-professional)] rounded-xl p-3 min-w-[260px] mt-2">
                  <div className="py-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
                      {item.title}
                    </div>
                    {item.items.map((subItem) => (
                      <DropdownMenuItem key={subItem} className="rounded-lg hover:bg-slate-50 transition-colors duration-200 p-3 mb-1" asChild>
                        <Link to={getItemLink(item.title, subItem)} className="flex items-center text-slate-700 hover:text-financial-blue font-medium group">
                          <div className="w-2 h-2 bg-financial-blue/20 rounded-full mr-3 group-hover:bg-financial-blue transition-colors duration-200"></div>
                          {subItem}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>

          {/* Right side buttons - Enhanced professional style */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
              <Search className="h-5 w-5 text-slate-600" />
            </Button>
            
            <Button variant="outline" className="border-2 border-slate-300 hover:border-financial-blue hover:text-financial-blue font-medium" asChild>
              <a href="https://preview--hbf-application.lovable.app/auth">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </a>
            </Button>
            
            <Button className="bg-gradient-to-r from-financial-navy to-financial-blue text-white font-semibold px-6 shadow-[var(--shadow-button)] hover:shadow-lg transition-all duration-300" asChild>
              <a href="https://preview--hbf-application.lovable.app/auth?loan=refinance">
                Get Started
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" className="rounded-lg p-3 h-12 w-12">
                <Menu className="h-6 w-6 text-slate-600" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <div className="flex flex-col gap-6 pt-6">
                {/* Mobile CTA buttons */}
                <div className="flex flex-col gap-3">
                  <Button variant="outline" className="justify-start border-2" asChild>
                    <a href="https://preview--hbf-application.lovable.app/auth">
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </a>
                  </Button>
                  <Button className="justify-start bg-gradient-to-r from-financial-navy to-financial-blue" asChild>
                    <a href="https://preview--hbf-application.lovable.app/auth?loan=refinance">
                      Get Started
                    </a>
                  </Button>
                </div>
                
                {/* Mobile navigation */}
                <div className="border-t pt-6 flex-1">
                  <nav className="flex flex-col gap-4">
                    {Object.entries(menuItems).map(([key, item]) => (
                      <div key={key} className="space-y-3">
                        <h3 className="font-bold text-lg text-financial-navy">{item.title}</h3>
                        <div className="pl-4 space-y-2">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem}
                              to={getItemLink(item.title, subItem)}
                              className="block text-slate-600 hover:text-financial-blue transition-colors py-1"
                              onClick={() => setIsOpen(false)}
                            >
                              {subItem}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </nav>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Header;