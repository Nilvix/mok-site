import { MokLogo } from "./MokLogo";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  tagline?: boolean;
  animated?: boolean;
};

/** Логотип МОК. Размер задаётся шириной через className (например, "w-28"). */
export function LogoMark({ className, tagline, animated }: Props) {
  return (
    <MokLogo className={cn("w-28 md:w-32", className)} tagline={tagline} animated={animated} />
  );
}
