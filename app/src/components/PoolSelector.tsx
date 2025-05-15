import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import React from "react";

// Custom DialogContent without close button
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const pools = [
  {
    name: "DMND Pool",
    logo: "/assets/svgs/demand-logo.svg",
    website: "https://www.dmnd.work/",
  },
  {
    name: "Braiins Pool",
    logo: "/assets/svgs/braiins-logo.svg",
    website: "https://braiins.com/",
  },
];

type PoolSelectorProps = {
  buttonClassName?: string;
  buttonText?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function PoolSelector({ 
  buttonClassName = "", 
  buttonText = "Start Mining",
  open,
  onOpenChange
}: PoolSelectorProps) {
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  const handleBackClick = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <button
            className={
              buttonClassName ||
              "bg-cyan-custom-100 hover:bg-cyan-custom-200 text-background font-dm-mono text-base md:text-lg lg:text-xl leading-[100%] h-14 flex items-center justify-between min-w-[80vw] sm:min-w-[20.125rem] py-[17.5px] px-5"
            }
            aria-label={buttonText}
          >
            {buttonText}
            <ArrowRight className='w-6 h-6' />
          </button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[490px] bg-black text-white border-gray-800 p-0 rounded-lg overflow-hidden">
        <div className="flex justify-between items-center px-6 pt-5 pb-2">
          <DialogTitle className="text-white text-xl font-mono">Choose a Mining Pool</DialogTitle>
          <DialogClose asChild>
            <button className="text-gray-400 hover:text-gray-200" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </div>
        
        <p className="text-gray-400 text-sm px-6 font-normal pb-2">
          Select a Stratum V2 Compatible Pool to start mining
        </p>

        <div className="flex flex-col gap-5 px-6 pb-6 ">
          {pools.map((pool) => (
            <a 
              key={pool.name}
              href={pool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
              onClick={() => setSelectedPool(pool.name)}
            >
              <Card 
                className={`p-5 cursor-pointer transition-colors bg-zinc-900 border-zinc-800 hover:border-zinc-700 rounded-lg ${
                  selectedPool === pool.name ? 'border-gray-600' : ''
                }`}
                role="button"
                aria-pressed={selectedPool === pool.name}
                tabIndex={0}
              >
                <div className="flex items-start gap-4 px-4 py-3">
                  <div className="flex-shrink-0 h-6 w-6 relative">
                    {pool.name === "DMND Pool" ? (
                      <img 
                        src={pool.logo} 
                        alt={pool.name} 
                        className="h-7 w-7 object-contain" 
                      />
                    ) : (
                      <img 
                        src={pool.logo} 
                        alt={pool.name} 
                        className="h-7 w-7 object-contain" 
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="font-mono text-white text-base mb-1">{pool.name}</h1>
                    <p className="text-sm text-gray-400 font-light leading-tight">{pool.description}</p>
                  </div>
                </div>
              </Card>
            </a>
          ))}
          
          <Button 
            variant="outline"
            className="mt-1 w-full text-white border-zinc-800 hover:bg-zinc-800 rounded-lg h-[46px] font-normal"
            onClick={handleBackClick}
          >
            Back
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
