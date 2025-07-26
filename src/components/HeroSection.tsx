import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const HeroSection = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="relative bg-gradient-to-br from-primary to-financial-navy min-h-[600px] flex items-center">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold leading-tight">
                Banking that works
                <span className="block text-4xl">for your future</span>
              </h1>
              <p className="text-xl text-blue-100 max-w-lg">
                Experience modern banking with competitive rates, innovative tools, and personalized service that puts you first.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold">
                Open Account Today
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-8">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">FDIC Insured</span>
              </div>
              <div className="text-sm">Member FDIC</div>
              <div className="text-sm">Equal Housing Lender</div>
            </div>
          </div>

          {/* Right side - Login card */}
          <div className="lg:justify-self-end">
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
                      <a href="#" className="text-primary hover:underline">
                        Forgot password?
                      </a>
                    </div>

                    <Button type="submit" className="w-full h-11 font-medium">
                      Sign In
                    </Button>
                  </form>

                  <div className="text-center text-sm text-gray-600">
                    New to Halo Business Finance?{" "}
                    <a href="#" className="text-primary hover:underline font-medium">
                      Open an account
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;