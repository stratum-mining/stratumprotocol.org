import "../global.css";
import { Navigation } from "@/components/Navigation";
import { PoolConnectionWizard } from "sv2-wizard";

export default function GetStartedRoute() {
  return (
    <main className='min-h-screen bg-background text-foreground'>
      <Navigation />
      <div 
        data-wizard-container
        className="min-h-screen"
        style={{
          background: "radial-gradient(circle at top, rgba(15,118,110,0.35), transparent 55%), radial-gradient(circle at bottom, rgba(30,64,175,0.35), transparent 50%), hsl(var(--background))",
          padding: "3rem 1rem",
          paddingTop: "6rem",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <PoolConnectionWizard />
        </div>
      </div>
    </main>
  );
}

