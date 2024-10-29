import * as React from "react";

import clsxm from "@/lib/clsxm";

export enum TypographyVariant {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  sm,
}

enum FontVariant {
  Inter,
}

enum FontWeight {
  thin,
  extralight,
  light,
  regular,
  medium,
  semibold,
  bold,
  extrabold,
  black,
}

type TypographyProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  weight?: keyof typeof FontWeight;
  font?: keyof typeof FontVariant;
  variant?: keyof typeof TypographyVariant;
  children: React.ReactNode;
};

export default function Typography<T extends React.ElementType>({
  as,
  children,
  weight = "regular",
  className,
  font = "Inter",
  variant = "p",
  ...props
}: TypographyProps<T> &
  Omit<React.ComponentProps<T>, keyof TypographyProps<T>>) {
  const Component = as || "p";
  return (
    <Component
      className={clsxm(
        // *=============== Font Type ==================
        "text-black",
        [
          font === "Inter" && [
            "font-inter",
            [
              weight === "regular" && "font-normal",
              weight === "medium" && "font-medium",
              weight === "bold" && "font-bold",
            ],
          ],
        ],
        // *=============== Font Variants ==================
        [
          variant === "h1" && ["sm:text-[80px] sm:leading-[96px]"],
          variant === "h2" && ["sm:text-[72px] sm:leading-[90px]"],
          variant === "h3" && ["sm:text-[64px] sm:leading-[84px]"],
          variant === "h4" && ["sm:text-[48px] sm:leading-[64px]"],
          variant === "h5" && ["sm:text-[32px] sm:leading-[48px]"],
          variant === "h6" && ["sm:text-[24px] sm:leading-[32px]"],
          variant === "p" && ["sm:text-[18px] sm:leading-[24px]"],
          variant === "sm" && ["sm:text-[14px] sm:leading-[20px]"],
        ],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
