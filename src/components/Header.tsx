import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, Search, Phone, MapPin, ChevronDown } from "lucide-react";
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
      title: "SBA Loans",
      href: "/sba-loans",
      items: ["SBA 7(a) Loans", "SBA 504 Loans", "SBA Express Loans", "SBA Microloans", "Bridge Loans"]
    },
    {
      title: "Commercial Loans", 
      href: "/commercial-loans",
      items: ["Conventional Loans", "Purchase Loans", "Refinance Loans", "Construction Loans", "Bridge Financing"]
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
      title: "Company",
      href: "/company",
      items: ["Company Overview", "About Us", "Contact Us", "Careers"]
    },
    {
      title: "Resources",
      href: "/resources",
      items: ["Loan Calculator", "Pre-qualification", "Industry Solutions", "Contact Us"]
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top utility bar */}
      <div className="bg-financial-navy text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(800) 730-8461</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span>Customer Service</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">
              HALO
              <span className="text-financial-navy"> BUSINESS FINANCE</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <DropdownMenu key={item.title}>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {item.title}
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background border shadow-lg">
                  {item.items.map((subItem) => (
                    <DropdownMenuItem key={subItem} className="hover:bg-muted">
                      {subItem}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            <Button size="sm">
              Get Started
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-6 pt-6">
                <div className="flex flex-col gap-4">
                  <Button variant="outline" className="justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                  <Button className="justify-start">
                    Get Started
                  </Button>
                </div>
                
                <div className="border-t pt-6">
                  <nav className="flex flex-col gap-4">
                    {navItems.map((item) => (
                      <div key={item.title} className="space-y-2">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <div className="pl-4 space-y-2">
                          {item.items.map((subItem) => (
                            <a
                              key={subItem}
                              href="#"
                              className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                              {subItem}
                            </a>
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