import { motion } from "framer-motion";
import { User, Bell, Palette } from "lucide-react";

const SettingsPage = () => (
  <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-display font-bold mb-1">Settings</h1>
      <p className="text-muted-foreground mb-8">Manage your account and preferences.</p>
    </motion.div>

    <div className="space-y-6">
      {[
        {
          icon: User,
          title: "Profile",
          desc: "Update your name and email.",
          fields: [
            { label: "Full Name", value: "Alex Morgan", type: "text" },
            { label: "Email", value: "alex@leadgenix.com", type: "email" },
          ],
        },
        {
          icon: Bell,
          title: "Notifications",
          desc: "Control how you receive alerts.",
          fields: [],
        },
        {
          icon: Palette,
          title: "Integrations",
          desc: "Connect external tools and APIs.",
          fields: [],
        },
      ].map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <section.icon className="w-4 h-4 text-primary-glow" />
            </div>
            <div>
              <h3 className="font-display font-semibold">{section.title}</h3>
              <p className="text-xs text-muted-foreground">{section.desc}</p>
            </div>
          </div>
          {section.fields.length > 0 && (
            <div className="space-y-4">
              {section.fields.map((f) => (
                <div key={f.label}>
                  <label className="block text-sm font-medium mb-1.5">{f.label}</label>
                  <input type={f.type} defaultValue={f.value} className="glass-input w-full" />
                </div>
              ))}
              <button className="btn-primary text-sm py-2 px-4">Save Changes</button>
            </div>
          )}
          {section.fields.length === 0 && (
            <p className="text-sm text-muted-foreground/60">Coming soon</p>
          )}
        </motion.div>
      ))}
    </div>
  </div>
);

export default SettingsPage;
