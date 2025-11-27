import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
} from "@/components/ui/dialog";
import { ArrowRight, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import React from "react";
import { PoolConnectionWizard } from "sv2-wizard";

// Custom DialogContent for wizard
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-7xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

type PoolSelectorProps = {
  buttonClassName?: string;
  buttonText?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function PoolSelector({ 
  buttonClassName = "", 
  buttonText,
  open,
  onOpenChange
}: PoolSelectorProps) {
  const { t } = useTranslation();
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <button
            className={
              buttonClassName ||
              "bg-cyan-custom-100 hover:bg-cyan-custom-200 text-background font-dm-mono text-base md:text-lg lg:text-xl leading-[100%] h-14 flex items-center justify-between min-w-[80vw] sm:min-w-[20.125rem] py-[17.5px] px-5"
            }
            aria-label={buttonText || t('poolSelector.startMining')}
          >
            {buttonText || t('poolSelector.startMining')}
            <ArrowRight className='w-6 h-6' />
          </button>
        </DialogTrigger>
      )}
      <DialogContent className="bg-background border-gray-800 p-0 rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-6 pt-5 pb-2 sticky top-0 bg-background z-10 border-b border-gray-800">
          <DialogTitle className="text-foreground text-xl font-mono">{t('poolSelector.title')}</DialogTitle>
          <DialogClose asChild>
            <button className="text-gray-400 hover:text-gray-200" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </div>
        
        <div 
          data-wizard-container
          className="p-6"
          style={{
            background: "radial-gradient(circle at top, rgba(15,118,110,0.35), transparent 55%), radial-gradient(circle at bottom, rgba(30,64,175,0.35), transparent 50%), hsl(var(--background))",
          }}
        >
          <PoolConnectionWizard />
        </div>
      </DialogContent>
    </Dialog>
  );
}
