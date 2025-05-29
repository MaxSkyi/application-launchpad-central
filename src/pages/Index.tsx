import { useState, useEffect } from "react";
import { AppHeader } from "@/components/AppHeader";
import { SearchAndFilters } from "@/components/SearchAndFilters";
import { StatsCards } from "@/components/StatsCards";
import { ApplicationGrid } from "@/components/ApplicationGrid";
import { ApplicationModals } from "@/components/ApplicationModals";
import { useApplications } from "@/hooks/useApplications";
import { useSettings } from "@/hooks/useSettings";
import { useToast } from "@/hooks/use-toast";
import { launchApplication } from "@/utils/applicationLauncher";
import { TerminalWindow } from "@/components/TerminalWindow";
import { useTerminal } from "@/hooks/useTerminal";

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
  archiveStructure?: any;
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
  const { terminalState, openTerminal, closeTerminal, addLog, stopApplication } = useTerminal();

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

  const handleLaunchApp = async (app: Application) => {
    console.log(`Attempting to launch ${app.name}...`);
    
    try {
      const success = await launchApplication(app, openTerminal, addLog);
      
      if (success) {
        toast({
          title: "Application Launched",
          description: `${app.name} is starting...`,
        });
      } else {
        toast({
          title: "Launch Failed",
          description: `Failed to launch ${app.name}. Please check the executable path.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Launch error:', error);
      toast({
        title: "Launch Error",
        description: `An error occurred while launching ${app.name}.`,
        variant: "destructive",
      });
    }
  };

  const handleStopApplication = () => {
    stopApplication();
    toast({
      title: "Application Stopped",
      description: `${terminalState.applicationName} has been terminated.`,
      variant: "destructive",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <AppHeader
          onSettingsClick={() => setIsSettingsOpen(true)}
          onAddApplicationClick={() => setIsAddModalOpen(true)}
        />

        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          customCategories={settings.customCategories}
        />

        <StatsCards applications={applications} />

        <ApplicationGrid
          applications={filteredApplications}
          viewMode={viewMode}
          onLaunchApp={handleLaunchApp}
          onEditApp={handleEditApp}
          onDeleteApp={handleDeleteApp}
          totalApplications={applications.length}
        />

        <ApplicationModals
          isAddModalOpen={isAddModalOpen}
          onAddModalOpenChange={setIsAddModalOpen}
          onAddApplication={handleAddApplication}
          isSettingsOpen={isSettingsOpen}
          onSettingsOpenChange={setIsSettingsOpen}
          editingApplication={editingApplication}
          onEditingApplicationChange={setEditingApplication}
          onUpdateApplication={handleUpdateApplication}
          deletingApplication={deletingApplication}
          onDeletingApplicationChange={setDeletingApplication}
          onConfirmDelete={performDelete}
        />

        <TerminalWindow
          isOpen={terminalState.isOpen}
          onClose={closeTerminal}
          applicationName={terminalState.applicationName}
          logs={terminalState.logs}
          isRunning={terminalState.isRunning}
          onStop={handleStopApplication}
        />
      </div>
    </div>
  );
};

export default Index;
