"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const AccordionContext = React.createContext<{
    activeItem: string | null
    setActiveItem: (value: string | null) => void
}>({
    activeItem: null,
    setActiveItem: () => { },
})

const Accordion = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { type?: "single" | "multiple"; collapsible?: boolean }
>(({ className, type = "single", collapsible = false, children, ...props }, ref) => {
    const [activeItem, setActiveItem] = React.useState<string | null>(null)

    const handleSetActiveItem = (value: string | null) => {
        if (activeItem === value && collapsible) {
            setActiveItem(null)
        } else {
            setActiveItem(value)
        }
    }

    return (
        <AccordionContext.Provider value={{ activeItem, setActiveItem: handleSetActiveItem }}>
            <div ref={ref} className={cn("", className)} {...props}>
                {children}
            </div>
        </AccordionContext.Provider>
    )
})
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
    return (
        <div ref={ref} className={cn("border-b", className)} data-value={value} {...props} />
    )
})
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
    const { activeItem, setActiveItem } = React.useContext(AccordionContext)
    // Need to find parent Item value. In a real Radix impl this is handled by context nesting.
    // Here we can use a hack or just require value to be passed? 
    // actually, without complex context nesting, allow me to just traverse up closest data-value?
    // OR simpler: modify AccordionItem to pass its value down via another context.

    // Let's refactor AccordionItem to provide context.
    return (
        <AccordionItemContext.Consumer>
            {(itemValue) => (
                <div className="flex">
                    <button
                        ref={ref}
                        onClick={() => setActiveItem(itemValue)}
                        className={cn(
                            "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                            className
                        )}
                        data-state={activeItem === itemValue ? "open" : "closed"}
                        {...props}
                    >
                        {children}
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    </button>
                </div>
            )}
        </AccordionItemContext.Consumer>
    )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { activeItem } = React.useContext(AccordionContext)
    return (
        <AccordionItemContext.Consumer>
            {(itemValue) => {
                const isOpen = activeItem === itemValue
                if (!isOpen) return null
                return (
                    <div
                        ref={ref}
                        className={cn("overflow-hidden text-sm transition-all animate-in fade-in slide-in-from-top-1", className)}
                        {...props}
                    >
                        <div className="pb-4 pt-0">{children}</div>
                    </div>
                )
            }}
        </AccordionItemContext.Consumer>
    )
})
AccordionContent.displayName = "AccordionContent"

// Helper context for Item
const AccordionItemContext = React.createContext<string>("")

const AccordionItemWrapper = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ value, ...props }, ref) => (
    <AccordionItemContext.Provider value={value}>
        <AccordionItem ref={ref} value={value} {...props} />
    </AccordionItemContext.Provider>
))
AccordionItemWrapper.displayName = "AccordionItem"

export { Accordion, AccordionItemWrapper as AccordionItem, AccordionTrigger, AccordionContent }
