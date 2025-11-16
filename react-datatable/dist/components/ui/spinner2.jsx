import { LoaderIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner2({
  className,
  ...props
}) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props} />
  );
}

export { Spinner2 }
