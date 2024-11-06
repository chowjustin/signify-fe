import { GiCancel } from "react-icons/gi";

import ImagePreview from "@/components/image/ImagePreview";
import ImagePreviewWithFetch from "@/components/image/ImagePreviewWithFetch";
import Typography from "@/components/Typography";
import clsxm from "@/lib/clsxm";

type ImagePreviewCardProps = {
  imgPath: string;
  label?: string;
  caption?: string;
  withFetch?: boolean;
  onDelete?: () => void;
  isLoading: boolean;
  onDeleteLoading?: boolean;
} & React.ComponentPropsWithoutRef<"div">;

export default function ImagePreviewCard({
  imgPath,
  label = "",
  isLoading,
  withFetch = false,
  onDelete,
  onDeleteLoading,
}: ImagePreviewCardProps) {
  return (
    <div className="group relative flex items-center gap-x-4 rounded-xl border border-typo-inline p-3 md:p-4">
      {withFetch ? (
        <ImagePreviewWithFetch
          imgPath={imgPath}
          alt={label}
          label={label}
          width={80}
          height={80}
          className="w-16 md:w-20"
          imgClassName="rounded-md"
        />
      ) : (
        <ImagePreview
          imgSrc={imgPath}
          alt={label}
          label={label}
          width={80}
          height={80}
          className="w-16 md:w-20"
          imgClassName="rounded-md"
        />
      )}
      <div className="w-full space-y-1.5 md:space-y-4">
        <Typography variant="p" className="text-xs text-typo-main">
          {label}
        </Typography>
        <div
          className={clsxm(
            "h-2 overflow-hidden rounded-[4px] bg-white",
            !isLoading && "hidden",
          )}
        >
          <div className="loading h-2 bg-primary-info-main" />
        </div>
      </div>
      {onDelete && (
        <button
          onClick={onDelete}
          className="text-npc-main/50 hover:text-npc-main"
          type="button"
        >
          <GiCancel
            size={26}
            className={clsxm(onDeleteLoading && "animate-spin")}
          />
        </button>
      )}
    </div>
  );
}
