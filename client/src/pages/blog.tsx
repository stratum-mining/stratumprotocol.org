import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const blogPosts = [
  {
    title: "The Future of Bitcoin Mining with Stratum V2",
    excerpt: "Explore how Stratum V2 is revolutionizing Bitcoin mining with enhanced security and efficiency.",
    date: "February 22, 2025",
    readTime: "5 min read",
    category: "Technology"
  },
  {
    title: "Case Study: Major Mining Operation Switches to SV2",
    excerpt: "Learn how one of the largest mining operations improved efficiency by 30% after implementing Stratum V2.",
    date: "February 20, 2025",
    readTime: "8 min read",
    category: "Case Study"
  },
  {
    title: "Security Deep Dive: Stratum V2 vs Legacy Protocol",
    excerpt: "Technical analysis of security improvements in Stratum V2 compared to SV1.",
    date: "February 18, 2025",
    readTime: "10 min read",
    category: "Security"
  }
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-6xl md:text-7xl font-mono mb-8 text-center">
            Latest Updates
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-center">
            Stay informed about Stratum V2 development, implementations, and success stories
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {blogPosts.map((post, index) => (
              <Card key={index} className="p-6 bg-black/20">
                <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl font-mono mb-4">{post.title}</h2>
                <p className="text-muted-foreground mb-6">{post.excerpt}</p>
                <Button variant="ghost" className="group">
                  Read More
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
