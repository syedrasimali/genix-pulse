import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, UserPlus, Sparkles, Settings, LogOut, Zap } from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/dashboard/leads", icon: Users, label: "Leads" },
  { to: "/dashboard/add-lead", icon: UserPlus, label: "Add Lead" },
  { to: "/dashboard/ai-messages", icon: Sparkles, label: "AI Messages" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const DashboardLayout = () => (
  <div className="flex h-screen overflow-hidden">
    {/* Sidebar */}
    <aside className="w-64 shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="h-16 flex items-center gap-2 px-6 border-b border-sidebar-border">
        <Zap className="w-5 h-5 text-primary-glow" />
        <span className="font-display font-bold text-lg gradient-text">LeadGenix</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors w-full">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
    {/* Main content */}
    <main className="flex-1 overflow-y-auto bg-background">
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;
