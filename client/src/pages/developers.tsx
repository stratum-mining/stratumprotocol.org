import { useEffect } from 'react';
import { Navigation } from "@/components/Navigation";

export default function DevelopersPage() {
  useEffect(() => {
    // Redirect to the Rust documentation
    window.location.href = 'https://docs.rs/stratum/latest/stratum/';
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-mono mb-8">
            Redirecting to Documentation...
          </h1>
          <p className="text-xl text-muted-foreground">
            You will be redirected to the Rust documentation shortly.
          </p>
        </div>
      </section>
    </main>
  );
}
