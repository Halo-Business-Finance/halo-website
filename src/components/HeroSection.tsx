import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import heroBackground from "@/assets/hero-background.jpg";
import businessLoanApproved from "@/assets/business-loan-approved.jpg";

const HeroSection = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="relative bg-gradient-to-br from-primary to-financial-navy min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden" aria-label="Hero section">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBackground} 
          alt="Commercial real estate buildings representing business growth and financing opportunities"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-financial-navy/40" />
      </div>
      
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Hero content */}
          <header className="text-white space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                Business financing
                <span className="block text-2xl md:text-3xl lg:text-4xl xl:text-5xl">that fuels your growth</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 max-w-lg">
                Experience streamlined business lending with competitive SBA and commercial loan solutions designed to accelerate your success.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold text-sm md:text-base">
                Get Pre-Qualified
              </Button>
              <Button size="lg" variant="ghost" className="border border-white text-white hover:bg-white/10 text-sm md:text-base">
                View Loan Options
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-8">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">SBA Preferred Bank Partner</span>
              </div>
              <div className="text-sm">Nationwide Licensed Marketplace</div>
              <div className="text-sm">Secure & Encrypted Marketplace</div>
            </div>
          </header>

          {/* Right side - Login card */}
          <aside className="lg:justify-self-end" aria-label="Account login form">
            <Card className="w-full max-w-md bg-white shadow-2xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-600 mt-2">Access your account securely</p>
                  </div>

                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium">
                        Username or Email
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Remember me
                      </label>
                      <Link to="/contact-us" className="text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>

                    <Button type="submit" className="w-full h-11 font-medium">
                      Sign In
                    </Button>
                  </form>

                  <div className="text-center text-sm text-gray-600">
                    New to Halo Business Finance?{" "}
                     <Link to="/pre-qualification" className="text-primary hover:underline font-medium">
                       Apply for financing
                     </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;