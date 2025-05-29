
import { useState } from "react";
import { Folder, Save, HardDrive, Archive, Settings, Bell, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings } from "@/hooks/useSettings";
import { CustomCategoriesManager } from "@/components/CustomCategoriesManager";

interface FunctionalSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FunctionalSettingsModal = ({ open, onOpenChange }: FunctionalSettingsModalProps) => {
  const { settings, updateSettings, updateCustomCategories } = useSettings();

  const handleBrowseDirectory = (type: "storage" | "temp") => {
    // In a real app, this would open a directory picker dialog
    console.log(`Browse ${type} directory`);
    // For now, show a simulated directory path
    const demoPath = type === "storage" 
      ? "/Users/Documents/ApplicationHub/storage" 
      : "/Users/Documents/ApplicationHub/temp";
    updateSettings({ 
      [type === "storage" ? "storageDirectory" : "tempDirectory"]: demoPath 
    });
  };

  const handleSave = () => {
    console.log("Settings saved successfully");
    onOpenChange(false);
  };

  const clearTempFiles = () => {
    console.log("Clearing temporary files...");
    // Simulate temp file cleanup
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Application Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Storage Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Storage Configuration
              </CardTitle>
              <CardDescription>
                Configure where applications and temporary files are stored
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storage-dir">Application Storage Directory</Label>
                <div className="flex gap-2">
                  <Input
                    id="storage-dir"
                    value={settings.storageDirectory}
                    onChange={(e) => updateSettings({ storageDirectory: e.target.value })}
                    className="flex-1 font-mono text-sm"
                    placeholder="/path/to/storage"
                  />
                  <Button variant="outline" onClick={() => handleBrowseDirectory("storage")}>
                    <Folder className="h-4 w-4 mr-2" />
                    Browse
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Where extracted applications will be permanently stored
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temp-dir">Temporary Extraction Directory</Label>
                <div className="flex gap-2">
                  <Input
                    id="temp-dir"
                    value={settings.tempDirectory}
                    onChange={(e) => updateSettings({ tempDirectory: e.target.value })}
                    className="flex-1 font-mono text-sm"
                    placeholder="/path/to/temp"
                  />
                  <Button variant="outline" onClick={() => handleBrowseDirectory("temp")}>
                    <Folder className="h-4 w-4 mr-2" />
                    Browse
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Temporary location for archive extraction during processing
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label>Auto-clean temporary files</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically delete temporary files after launching applications
                  </p>
                </div>
                <Switch
                  checked={settings.autoCleanTemp}
                  onCheckedChange={(checked) => updateSettings({ autoCleanTemp: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Archive Processing Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Archive className="h-5 w-5" />
                Archive Processing
              </CardTitle>
              <CardDescription>
                Configure how archive files are processed and handled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="max-size">Maximum Archive Size (MB)</Label>
                <Input
                  id="max-size"
                  type="number"
                  value={Math.round(settings.maxFileSize / (1024 * 1024))}
                  onChange={(e) => updateSettings({ 
                    maxFileSize: parseInt(e.target.value) * 1024 * 1024 
                  })}
                  className="w-32"
                  min="1"
                  max="2048"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum size for uploaded archive files
                </p>
              </div>

              <div className="space-y-2">
                <Label>Supported Archive Formats</Label>
                <div className="flex flex-wrap gap-2">
                  {settings.allowedExtensions.map((ext) => (
                    <span key={ext} className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                      {ext}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently supported archive formats for application installation
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Display Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Display & Interface</CardTitle>
              <CardDescription>
                Configure how applications are displayed and interface behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="default-view">Default View Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose how applications are displayed by default
                  </p>
                </div>
                <Select 
                  value={settings.defaultView} 
                  onValueChange={(value: 'grid' | 'list') => updateSettings({ defaultView: value })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Confirm before delete</Label>
                  <p className="text-sm text-muted-foreground">
                    Show confirmation dialog before deleting applications
                  </p>
                </div>
                <Switch
                  checked={settings.confirmDeletes}
                  onCheckedChange={(checked) => updateSettings({ confirmDeletes: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications & Alerts
              </CardTitle>
              <CardDescription>
                Configure system notifications and alert preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable system notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Show desktop notifications for application status and operations
                  </p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => updateSettings({ enableNotifications: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Custom Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custom Categories</CardTitle>
              <CardDescription>
                Manage your custom application categories for better organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomCategoriesManager
                customCategories={settings.customCategories}
                onUpdateCategories={updateCustomCategories}
              />
            </CardContent>
          </Card>

          {/* Storage Information & Maintenance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Storage & Maintenance</CardTitle>
              <CardDescription>
                View storage usage and perform maintenance operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-muted-foreground">Total Applications</p>
                  <p className="font-medium">4 applications</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Storage Used</p>
                  <p className="font-medium">568 MB</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Available Space</p>
                  <p className="font-medium">45.2 GB</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Temporary Files</p>
                  <p className="font-medium">12 MB</p>
                </div>
              </div>

              <div className="pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearTempFiles}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clean Temporary Files
                </Button>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  Remove temporary extraction files to free up space
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
