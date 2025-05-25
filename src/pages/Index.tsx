
import { useState } from "react";
import { Search, Plus, Grid, List, Settings, Folder, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApplicationCard } from "@/components/ApplicationCard";
import { AddApplicationModal } from "@/components/AddApplicationModal";
import { SettingsModal } from "@/components/SettingsModal";

// Mock data for applications
const mockApplications = [
  {
    id: "1",
    name: "Code Editor Pro",
    description: "Advanced code editor with syntax highlighting",
    icon: "/placeholder.svg",
    size: "145 MB",
    dateAdded: "2024-01-15",
    category: "Development",
    tags: ["editor", "development", "coding"],
    executable: "editor.exe"
  },
  {
    id: "2",
    name: "Image Processor",
    description: "Batch image processing tool",
    icon: "/placeholder.svg",
    size: "89 MB",
    dateAdded: "2024-01-12",
    category: "Graphics",
    tags: ["images", "processing", "batch"],
    executable: "processor.exe"
  },
  {
    id: "3",
    name: "Data Analyzer",
    description: "Statistical data analysis application",
    icon: "/placeholder.svg",
    size: "256 MB",
    dateAdded: "2024-01-10",
    category: "Analytics",
    tags: ["data", "statistics", "analysis"],
    executable: "analyzer.exe"
  },
  {
    id: "4",
    name: "Music Player",
    description: "High-quality audio player",
    icon: "/placeholder.svg",
    size: "78 MB",
    dateAdded: "2024-01-08",
    category: "Media",
    tags: ["music", "audio", "player"],
    executable: "player.exe"
  }
];

const categories = ["All", "Development", "Graphics", "Analytics", "Media", "Utilities"];

const Index = () => {
  const [applications, setApplications] = useState(mockApplications);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLaunchApp = (app: any) => {
    console.log(`Launching ${app.name}...`);
    // In a real app, this would trigger the extraction and launch process
  };

  const handleDeleteApp = (appId: string) => {
    setApplications(apps => apps.filter(app => app.id !== appId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Application Hub</h1>
            <p className="text-gray-600">Manage and launch your applications from one place</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Application
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length - 1}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">568 MB</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Last Added</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Today</div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Grid/List */}
        {filteredApplications.length > 0 ? (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredApplications.map(app => (
              <ApplicationCard
                key={app.id}
                application={app}
                viewMode={viewMode}
                onLaunch={() => handleLaunchApp(app)}
                onDelete={() => handleDeleteApp(app.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">Try adjusting your search or add a new application.</p>
          </div>
        )}

        {/* Modals */}
        <AddApplicationModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onAddApplication={(newApp) => {
            setApplications(prev => [...prev, { ...newApp, id: Date.now().toString() }]);
          }}
        />

        <SettingsModal
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />
      </div>
    </div>
  );
};

export default Index;
