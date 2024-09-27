import React, { forwardRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrlForUser } from "@/lib/github";
import { CircleUser } from "lucide-react";
import { useSession } from "next-auth/react";

interface GitHubAvatarProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
  username?: string;
}

const GitHubAvatar = forwardRef<HTMLDivElement, GitHubAvatarProps>(
  ({ className, username, ...props }, ref) => {
    const { data: session } = useSession();

    return (
      <Avatar ref={ref} className={`${className}`} {...props}>
        <AvatarImage
          src={getAvatarUrlForUser(username || session?.username || "")}
          alt={`GitHub Profile Picture for ${username}`}
        />
        <AvatarFallback>
          <CircleUser className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
    );
  },
);

GitHubAvatar.displayName = "GitHubAvatar";

export default GitHubAvatar;
