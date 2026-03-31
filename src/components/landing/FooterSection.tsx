const FooterSection = () => (
  <footer className="border-t border-border/40 py-12 px-4">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="font-display font-bold text-xl gradient-text">LeadGenix</div>
      <p className="text-muted-foreground text-sm">
        © {new Date().getFullYear()} LeadGenix. All rights reserved.
      </p>
      <div className="flex gap-6 text-sm text-muted-foreground">
        <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
        <a href="#" className="hover:text-foreground transition-colors">Terms</a>
        <a href="#" className="hover:text-foreground transition-colors">Contact</a>
      </div>
    </div>
  </footer>
);

export default FooterSection;
