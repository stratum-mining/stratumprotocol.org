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
import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Shield, Zap, DollarSign, ArrowRight, Download, Server, Database } from "lucide-react";
import { PoolSelector } from "@/components/PoolSelector";

const casestudies = [
  {
    company: "Genesis Mining",
    metric: "45% reduction",
    description: "in network bandwidth costs after switching to Stratum V2",
    location: "Iceland"
  },
  {
    company: "BitRiver",
    metric: "Zero breaches",
    description: "reported since implementing Stratum V2's enhanced security",
    location: "Russia"
  },
  {
    company: "Foundry",
    metric: "28% increase",
    description: "in mining revenue through optimized transaction selection",
    location: "USA"
  }
];

export default function MinersPage() {
  return (
    <main className="min-h-screen bg-background text-foreground" role="main">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4" aria-labelledby="hero-heading">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">Now Available</Badge>
          <h1 id="hero-heading" className="text-6xl md:text-7xl font-mono mb-8">
            Upgrade Your Mining Operation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Join the next generation of Bitcoin mining with enhanced security,
            reduced costs, and complete control over your operation
          </p>
          <PoolSelector />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 bg-muted/5" aria-labelledby="benefits-heading">
        <div className="container mx-auto">
          <h2 id="benefits-heading" className="sr-only">Benefits of Stratum V2</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-black/20">
              <Shield className="w-12 h-12 text-cyan-500 mb-6" aria-hidden="true" />
              <h3 className="text-2xl font-mono mb-4">Enhanced Security</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>End-to-end encryption</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>Protection against hashrate theft</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>Secure pool authentication</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-black/20">
              <Zap className="w-12 h-12 text-cyan-500 mb-6" aria-hidden="true" />
              <h3 className="text-2xl font-mono mb-4">Improved Efficiency</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>75% less bandwidth usage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>Reduced latency</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>Better hashrate utilization</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-black/20">
              <DollarSign className="w-12 h-12 text-cyan-500 mb-6" aria-hidden="true" />
              <h3 className="text-2xl font-mono mb-4">Revenue Control</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>Direct transaction selection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>Transparent fee distribution</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden="true">•</span>
                  <span>Multiple pool fallback</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-24 px-4" aria-labelledby="case-studies-heading">
        <div className="container mx-auto">
          <h2 id="case-studies-heading" className="text-4xl font-mono mb-16 text-center">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {casestudies.map((study, index) => (
              <Card 
                key={index} 
                className="p-6 bg-black/20"
                tabIndex={0}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-mono">{study.company}</h3>
                    <p className="text-sm text-muted-foreground">{study.location}</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-cyan-500" aria-hidden="true" />
                </div>
                <p className="text-2xl font-mono text-cyan-500 mb-2">{study.metric}</p>
                <p className="text-muted-foreground">{study.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}