import { Button } from "@/components/UI/button";
import { ArrowRight, Menu, X, LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import Logo from "../UI/Logo";
import { useAuth } from "react-oidc-context";

// Create a reusable menu items component
const MenuItems = ({ className = "" }) => {
  const items = [
    { href: "#why-brifify", label: "Why Brifify" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#use-cases", label: "Use cases" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <>
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={`!text-gray-500 hover:!text-gray-700 !font-semibold ${className}`}
        >
          {item.label}
        </a>
      ))}
    </>
  );
};

export default function NavbarMain() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const auth = useAuth();
  const isAuthenticated = auth.isAuthenticated;
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleAuthAction = () => {
    const clientId = import.meta.env.VITE_APP_CLIENT_ID;
    const logoutUri = import.meta.env.VITE_APP_REDIRECT_URI;
    const cognitoDomain = import.meta.env.VITE_APP_COGNITO_DOMAIN;
    if (isAuthenticated) {
      // Log out
      auth.removeUser();
      window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    } else {
      // Log in - redirect to authentication page
      auth.signinRedirect();
    }
  };

  return (
    <nav className="w-full flex justify-center">
      <div className="max-w-[1200px] w-full px-4 flex items-center relative">
        <div className="!flex-none text-xl font-bold text-gray-800">
          <Logo />
        </div>

        {/* Mobile menu button - visible from xs to lg breakpoint */}
        <div className="lg:!hidden !ml-auto">
          <button
            onClick={toggleMenu}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Center menu items - only visible at lg (1024px) and above */}
        <div className="!hidden lg:!flex !items-center !justify-center !absolute !left-1/2 !transform !-translate-x-1/2 !space-x-6">
          <MenuItems />
        </div>

        {/* Right-aligned items - only visible at lg (1024px) and above */}
        <div className="!hidden lg:!flex !flex-row !items-center !ml-auto !space-x-4">
          <Button
            onClick={handleAuthAction}
            variant="outline"
            className="!flex !items-center !gap-2 !border !border-gray-300 !text-gray-700 hover:!bg-gray-50"
          >
            {isAuthenticated ? (
              <>
                <LogOut className="h-4 w-4" />
                Logout
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Login
              </>
            )}
          </Button>
          <Button
            onClick={() =>
              (window.location.href = "https://www.app.brifify.com")
            }
            className="!w-auto !flex !items-center !gap-2 !bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !rounded-sm !px-4 !py-2 !transition-colors !duration-200"
          >
            Go To App
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile/tablet menu - visible below lg breakpoint */}
        <div
          className={`${
            isMenuOpen ? "!flex" : "!hidden"
          } !fixed lg:!hidden !left-0 !right-0 !top-[72px] !flex-col !items-start !bg-white !shadow-lg !p-4 !z-50 !w-screen`}
        >
          <div className="!flex !flex-col !items-start !space-y-4 !w-full">
            <MenuItems className="!block !mb-4" />
          </div>

          <div className="!flex !flex-col !items-start !space-y-4 !w-full !mt-4 !border-t !pt-4">
            <Button
              onClick={handleAuthAction}
              variant="outline"
              className="!w-full !flex !items-center !gap-2 !border !border-gray-300 !text-gray-700 hover:!bg-gray-50"
            >
              {isAuthenticated ? (
                <>
                  <LogOut className="h-4 w-4" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Login
                </>
              )}
            </Button>
            <Button
              onClick={() =>
                (window.location.href = "https://www.app.brifify.com")
              }
              className="!w-full !flex !items-center !gap-2 !bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !rounded-sm !px-4 !py-2 !transition-colors !duration-200"
            >
              Go To App
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
