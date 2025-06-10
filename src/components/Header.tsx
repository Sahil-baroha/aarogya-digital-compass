
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/AuthProvider";

export const Header = () => {
  const { isAuthenticated, signOut } = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Aarogya Bharat</h1>
              <Badge variant="secondary" className="text-xs">Digital Health Platform</Badge>
            </div>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </a>
          <a href="#architecture" className="text-sm font-medium hover:text-primary transition-colors">
            Architecture
          </a>
          <a href="#security" className="text-sm font-medium hover:text-primary transition-colors">
            Security
          </a>
        </nav>
        
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
