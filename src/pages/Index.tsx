import { useState, useEffect } from "react";
import { Search, Plus, Grid, List, Settings, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationCard } from "@/components/ApplicationCard";
import { AddApplicationModal } from "@/components/AddApplicationModal";
import { SettingsModal } from "@/components/SettingsModal";
import { FunctionalSettingsModal } from "@/components/FunctionalSettingsModal";
import { EditApplicationModal } from "@/components/EditApplicationModal";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { useApplications } from "@/hooks/useApplications";
import { useSettings } from "@/hooks/useSettings";
import { useToast } from "@/hooks/use-toast";

const categories = ["All", "Development", "Graphics", "Analytics", "Media", "Utilities", "Games", "Productivity"];

interface Application {
  id: string;
  name: string;
  description: string;
  icon: string;
  size: string;
  dateAdded: string;
  category: string;
  tags: string[];
  executable: string;
  fileName?: string;
}

const Index = () => {
  const { applications, addApplication, removeApplication, updateApplication } = useApplications();
  const { settings } = useSettings();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">(settings.defaultView);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [deletingApplication, setDeletingApplication] = useState<Application | null>(null);

  // Update view mode when settings change
  useEffect(() => {
    setViewMode(settings.defaultView);
  }, [settings.defaultView]);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLaunchApp = (app: Application) => {
    console.log(`Launching ${app.name}...`);
    toast({
      title: "Application Launched",
      description: `${app.name} is starting...`,
    });
  };

  const handleEditApp = (app: Application) => {
    setEditingApplication(app);
  };

  const handleDeleteApp = (app: Application) => {
    if (settings.confirmDeletes) {
      setDeletingApplication(app);
    } else {
      performDelete(app);
    }
  };

  const performDelete = (app: Application) => {
    removeApplication(app.id);
    toast({
      title: "Application Removed",
      description: `${app.name} has been removed from the hub.`,
      variant: "destructive",
    });
    setDeletingApplication(null);
  };

  const handleUpdateApplication = (id: string, updates: Partial<Application>) => {
    updateApplication(id, updates);
    toast({
      title: "Application Updated",
      description: "Application details have been saved successfully.",
    });
  };

  const handleAddApplication = (newApp: any) => {
    addApplication(newApp);
    toast({
      title: "Application Added",
      description: `${newApp.name} has been added to your hub.`,
    });
  };

  // Calculate total size
  const totalSize = applications.reduce((total, app) => {
    const sizeNum = parseInt(app.size.replace(/[^\d]/g, ''));
    return total + sizeNum;
  }, 0);

  // Get last added date
  const lastAdded = applications.length > 0 
    ? new Date(Math.max(...applications.map(app => new Date(app.dateAdded).getTime())))
    : null;

  const formatLastAdded = () => {
    if (!lastAdded) return "Never";
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastAdded.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return lastAdded.toLocaleDateString();
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
              <div className="text-2xl font-bold">{new Set(applications.map(app => app.category)).size}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSize} MB</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Last Added</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatLastAdded()}</div>
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
                onEdit={() => handleEditApp(app)}
                onDelete={() => handleDeleteApp(app)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">
              {applications.length === 0 
                ? "Get started by adding your first application." 
                : "Try adjusting your search or add a new application."
              }
            </p>
          </div>
        )}

        {/* Modals */}
        <AddApplicationModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onAddApplication={handleAddApplication}
        />

        <FunctionalSettingsModal
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />

        <EditApplicationModal
          open={!!editingApplication}
          onOpenChange={() => setEditingApplication(null)}
          application={editingApplication}
          onUpdateApplication={handleUpdateApplication}
        />

        <ConfirmDeleteDialog
          open={!!deletingApplication}
          onOpenChange={() => setDeletingApplication(null)}
          applicationName={deletingApplication?.name || ""}
          onConfirm={() => deletingApplication && performDelete(deletingApplication)}
        />
      </div>
    </div>
  );
};

export default Index;
