import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/30" style={{ background: "hsl(212 100% 4% / 0.7)", backdropFilter: "blur(16px)" }}>
    <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
      <Link to="/" className="font-display font-bold text-xl gradient-text">
        LeadGenix
      </Link>
      <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
        <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
        <a href="#" className="hover:text-foreground transition-colors">Docs</a>
      </div>
      <Link to="/dashboard" className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
        <Zap className="w-4 h-4" />
        Get Started
      </Link>
    </div>
  </nav>
);

export default Navbar;
