"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Fragment } from "react";
import { House } from "lucide-react";

export default function NavigationBreadcrumbs() {
  const pathname = usePathname();

  // Split paths and filter out empty string segments caused by leading/trailing slashes
  const segments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* 1. Always render a base Home item at the absolute root */}
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center gap-1">
            <House size={16} />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.length > 0 && <BreadcrumbSeparator />}

        {/* 2. Map through dynamic structural sub-routes */}
        {segments.map((segment, index) => {
          // Progressively accumulate route path URLs (e.g., "/profile", then "/profile/1234")
          const accumulatedUrl = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          // Capitalize segment text for a cleaner look
          const formattedLabel =
            segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <Fragment key={accumulatedUrl}>
              <BreadcrumbItem>
                <BreadcrumbLink href={accumulatedUrl}>
                  {formattedLabel}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
