import { ReactNode } from "react";

import Typography from "@/components/Typography";
import clsxm from "@/lib/clsxm";

export default function HelperText({
  children,
  helperTextClassName,
}: {
  children: ReactNode;
  helperTextClassName?: string;
}) {
  return (
    <div className="flex space-x-1">
      <Typography
        weight="regular"
        variant="sm"
        className={clsxm(
          "text-sm !leading-tight text-gray-900",
          helperTextClassName,
        )}
      >
        {children}
      </Typography>
    </div>
  );
}
