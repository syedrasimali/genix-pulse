import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, Bell, Palette, Camera, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import UserAvatar from "@/components/dashboard/UserAvatar";

const SettingsPage = () => {
  const { user } = useAuth();
  const { profile, updateProfile, uploadAvatar, removeAvatar } = useProfile();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) setDisplayName(profile.display_name ?? "");
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    await updateProfile({ display_name: displayName });
    setSaving(false);
    toast.success("Profile updated!");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB"); return; }
    setUploading(true);
    const url = await uploadAvatar(file);
    setUploading(false);
    if (url) toast.success("Avatar updated!");
    else toast.error("Failed to upload avatar");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleRemoveAvatar = async () => {
    setUploading(true);
    await removeAvatar();
    setUploading(false);
    toast.success("Avatar removed");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold mb-1">Settings</h1>
        <p className="text-muted-foreground mb-8">Manage your account and preferences.</p>
      </motion.div>

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary-glow" />
            </div>
            <div>
              <h3 className="font-display font-semibold">Profile</h3>
              <p className="text-xs text-muted-foreground">Update your profile picture and name.</p>
            </div>
          </div>

          {/* Avatar Section */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative group">
              <UserAvatar size="lg" />
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Camera className="w-5 h-5 text-foreground" />
              </button>
            </div>
            <div className="space-y-1.5">
              <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-outline-glow text-xs py-1.5 px-3">
                {uploading ? "Uploading..." : "Change Photo"}
              </button>
              {profile?.avatar_url && (
                <button onClick={handleRemoveAvatar} disabled={uploading} className="flex items-center gap-1 text-xs text-destructive hover:underline">
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              )}
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
