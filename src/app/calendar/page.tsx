"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Plus, Sparkles, Loader2, Edit, Download, Copy } from "lucide-react";
import { toast } from "sonner";

interface ContentItem {
  id: number;
  scheduledDate: string;
  caption: string;
  tone: string;
  locationSuggestion: string;
  hashtags: string;
  status: string;
}

const tones = ["professional", "casual", "inspirational", "humorous"];

export default function CalendarPage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  // Form state
  const [scheduledDate, setScheduledDate] = useState("");
  const [caption, setCaption] = useState("");
  const [tone, setTone] = useState("casual");
  const [locationSuggestion, setLocationSuggestion] = useState("");
  const [hashtags, setHashtags] = useState("");

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/content-calendar", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContentItems(data.content || []);
      }
    } catch (error) {
      console.error("Failed to fetch content:", error);
      toast.error("Failed to load calendar");
    } finally {
      setIsLoading(false);
    }
  };

  const generateAICaption = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI generation
      const aiCaptions = {
        professional: `Exploring ${locationSuggestion || "new destinations"} with purpose and passion. Every journey brings new perspectives and opportunities for growth.`,
        casual: `Just vibing in ${locationSuggestion || "this amazing place"} ✨ Can't believe I'm actually here! Living my best life rn 🌟`,
        inspirational: `Sometimes you need to step away from the ordinary to discover the extraordinary. ${locationSuggestion || "This place"} reminded me that the world is full of endless possibilities 🌍💫`,
        humorous: `Me: I'll just take a quick trip\nAlso me: *books 3 months in ${locationSuggestion || "paradise"}* 😂 No regrets though! #WorthIt`,
      };

      setCaption(aiCaptions[tone as keyof typeof aiCaptions]);
      toast.success("AI caption generated!");
    } catch (error) {
      toast.error("Failed to generate caption");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/content-calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          scheduledDate,
          caption,
          tone,
          locationSuggestion,
          hashtags,
        }),
      });

      if (response.ok) {
        toast.success("Content scheduled successfully!");
        setIsDialogOpen(false);
        resetForm();
        fetchContent();
      } else {
        toast.error("Failed to schedule content");
      }
    } catch (error) {
      console.error("Failed to create content:", error);
      toast.error("Failed to schedule content");
    }
  };

  const resetForm = () => {
    setScheduledDate("");
    setCaption("");
    setTone("casual");
    setLocationSuggestion("");
    setHashtags("");
  };

  const handleCopyCaption = (item: ContentItem) => {
    const fullCaption = `${item.caption}\n\n${item.hashtags}`;
    navigator.clipboard.writeText(fullCaption);
    toast.success("Caption copied to clipboard!");
  };

  const handleExportPDF = () => {
    toast.info("PDF export feature coming soon!");
  };

  const handleExportGoogleCalendar = () => {
    toast.info("Google Calendar export coming soon!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Plan and schedule your travel content with AI assistance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-5 w-5" />
                  Add Content
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Schedule New Content</DialogTitle>
                  <DialogDescription>
                    Create content with AI-powered caption suggestions
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Scheduled Date *</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location Suggestion</Label>
                    <Input
                      id="location"
                      value={locationSuggestion}
                      onChange={(e) => setLocationSuggestion(e.target.value)}
                      placeholder="e.g., Eiffel Tower, Paris"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tone">Caption Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="inspirational">Inspirational</SelectItem>
                        <SelectItem value="humorous">Humorous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="caption">Caption *</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateAICaption}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate AI Caption
                          </>
                        )}
                      </Button>
                    </div>
                    <Textarea
                      id="caption"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write your caption or use AI to generate one..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hashtags">Hashtags</Label>
                    <Input
                      id="hashtags"
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                      placeholder="#travel #wanderlust #adventure"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Schedule Content</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : contentItems.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No content scheduled</h3>
                <p className="text-muted-foreground mb-6">
                  Start planning your content calendar
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Content
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {contentItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {new Date(item.scheduledDate).toLocaleDateString()}
                    </Badge>
                    <Badge variant={item.status === "scheduled" ? "default" : "outline"}>
                      {item.status}
                    </Badge>
                  </div>
                  {item.locationSuggestion && (
                    <CardDescription className="flex items-center gap-1 mt-2">
                      <CalendarIcon className="h-3 w-3" />
                      {item.locationSuggestion}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm line-clamp-3">{item.caption}</p>
                  </div>
                  {item.hashtags && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {item.hashtags}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {item.tone}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleCopyCaption(item)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}