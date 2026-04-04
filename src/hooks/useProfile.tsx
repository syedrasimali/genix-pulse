import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
}

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: { display_name?: string; avatar_url?: string | null }) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string | null>;
  removeAvatar: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  updateProfile: async () => {},
  uploadAvatar: async () => null,
  removeAvatar: async () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!user) { setProfile(null); setLoading(false); return; }
    const { data } = await supabase
      .from("profiles")
      .select("id, user_id, display_name, avatar_url")
      .eq("user_id", user.id)
      .single();
    if (data) setProfile(data);
    setLoading(false);
  }, [user]);

  useEffect(() => { refreshProfile(); }, [refreshProfile]);

  const updateProfile = async (updates: { display_name?: string; avatar_url?: string | null }) => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update(updates).eq("user_id", user.id);
    if (!error) await refreshProfile();
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) return null;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) return null;
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${data.publicUrl}?t=${Date.now()}`;
    await updateProfile({ avatar_url: url });
    return url;
  };

  const removeAvatar = async () => {
    if (!user) return;
    const { data: files } = await supabase.storage.from("avatars").list(user.id);
    if (files && files.length > 0) {
      await supabase.storage.from("avatars").remove(files.map(f => `${user.id}/${f.name}`));
    }
    await updateProfile({ avatar_url: null });
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, refreshProfile, updateProfile, uploadAvatar, removeAvatar }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
