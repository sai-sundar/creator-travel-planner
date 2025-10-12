"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, Edit, Trash2, TrendingUp, MapPin } from "lucide-react";
import { toast } from "sonner";

interface Location {
  id: number;
  name: string;
  country: string;
  category: string;
  description: string;
  bestTimeToVisit: string;
  trendingScore: number;
}

interface Tag {
  id: number;
  tagName: string;
  usageCount: number;
  category: string;
}

const categories = ["beach", "city", "cultural", "adventure", "mountain", "nature"];
const tagCategories = ["travel", "adventure", "photography", "food", "luxury", "lifestyle"];

export default function AdminPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);

  // Location form state
  const [locationName, setLocationName] = useState("");
  const [locationCountry, setLocationCountry] = useState("");
  const [locationCategory, setLocationCategory] = useState("city");
  const [locationDescription, setLocationDescription] = useState("");
  const [locationBestTime, setLocationBestTime] = useState("");
  const [locationScore, setLocationScore] = useState(50);

  // Tag form state
  const [tagName, setTagName] = useState("");
  const [tagUsageCount, setTagUsageCount] = useState(0);
  const [tagCategory, setTagCategory] = useState("travel");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      
      const [locationsRes, tagsRes] = await Promise.all([
        fetch("/api/admin/locations", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/tags", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (locationsRes.ok) {
        const locData = await locationsRes.json();
        setLocations(locData.locations || []);
      }

      if (tagsRes.ok) {
        const tagData = await tagsRes.json();
        setTags(tagData.tags || []);
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitLocation = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/admin/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: locationName,
          country: locationCountry,
          category: locationCategory,
          description: locationDescription,
          bestTimeToVisit: locationBestTime,
          trendingScore: locationScore,
        }),
      });

      if (response.ok) {
        toast.success("Location added successfully!");
        setIsLocationDialogOpen(false);
        resetLocationForm();
        fetchData();
      } else {
        toast.error("Failed to add location");
      }
    } catch (error) {
      console.error("Failed to create location:", error);
      toast.error("Failed to add location");
    }
  };

  const handleSubmitTag = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/admin/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tagName: tagName.startsWith("#") ? tagName : `#${tagName}`,
          usageCount: tagUsageCount,
          category: tagCategory,
        }),
      });

      if (response.ok) {
        toast.success("Tag added successfully!");
        setIsTagDialogOpen(false);
        resetTagForm();
        fetchData();
      } else {
        toast.error("Failed to add tag");
      }
    } catch (error) {
      console.error("Failed to create tag:", error);
      toast.error("Failed to add tag");
    }
  };

  const handleDeleteLocation = async (id: number) => {
    if (!confirm("Are you sure you want to delete this location?")) return;

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/admin/locations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Location deleted");
        fetchData();
      } else {
        toast.error("Failed to delete location");
      }
    } catch (error) {
      console.error("Failed to delete location:", error);
      toast.error("Failed to delete location");
    }
  };

  const handleDeleteTag = async (id: number) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/admin/tags/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Tag deleted");
        fetchData();
      } else {
        toast.error("Failed to delete tag");
      }
    } catch (error) {
      console.error("Failed to delete tag:", error);
      toast.error("Failed to delete tag");
    }
  };

  const resetLocationForm = () => {
    setLocationName("");
    setLocationCountry("");
    setLocationCategory("city");
    setLocationDescription("");
    setLocationBestTime("");
    setLocationScore(50);
  };

  const resetTagForm = () => {
    setTagName("");
    setTagUsageCount(0);
    setTagCategory("travel");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage location database and trending tags
          </p>
        </div>

        <Tabs defaultValue="locations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="locations">Location Database</TabsTrigger>
            <TabsTrigger value="tags">Trending Tags</TabsTrigger>
          </TabsList>

          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Travel Destinations</h2>
                <p className="text-sm text-muted-foreground">
                  {locations.length} locations in database
                </p>
              </div>
              <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Location
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Location</DialogTitle>
                    <DialogDescription>
                      Add a popular travel destination to the database
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmitLocation} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="locName">Location Name *</Label>
                        <Input
                          id="locName"
                          value={locationName}
                          onChange={(e) => setLocationName(e.target.value)}
                          placeholder="e.g., Paris"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="locCountry">Country *</Label>
                        <Input
                          id="locCountry"
                          value={locationCountry}
                          onChange={(e) => setLocationCountry(e.target.value)}
                          placeholder="e.g., France"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="locCategory">Category *</Label>
                      <select
                        id="locCategory"
                        value={locationCategory}
                        onChange={(e) => setLocationCategory(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        required
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="locDesc">Description</Label>
                      <Textarea
                        id="locDesc"
                        value={locationDescription}
                        onChange={(e) => setLocationDescription(e.target.value)}
                        placeholder="Brief description of the location..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="locBestTime">Best Time to Visit</Label>
                      <Input
                        id="locBestTime"
                        value={locationBestTime}
                        onChange={(e) => setLocationBestTime(e.target.value)}
                        placeholder="e.g., April to June"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="locScore">Trending Score (0-100)</Label>
                      <Input
                        id="locScore"
                        type="number"
                        min="0"
                        max="100"
                        value={locationScore}
                        onChange={(e) => setLocationScore(parseInt(e.target.value))}
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsLocationDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Location</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {locations.map((location) => (
                  <Card key={location.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{location.name}</CardTitle>
                          <CardDescription>{location.country}</CardDescription>
                        </div>
                        <Badge variant="secondary">{location.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {location.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span>Score: {location.trendingScore}</span>
                      </div>
                      {location.bestTimeToVisit && (
                        <p className="text-xs text-muted-foreground">
                          Best time: {location.bestTimeToVisit}
                        </p>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteLocation(location.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tags Tab */}
          <TabsContent value="tags" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Trending Hashtags</h2>
                <p className="text-sm text-muted-foreground">
                  {tags.length} tags in database
                </p>
              </div>
              <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Tag
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Tag</DialogTitle>
                    <DialogDescription>
                      Add a trending hashtag to the database
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmitTag} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="tagName">Tag Name *</Label>
                      <Input
                        id="tagName"
                        value={tagName}
                        onChange={(e) => setTagName(e.target.value)}
                        placeholder="wanderlust (# will be added automatically)"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tagCategory">Category *</Label>
                      <select
                        id="tagCategory"
                        value={tagCategory}
                        onChange={(e) => setTagCategory(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        required
                      >
                        {tagCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tagUsage">Usage Count</Label>
                      <Input
                        id="tagUsage"
                        type="number"
                        min="0"
                        value={tagUsageCount}
                        onChange={(e) => setTagUsageCount(parseInt(e.target.value))}
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsTagDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Tag</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {tags.map((tag) => (
                  <Card key={tag.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{tag.tagName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {tag.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {tag.usageCount.toLocaleString()} uses
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTag(tag.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}