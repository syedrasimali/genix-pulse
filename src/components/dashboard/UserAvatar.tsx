import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-16 w-16" };
const textMap = { sm: "text-xs", md: "text-sm", lg: "text-xl" };

const UserAvatar = ({ className, size = "md" }: UserAvatarProps) => {
  const { profile } = useProfile();
  const { user } = useAuth();

  const initials = (profile?.display_name || user?.email || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className={cn(sizeMap[size], className)}>
      {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt="Avatar" />}
      <AvatarFallback className={cn("bg-primary/20 text-primary-glow font-semibold", textMap[size])}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
