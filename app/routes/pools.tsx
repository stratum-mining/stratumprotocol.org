import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Shield, Zap, Scale } from 'lucide-react';

export default function PoolsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-mono mb-8">
            Future-Proof Your mining Pool
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Stay ahead of the curve with enhanced security, reduced bandwidth
            costs, and simplified regulatory compliance
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <Shield className="w-12 h-12 text-cyan-500 mb-4" />
              <h3 className="text-xl font-mono mb-2">Enhanced Security</h3>
              <p className="text-muted-foreground">
                Built-in encryption and authentication protect against
                unauthorized access and hashrate theft
              </p>
            </Card>

            <Card className="p-6">
              <Zap className="w-12 h-12 text-cyan-500 mb-4" />
              <h3 className="text-xl font-mono mb-2">Reduced Overhead</h3>
              <p className="text-muted-foreground">
                Binary protocol reduces bandwidth usage by up to 75% compared to
                Stratum V1
              </p>
            </Card>

            <Card className="p-6">
              <Scale className="w-12 h-12 text-cyan-500 mb-4" />
              <h3 className="text-xl font-mono mb-2">Regulatory Ready</h3>
              <p className="text-muted-foreground">
                Transparent transaction selection process simplifies regulatory
                compliance
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-mono mb-8 text-center">
            Getting Started
          </h2>
          <div className="max-w-2xl mx-auto bg-background p-8 rounded-lg">
            <pre className="bg-muted p-4 rounded mb-4 overflow-x-auto">
              <code>
                {`# Clone the repository
git clone https://github.com/stratum-mining/stratum
cd stratum

# Build the pool implementation
cargo build --release

# Configure your pool
cp config.example.toml config.toml
# Edit config.toml with your settings

# Start the pool
./target/release/sv2-pool
`}
              </code>
            </pre>
            <Button className="w-full">
              View Full Documentation
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
