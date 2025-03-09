import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  children?: React.ReactNode;
}

const GlassCard = ({
  title,
  description,
  footer,
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  children,
  ...props
}: GlassCardProps) => {
  return (
    <Card
      className={cn(
        "border-none bg-white/10 backdrop-blur-md shadow-md rounded-lg",
        className
      )}
      {...props}
    >
      {(title || description) && (
        <CardHeader className={cn("pb-1 pt-3 px-3", headerClassName)}>
          {title && <CardTitle className="text-base">{title}</CardTitle>}
          {description && <CardDescription className="text-xs">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn("px-3 py-2", contentClassName)}>{children}</CardContent>
      {footer && (
        <CardFooter className={cn("pt-1 pb-3 px-3", footerClassName)}>{footer}</CardFooter>
      )}
    </Card>
  );
};

export default GlassCard; 