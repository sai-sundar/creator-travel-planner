"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Plane, Calendar, TrendingUp, Sparkles, MapPin } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session?.user) {
      router.push("/dashboard");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Plane className="h-12 w-12 animate-bounce text-primary" />
      </div>
    );
  }

  if (session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Creator's Travel Toolkit</span>
          </div>
          <div className="flex gap-3">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Plan. Create. Share. Grow.
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Your Ultimate
            <span className="block text-primary mt-2">Travel Content Hub</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Plan your trips, schedule content, and grow your audience with AI-powered captions and location suggestions. Built for travel creators who want to focus on creating.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Free Today
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto">
          <div className="bg-card p-8 rounded-2xl border shadow-sm">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Trip Planning</h3>
            <p className="text-muted-foreground">
              Organize destinations, dates, and platforms all in one place. Never miss a posting opportunity.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl border shadow-sm">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Content Calendar</h3>
            <p className="text-muted-foreground">
              Visual calendar with AI-generated captions in multiple tones. Schedule posts across all platforms.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl border shadow-sm">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Trending Insights</h3>
            <p className="text-muted-foreground">
              Access trending hashtags and location suggestions to maximize your content reach.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}