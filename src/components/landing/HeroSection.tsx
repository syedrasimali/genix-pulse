import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 text-sm text-muted-foreground"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary-glow opacity-75 animate-pulse-ring" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-glow" />
          </span>
          AI-Powered Lead Generation
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[1.05] mb-6"
        >
          Find & Convert
          <br />
          <span className="gradient-text">LinkedIn Leads</span>
          <br />
          with AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Discover high-quality prospects, generate personalized outreach messages,
          and manage your pipeline — all in one platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/dashboard"
            className="btn-primary flex items-center gap-2 text-lg animate-cta-glow"
          >
            <Zap className="w-5 h-5" />
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#features" className="btn-outline-glow">
            See How It Works
          </a>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 glass-card p-2 max-w-4xl mx-auto"
        >
          <div className="rounded-xl bg-card/80 border border-border/30 p-6 aspect-video flex items-center justify-center">
            <div className="w-full space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-destructive/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <div className="flex-1 h-6 rounded-md bg-muted/50 max-w-xs mx-auto" />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="glass-card p-4 space-y-2">
                    <div className="h-3 w-2/3 rounded bg-primary/20" />
                    <div className="h-6 w-1/2 rounded bg-primary-glow/15 font-display text-lg gradient-text" />
                  </div>
                ))}
              </div>
              <div className="h-32 rounded-xl bg-muted/30 border border-border/20" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
