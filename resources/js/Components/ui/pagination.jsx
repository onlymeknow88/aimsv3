import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/Components/ui/button"

const Pagination = ({
    className,
    ...props
}) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
    />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn("flex flex-row items-center gap-1", className)}
        {...props}
    />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

const PaginationLink = ({
    isActive,
    size = "icon",
    className,
    variant,
    ...props
}) => (
    <button
        aria-current={isActive ? "page" : undefined}
        type="button"
        className={cn(
            buttonVariants({
                variant: isActive ? "default" : (variant || "ghost"),
                size,
            }),
            className
        )}
        {...props}
    />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
    className,
    ...props
}) => (
    <PaginationLink
        aria-label="Go to previous page"
        size="default"
        variant="outline"
        className={cn("gap-1.5 pl-2.5", className)}
        {...props}
    >
        <ChevronLeft size={16} />
    </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
    className,
    ...props
}) => (
    <PaginationLink
        aria-label="Go to next page"
        size="default"
        variant="outline"
        className={cn("gap-1.5 pr-2.5", className)}
        {...props}
    >
        <ChevronRight size={16} />
    </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
    className,
    ...props
}) => (
    <span
        aria-hidden
        className={cn("flex h-9 w-9 items-center justify-center", className)}
        {...props}
    >
        <MoreHorizontal size={16} />
        <span className="sr-only">More pages</span>
    </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
}
