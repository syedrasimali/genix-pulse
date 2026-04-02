import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const SettingsPage = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("display_name").eq("user_id", user.id).single().then(({ data }) => {
      if (data) setDisplayName(data.display_name ?? "");
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ display_name: displayName }).eq("user_id", user.id);
    setSaving(false);
    if (error) { toast.error("Failed to save"); return; }
    toast.success("Profile updated!");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold mb-1">Settings</h1>
        <p className="text-muted-foreground mb-8">Manage your account and preferences.</p>
      </motion.div>

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary-glow" />
            </div>
            <div>
              <h3 className="font-display font-semibold">Profile</h3>
              <p className="text-xs text-muted-foreground">Update your display name.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Display Name</label>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="glass-input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input type="email" value={user?.email ?? ""} disabled className="glass-input w-full opacity-50" />
            </div>
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 px-4 disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </motion.div>

        {[{ icon: Bell, title: "Notifications", desc: "Control how you receive alerts." }, { icon: Palette, title: "Integrations", desc: "Connect external tools and APIs." }].map((section, i) => (
          <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (i + 1) * 0.1 }} className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <section.icon className="w-4 h-4 text-primary-glow" />
              </div>
              <div>
                <h3 className="font-display font-semibold">{section.title}</h3>
                <p className="text-xs text-muted-foreground">{section.desc}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground/60">Coming soon</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
