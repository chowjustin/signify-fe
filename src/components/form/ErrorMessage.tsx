import Typography from "@/components/Typography";

export default function ErrorMessage({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className="flex space-x-1">
      <Typography
        as="p"
        weight="regular"
        variant="sm"
        className={`text-xs !leading-tight text-red-500 ${className}`}
      >
        {children}
      </Typography>
    </div>
  );
}
