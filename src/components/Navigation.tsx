import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";

const Navigation: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: "/landing", label: "Home" },
    { to: "/questionnaire", label: "Questionnaire" },
    { to: "/face-scan", label: "Face Scan" },
    { to: "/products", label: "Products" },
    { to: "/subscription", label: "Subscription" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="w-full bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/landing"
              className="text-2xl font-bold bg-gradient-to-r from-glow-pink to-glow-purple bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              GlowAI
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.to)
                      ? 'bg-glow-pink/10 text-glow-pink'
                      : 'text-gray-700 hover:text-glow-pink hover:bg-glow-pink/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Section */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/profile">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/">
                  <Button className="bg-glow-pink hover:bg-glow-pink/90">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item.to)
                    ? 'bg-glow-pink/10 text-glow-pink'
                    : 'text-gray-700 hover:text-glow-pink hover:bg-glow-pink/5'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Auth */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {user ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-glow-pink hover:bg-glow-pink/5 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-glow-pink hover:bg-glow-pink/5 rounded-md"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-glow-pink hover:bg-glow-pink/5 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
