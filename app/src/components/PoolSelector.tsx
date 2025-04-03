import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Download } from "lucide-react";

const softwareRequirements = [
  {
    name: "Translation Proxy",
    description: "Converts SV1 messages to SV2 format",
    downloadUrl: "https://github.com/stratum-mining/stratum/releases"
  },
  {
    name: "Job Declarator Client",
    description: "Handles local transaction selection",
    downloadUrl: "https://github.com/stratum-mining/stratum/releases"
  },
  {
    name: "Bitcoin Core",
    description: "Required for transaction validation",
    downloadUrl: "https://bitcoin.org/en/download"
  }
];

const pools = [
  {
    name: "Foundation Pool",
    description: "Official Stratum V2 reference implementation pool",
    instructions: "stratum+tcp://sv2.foundationpool.org:3333",
  },
  {
    name: "Braiins Pool",
    description: "Enterprise-grade mining pool with SV2 support",
    instructions: "stratum+tcp://stratum-sv2.braiins.com:3333",
  },
  {
    name: "F2Pool",
    description: "One of the largest pools supporting Stratum V2",
    instructions: "stratum+tcp://sv2.f2pool.com:3333",
  }
];

export function PoolSelector({ buttonClassName = "", buttonText = "Start Mining" }: { buttonClassName?: string; buttonText?: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [downloads, setDownloads] = useState<string[]>([]);

  const handleDownload = (software: string) => {
    setDownloads(prev => [...prev, software]);
  };

  const allDownloadsComplete = downloads.length === softwareRequirements.length;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className={buttonClassName || "bg-cyan-500 hover:bg-cyan-600 text-background"}
          aria-label={buttonText}
        >
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{currentStep === 1 ? "Step 1: Download Required Software" : "Step 2: Choose a Mining Pool"}</DialogTitle>
          <DialogDescription>
            {currentStep === 1 
              ? "Install these components to start mining with Stratum V2"
              : "Select a Stratum V2 compatible pool to start mining"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={2}>
          <div className={`h-1 flex-1 rounded ${currentStep >= 1 ? 'bg-cyan-500' : 'bg-muted'}`} />
          <div className={`h-1 flex-1 rounded ${currentStep >= 2 ? 'bg-cyan-500' : 'bg-muted'}`} />
        </div>

        <div className="grid gap-4 py-4">
          {currentStep === 1 ? (
            <>
              {softwareRequirements.map((software) => (
                <Card 
                  key={software.name} 
                  className={`p-4 ${downloads.includes(software.name) ? 'border-cyan-500/50' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <Download className={`w-5 h-5 ${downloads.includes(software.name) ? 'text-cyan-500' : 'text-muted-foreground'} mt-1`} />
                    <div className="flex-1">
                      <h3 className="font-mono mb-1">{software.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{software.description}</p>
                      <Button 
                        variant={downloads.includes(software.name) ? "outline" : "default"}
                        size="sm" 
                        asChild
                        onClick={() => handleDownload(software.name)}
                      >
                        <a 
                          href={software.downloadUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label={`Download ${software.name}`}
                        >
                          {downloads.includes(software.name) ? 'Downloaded' : 'Download'}
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              <Button 
                className="mt-4"
                onClick={() => {
                  setCurrentStep(2);
                  setCompletedSteps(prev => [...prev, 1]);
                }}
                disabled={!allDownloadsComplete}
                aria-label="Proceed to pool selection"
              >
                Next: Select Pool
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              {pools.map((pool) => (
                <Card 
                  key={pool.name} 
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedPool === pool.name ? 'border-cyan-500' : ''
                  }`}
                  onClick={() => setSelectedPool(pool.name)}
                  role="button"
                  aria-pressed={selectedPool === pool.name}
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedPool(pool.name);
                    }
                  }}
                >
                  <h3 className="font-mono mb-2">{pool.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{pool.description}</p>
                  {selectedPool === pool.name && (
                    <div className="bg-muted p-2 rounded text-sm font-mono">
                      {pool.instructions}
                    </div>
                  )}
                </Card>
              ))}
              <div className="flex justify-between mt-4">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  aria-label="Return to software download step"
                >
                  Back to Software Requirements
                </Button>
                {selectedPool && (
                  <Button 
                    onClick={() => {
                      setCompletedSteps(prev => [...prev, 2]);
                    }}
                    className="bg-cyan-500 hover:bg-cyan-600 text-background"
                  >
                    Connect to Pool
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
