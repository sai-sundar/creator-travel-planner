"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, MapPin, Calendar as CalendarIcon, Loader2, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Trip {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface Destination {
  id?: number;
  name: string;
  country: string;
  visitDate: string;
  notes: string;
}

interface Platform {
  id?: number;
  platformName: string;
  isSelected: boolean;
}

const platforms = ["Instagram", "TikTok", "YouTube", "Blog"];

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([{
    name: "",
    country: "",
    visitDate: "",
    notes: ""
  }]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/trips", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTrips(data.trips || []);
      }
    } catch (error) {
      console.error("Failed to fetch trips:", error);
      toast.error("Failed to load trips");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDestination = () => {
    setDestinations([...destinations, { name: "", country: "", visitDate: "", notes: "" }]);
  };

  const handleRemoveDestination = (index: number) => {
    setDestinations(destinations.filter((_, i) => i !== index));
  };

  const handleDestinationChange = (index: number, field: keyof Destination, value: string) => {
    const newDestinations = [...destinations];
    newDestinations[index] = { ...newDestinations[index], [field]: value };
    setDestinations(newDestinations);
  };

  const handlePlatformToggle = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          startDate,
          endDate,
          destinations: destinations.filter(d => d.name && d.country),
          platforms: selectedPlatforms,
        }),
      });

      if (response.ok) {
        toast.success("Trip created successfully!");
        setIsDialogOpen(false);
        resetForm();
        fetchTrips();
      } else {
        toast.error("Failed to create trip");
      }
    } catch (error) {
      console.error("Failed to create trip:", error);
      toast.error("Failed to create trip");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setDestinations([{ name: "", country: "", visitDate: "", notes: "" }]);
    setSelectedPlatforms([]);
  };

  const handleDeleteTrip = async (tripId: number) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/trips/${tripId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Trip deleted successfully");
        fetchTrips();
      } else {
        toast.error("Failed to delete trip");
      }
    } catch (error) {
      console.error("Failed to delete trip:", error);
      toast.error("Failed to delete trip");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Trips</h1>
            <p className="text-muted-foreground mt-1">
              Plan and manage your travel adventures
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create Trip
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Trip</DialogTitle>
                <DialogDescription>
                  Add your trip details, destinations, and select platforms
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Trip Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Southeast Asia Adventure 2024"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of your trip..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Destinations */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Destinations</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddDestination}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Destination
                    </Button>
                  </div>
                  {destinations.map((dest, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6 space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Destination {index + 1}</span>
                          {destinations.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveDestination(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            placeholder="City/Place"
                            value={dest.name}
                            onChange={(e) => handleDestinationChange(index, "name", e.target.value)}
                          />
                          <Input
                            placeholder="Country"
                            value={dest.country}
                            onChange={(e) => handleDestinationChange(index, "country", e.target.value)}
                          />
                        </div>
                        <Input
                          type="date"
                          placeholder="Visit Date"
                          value={dest.visitDate}
                          onChange={(e) => handleDestinationChange(index, "visitDate", e.target.value)}
                        />
                        <Textarea
                          placeholder="Notes (optional)"
                          value={dest.notes}
                          onChange={(e) => handleDestinationChange(index, "notes", e.target.value)}
                          rows={2}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Platforms */}
                <div className="space-y-3">
                  <Label>Select Platforms</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {platforms.map((platform) => (
                      <div key={platform} className="flex items-center space-x-2">
                        <Checkbox
                          id={platform}
                          checked={selectedPlatforms.includes(platform)}
                          onCheckedChange={() => handlePlatformToggle(platform)}
                        />
                        <Label htmlFor={platform} className="cursor-pointer">
                          {platform}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Trip"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Trips List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : trips.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No trips yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start planning your first travel adventure
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Trip
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <Card key={trip.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{trip.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {trip.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="flex-1" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTrip(trip.id)}
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
      </div>
    </DashboardLayout>
  );
}