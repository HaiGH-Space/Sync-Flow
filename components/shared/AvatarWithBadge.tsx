import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "../ui/avatar";

type AvatarWithBadgeProps = {
  src: string;
  alt: string;
  avtFallback: string;
  status: "online" | "offline" | "busy" | "away";
};

export function AvatarWithBadge({
  src,
  alt,
  avtFallback,
  status,
}: AvatarWithBadgeProps) {
  return (
    <Avatar>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{avtFallback}</AvatarFallback>
      <AvatarBadge
        className={
          status === "online"
            ? "bg-green-600 dark:bg-green-800"
            : status === "offline"
              ? "bg-gray-600 dark:bg-gray-800"
              : status === "busy"
                ? "bg-red-600 dark:bg-red-800"
                : "bg-yellow-600 dark:bg-yellow-800"
        }
      />
    </Avatar>
  );
}
