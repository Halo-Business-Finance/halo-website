import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Menu, Search, Phone, ChevronDown, Shield, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, userRole, isAdmin } = useAuth();

  const menuItems = {
    "Company": {
      title: "Company",
      href: "/company",
      items: ["Company Overview", "How it Works", "Marketplace Benefits", "Contact Us"]
    },
    "SBA & USDA Loans": {
      title: "SBA & USDA Loans",
      href: "/sba-loans",
      items: ["SBA 7(a) Loans", "SBA 504 Loans", "USDA B&I Loans"]
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
      items: ["Working Capital", "Business Line of Credit", "Term Loans", "SBA Express Loans", "Factoring-Based Financing"]
    },
    "Resources": {
      title: "Resources",
      href: "/resources",
      items: ["Business Resources", "Loan Calculator", "Industry Solutions", "Customer Service", "Technical Support"]
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
      "SBA Express Loans": "/sba-express-loans",
      "Factoring-Based Financing": "/factoring-based-financing"
    },
    "Resources": {
      "Business Resources": "/business-finance-resources",
      "Loan Calculator": "/loan-calculator",
      "Industry Solutions": "/industry-solutions",
      "Customer Service": "/customer-service",
      "Technical Support": "/technical-support"
    }
  };

  const getItemLink = (parentTitle: string, itemTitle: string) => {
    return linkMap[parentTitle]?.[itemTitle] || "#";
  };

  return (
    <header className="relative shadow-lg border-b border-slate-200/60 z-50">
      {/* Top utility bar - Professional banking style */}
      <div className="bg-financial-navy text-white">
        <div className="max-w-full mx-auto px-8 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span className="hidden sm:inline text-white font-bold">Nationwide SBA & Commercial Loan Marketplace</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="tel:+18007308461" className="flex items-center gap-2 hover:text-blue-200 transition-colors font-extrabold border-r border-white/30 pr-6">
                <Phone className="h-4 w-4" />
                <span>(800) 730-8461</span>
              </a>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:text-blue-200 font-extrabold text-sm">
                      <User className="h-4 w-4 mr-2" />
                      {user.user_metadata?.display_name || user.email}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {userRole && (
                      <DropdownMenuItem disabled>
                        <Shield className="h-4 w-4 mr-2" />
                        Role: {userRole}
                      </DropdownMenuItem>
                    )}
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/security-dashboard">
                          <Shield className="h-4 w-4 mr-2" />
                          Security Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth" className="hover:text-blue-200 transition-colors font-extrabold text-sm">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="w-full px-4" aria-label="Main navigation">
        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden h-auto">
          {/* Logo and Menu Button Row */}
          <div className="relative flex justify-center items-center h-20 py-2">
            <Link to="/" className="block">
              <img
                src="/lovable-uploads/a9a35279-bd49-44f5-a3fe-1a5c4b1d0a02.png"
                alt="Halo Business Finance logo"
                className="h-16 w-auto"
                loading="eager"
                decoding="async"
              />
            </Link>
            
            {/* Mobile Menu Button - Fixed positioning */}
            <Sheet open={isOpen} onOpenChange={(open) => {
              console.log('Sheet state changed:', open);
              setIsOpen(open);
            }}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 p-0 hover:bg-slate-100 focus:bg-slate-100 transition-colors"
                  aria-label="Open mobile menu"
                  onClick={() => {
                    console.log('Menu button clicked, current state:', isOpen);
                  }}
                >
                  <Menu className="h-6 w-6 text-slate-700" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-80 overflow-y-auto bg-white border-l border-slate-200"
              >
                <div className="flex flex-col h-full min-h-screen">
                  <SheetHeader className="p-6 pt-16 border-b border-slate-200">
                    <SheetTitle className="text-lg font-bold text-financial-navy text-left">Navigation</SheetTitle>
                  </SheetHeader>
                  
                  <div className="flex-1 p-6 space-y-6">
                    <div className="text-sm text-slate-600">Welcome to our menu</div>
                    <div className="flex flex-col gap-3">
                      {user ? (
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground p-3 bg-slate-50 rounded-lg">
                            <div className="font-medium">{user.user_metadata?.display_name || user.email}</div>
                            {userRole && <span className="text-xs text-slate-500">Role: {userRole}</span>}
                          </div>
                          {isAdmin && (
                            <Button variant="outline" className="w-full justify-start" asChild>
                              <Link to="/security-dashboard" onClick={() => setIsOpen(false)}>
                                <Shield className="h-4 w-4 mr-2" />
                                Security Dashboard
                              </Link>
                            </Button>
                          )}
                          <Button variant="outline" className="w-full justify-start" onClick={() => { signOut(); setIsOpen(false); }}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <Link to="/auth" onClick={() => setIsOpen(false)}>
                            <User className="h-4 w-4 mr-2" />
                            Sign In
                          </Link>
                        </Button>
                      )}
                      <Button className="w-full justify-center bg-financial-navy hover:bg-financial-blue transition-colors" asChild>
                        <Link to={user ? "/loan-calculator" : "/auth"} onClick={() => setIsOpen(false)}>
                          Get Started
                        </Link>
                      </Button>
                    </div>
                    
                    {/* Mobile navigation */}
                    <div className="border-t border-slate-200 pt-6 flex-1">
                      <nav className="space-y-6">
                        {Object.entries(menuItems).map(([key, item]) => (
                          <div key={key} className="space-y-3">
                            <h3 className="font-semibold text-base text-financial-navy border-b border-slate-100 pb-2">
                              {item.title}
                            </h3>
                            <div className="space-y-1">
                              {item.items.map((subItem) => (
                                <Link
                                  key={subItem}
                                  to={getItemLink(item.title, subItem)}
                                  className="block text-slate-600 hover:text-financial-blue hover:bg-slate-50 transition-colors py-2 px-3 rounded-md text-sm"
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
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center h-16 w-full">
          {/* Desktop Navigation - Centered */}
          <div className="flex items-center justify-center flex-1 space-x-1">
            <Link to="/" className="mr-8 block">
              <img
                src="/lovable-uploads/a9a35279-bd49-44f5-a3fe-1a5c4b1d0a02.png"
                alt="Halo Business Finance logo"
                className="h-40 w-auto"
                loading="eager"
                decoding="async"
              />
            </Link>
            {Object.entries(menuItems).map(([key, item]) => (
              <DropdownMenu key={key}>
                <DropdownMenuTrigger className="flex items-center px-4 py-3 text-slate-700 hover:text-financial-blue hover:bg-slate-50/80 font-medium text-sm transition-all duration-200 rounded-lg group relative mx-1">
                  {item.title}
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-financial-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-slate-200 shadow-lg rounded-xl p-2 min-w-[260px] mt-2 z-[60]">
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
          <div className="flex items-center gap-3 ml-auto">
            <Button className="bg-financial-navy text-white font-semibold px-6 shadow-[var(--shadow-button)] hover:shadow-lg transition-all duration-300" asChild>
              <Link to={user ? "/loan-calculator" : "/auth"}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;