import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, Search, Phone, MapPin, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      title: "Company",
      href: "/company",
      items: ["Company Overview", "How it Works", "About Us", "Contact Us", "Careers"]
    },
    {
      title: "SBA & USDA Loans",
      href: "/sba-loans",
      items: ["SBA 7(a) Loans", "SBA 504 Loans", "SBA Express Loans", "USDA B&I Loans"]
    },
    {
      title: "Commercial Loans", 
      href: "/commercial-loans",
      items: ["Conventional Loans", "CMBS Loans", "Portfolio Loans", "Construction Loans", "Bridge Financing"]
    },
    {
      title: "Equipment Financing",
      href: "/equipment-financing", 
      items: ["Equipment Loans", "Equipment Leasing", "Heavy Equipment", "Medical Equipment"]
    },
    {
      title: "Business Capital",
      href: "/business-capital",
      items: ["Working Capital", "Business Line of Credit", "Term Loans", "Revenue Based Financing"]
    },
    {
      title: "Resources",
      href: "/resources",
      items: ["Loan Calculator", "Pre-qualification", "Industry Solutions", "Technical Support", "Contact Us"]
    }
  ];

  const getItemLink = (parentTitle: string, itemTitle: string) => {
    const linkMap: { [key: string]: { [key: string]: string } } = {
      "Company": {
        "Company Overview": "/company-overview",
        "How it Works": "/how-it-works",
        "About Us": "/about-us",
        "Contact Us": "/contact-us", 
        "Careers": "/careers"
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
        "Bridge Financing": "/bridge-financing"
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
        "Revenue Based Financing": "/revenue-based-financing"
      },
      "Resources": {
        "Loan Calculator": "/loan-calculator",
        "Pre-qualification": "/pre-qualification",
        "Industry Solutions": "/industry-solutions",
        "Technical Support": "/technical-support",
        "Contact Us": "/contact-us"
      }
    };
    
    return linkMap[parentTitle]?.[itemTitle] || "#";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top utility bar */}
      <div className="bg-black text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            {/* Logo in top section */}
            <div className="flex items-center">
              <Link to="/" className="">
                <h1 className="text-lg md:text-xl font-bold text-white">
                  HALO
                  <span className="text-primary"> BUSINESS FINANCE</span>
                </h1>
              </Link>
            </div>
            <div className="hidden sm:flex items-center gap-4 md:gap-6">
              <a href="tel:+18007308461" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                <span className="hidden md:inline">(800) 730-8461</span>
                <span className="md:hidden text-xs">(800) 730-8461</span>
              </a>
              <Link to="/customer-service" className="hidden md:inline">Customer Service</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex h-12 md:h-16 items-center justify-between">
          {/* Empty space where logo was */}
          <div></div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <DropdownMenu key={item.title}>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground">
                  {item.title}
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-popover border shadow-lg text-popover-foreground z-50">
                  {item.items.map((subItem) => (
                    <DropdownMenuItem key={subItem} className="" asChild>
                      <Link to={getItemLink(item.title, subItem)}>{subItem}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="hidden xl:flex items-center gap-2 lg:gap-4">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="text-xs lg:text-sm" asChild>
              <a href="https://portal.halobusinessfinance.com">
                <User className="h-4 w-4 mr-1 lg:mr-2" />
                <span className="hidden lg:inline">Sign In</span>
              </a>
            </Button>
            <Button size="sm" className="text-xs lg:text-sm" asChild>
              <a href="https://portal.halobusinessfinance.com">Get Started</a>
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="xl:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 sm:w-80">
              <div className="flex flex-col gap-6 pt-6">
                <div className="flex flex-col gap-4">
                  <Button variant="outline" className="justify-start" asChild>
                    <a href="https://portal.halobusinessfinance.com">
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </a>
                  </Button>
                  <Button className="justify-start" asChild>
                    <a href="https://portal.halobusinessfinance.com">Get Started</a>
                  </Button>
                </div>
                
                <div className="border-t pt-6">
                  <nav className="flex flex-col gap-4">
                    {navItems.map((item) => (
                      <div key={item.title} className="space-y-2">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <div className="pl-4 space-y-2">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem}
                              to={getItemLink(item.title, subItem)}
                              className="block text-sm text-foreground"
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
      </div>
    </header>
  );
};

export default Header;