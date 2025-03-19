import { cn } from "@/lib/utils";
import { memo, PropsWithChildren, HTMLAttributes } from "react";

type H4Props = PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>;

function H4({ children, className, ...props }: H4Props) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h4>
  );
}

const TypographyH4 = memo(H4);

export { TypographyH4 };
