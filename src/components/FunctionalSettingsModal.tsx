
import { useState } from "react";
import { Settings, Download, Upload, RotateCcw, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/useSettings";

interface FunctionalSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FunctionalSettingsModal = ({ open, onOpenChange }: FunctionalSettingsModalProps) => {
  const { settings, updateSetting, resetSettings, exportSettings, importSettings } = useSettings();
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);

  const handleImportSettings = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await importSettings(file);
      toast({
        title: "Settings Imported",
        description: "Your settings have been successfully imported.",
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import settings. Please check the file format.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      e.target.value = ''; // Reset file input
    }
  };

  const handleExportSettings = () => {
    exportSettings();
    toast({
      title: "Settings Exported",
      description: "Your settings have been downloaded as a JSON file.",
    });
  };

  const handleResetSettings = () => {
    resetSettings();
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to their default values.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Application Hub Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Appearance Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">Theme</Label>
                <Select 
                  value={settings.theme} 
                  onValueChange={(value: 'light' | 'dark' | 'system') => updateSetting('theme', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="defaultView">Default View</Label>
                <Select 
                  value={settings.defaultView} 
                  onValueChange={(value: 'grid' | 'list') => updateSetting('defaultView', value)}
                >
                  <SelectTrigger className="w-32">
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

          {/* Behavior Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Behavior</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoLaunch">Auto-launch on double-click</Label>
                  <p className="text-sm text-gray-500">Launch applications with double-click instead of button</p>
                </div>
                <Switch
                  id="autoLaunch"
                  checked={settings.autoLaunch}
                  onCheckedChange={(checked) => updateSetting('autoLaunch', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showFileExtensions">Show file extensions</Label>
                  <p className="text-sm text-gray-500">Display file extensions in application names</p>
                </div>
                <Switch
                  id="showFileExtensions"
                  checked={settings.showFileExtensions}
                  onCheckedChange={(checked) => updateSetting('showFileExtensions', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="confirmDeletes">Confirm deletions</Label>
                  <p className="text-sm text-gray-500">Show confirmation dialog before deleting applications</p>
                </div>
                <Switch
                  id="confirmDeletes"
                  checked={settings.confirmDeletes}
                  onCheckedChange={(checked) => updateSetting('confirmDeletes', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxRecentApps">
                  Maximum recent applications: {settings.maxRecentApps}
                </Label>
                <Slider
                  id="maxRecentApps"
                  min={5}
                  max={50}
                  step={5}
                  value={[settings.maxRecentApps]}
                  onValueChange={([value]) => updateSetting('maxRecentApps', value)}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleExportSettings}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Settings
                </Button>
                
                <Button variant="outline" asChild disabled={isImporting}>
                  <label htmlFor="import-settings" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    {isImporting ? "Importing..." : "Import Settings"}
                  </label>
                </Button>
                <input
                  id="import-settings"
                  type="file"
                  accept=".json"
                  onChange={handleImportSettings}
                  className="hidden"
                  disabled={isImporting}
                />
                
                <Button variant="outline" onClick={handleResetSettings}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
