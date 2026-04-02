import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/30" style={{ background: "hsl(212 100% 4% / 0.7)", backdropFilter: "blur(16px)" }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
        <Link to="/" className="font-display font-bold text-xl gradient-text">
          LeadGenix
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#" className="hover:text-foreground transition-colors">Docs</a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden sm:flex text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
            Sign In
          </Link>
          <Link to="/signup" className="hidden sm:flex btn-primary items-center gap-2 text-sm py-2 px-4">
            <Zap className="w-4 h-4" />
            Get Started Free
          </Link>
          <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border/30 px-4 py-4 space-y-3" style={{ background: "hsl(212 100% 4% / 0.95)" }}>
          <a href="#features" className="block text-sm text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>Features</a>
          <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">Pricing</a>
          <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">Docs</a>
          <Link to="/dashboard" className="btn-primary flex items-center justify-center gap-2 text-sm py-2 w-full" onClick={() => setOpen(false)}>
            <Zap className="w-4 h-4" />
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
