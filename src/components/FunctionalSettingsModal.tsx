
import { useState } from "react";
import { Folder, Save, HardDrive, Archive, Settings } from "lucide-react";
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
  };

  const handleSave = () => {
    console.log("Settings saved successfully");
    onOpenChange(false);
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
                Storage Settings
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
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => handleBrowseDirectory("storage")}>
                    <Folder className="h-4 w-4 mr-2" />
                    Browse
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temp-dir">Temporary Extraction Directory</Label>
                <div className="flex gap-2">
                  <Input
                    id="temp-dir"
                    value={settings.tempDirectory}
                    onChange={(e) => updateSettings({ tempDirectory: e.target.value })}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => handleBrowseDirectory("temp")}>
                    <Folder className="h-4 w-4 mr-2" />
                    Browse
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Display Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Display Preferences</CardTitle>
              <CardDescription>
                Configure how applications are displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="default-view">Default View</Label>
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
            </CardContent>
          </Card>

          {/* Application Behavior */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Archive className="h-5 w-5" />
                Application Behavior
              </CardTitle>
              <CardDescription>
                Configure how applications are handled and displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-clean temporary files</Label>
                  <p className="text-sm text-gray-500">
                    Automatically delete temporary files after launching applications
                  </p>
                </div>
                <Switch
                  checked={settings.autoCleanTemp}
                  onCheckedChange={(checked) => updateSettings({ autoCleanTemp: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Confirm before delete</Label>
                  <p className="text-sm text-gray-500">
                    Show confirmation dialog before deleting applications
                  </p>
                </div>
                <Switch
                  checked={settings.confirmDeletes}
                  onCheckedChange={(checked) => updateSettings({ confirmDeletes: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable notifications</Label>
                  <p className="text-sm text-gray-500">
                    Show system notifications for application status
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
                Manage your custom application categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomCategoriesManager
                customCategories={settings.customCategories}
                onUpdateCategories={updateCustomCategories}
              />
            </CardContent>
          </Card>

          {/* Storage Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Storage Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Total Applications</p>
                  <p className="font-medium">4 applications</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Storage Used</p>
                  <p className="font-medium">568 MB</p>
                </div>
                <div>
                  <p className="text-gray-500">Available Space</p>
                  <p className="font-medium">45.2 GB</p>
                </div>
                <div>
                  <p className="text-gray-500">Temp Files</p>
                  <p className="font-medium">12 MB</p>
                </div>
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
