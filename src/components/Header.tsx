import { useState } from "react";
import { Button } from "@/components/ui/button";
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

  const handleMobileMenuToggle = () => {
    setIsOpen(!isOpen);
  };

  // Keep primary nav for mobile menu only
  const primaryNav = [
    { title: "Personal", href: "/personal" },
    { title: "Business", href: "/business", active: true },
    { title: "Commercial", href: "/commercial-loans" },
    { title: "Equipment", href: "/equipment-financing" },
    { title: "Capital Markets", href: "/business-capital" },
    { title: "Resources", href: "/resources" },
    { title: "About Us", href: "/company-overview" }
  ];

  // Secondary navigation (under Business) - BMO style
  const secondaryNav = [
    { title: "SBA Loans", href: "/sba-loans" },
    { title: "Commercial Loans", href: "/commercial-loans" },
    { title: "Equipment Financing", href: "/equipment-financing" },
    { title: "Business Capital", href: "/business-capital" },
    { title: "Loan Calculator", href: "/loan-calculator" }
  ];

  return (
    <header className="relative bg-white z-40">
      {/* Primary Navigation Bar - Simplified without main nav items */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-end h-12 px-6">
            {/* Right Side - Search, Phone and Sign In */}
            <div className="flex items-center space-x-6">
              <button className="text-gray-600 hover:text-blue-600">
                <Search className="h-5 w-5" />
              </button>
              
              <div className="hidden md:block w-px h-4 bg-gray-300"></div>
              
              <a 
                href="tel:+18007308461" 
                className="hidden md:flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
              >
                <Phone className="h-4 w-4" />
                (800) 730-8461
              </a>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-sm font-medium px-3 py-1 h-8 text-gray-700 hover:text-blue-600">
                      <User className="h-4 w-4 mr-2" />
                      {user.user_metadata?.display_name || user.email}
                      <ChevronDown className="h-4 w-4 ml-1" />
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
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-sm h-8 uppercase tracking-wide" 
                  asChild
                >
                  <Link to="/auth">
                    SIGN IN
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation Bar - BMO style with logo */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Logo */}
            <Link to="/" className="flex items-center mr-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  HALO BUSINESS FINANCE
                </span>
              </div>
            </Link>

            {/* Secondary Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
              {secondaryNav.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors py-2"
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={handleMobileMenuToggle}
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-xl overflow-y-auto lg:hidden">
            <div className="flex flex-col gap-4 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <span className="text-xl">×</span>
                </Button>
              </div>
              
              {/* Mobile Navigation */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Main</h3>
                  {primaryNav.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      className={`block py-2 text-sm font-medium transition-colors ${
                        item.active ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Services</h3>
                  {secondaryNav.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      className="block py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <a 
                    href="tel:+18007308461" 
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-4"
                  >
                    <Phone className="h-4 w-4" />
                    (800) 730-8461
                  </a>
                  
                  {!user && (
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wide" asChild>
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;