
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/hooks/useSettings";
import { CustomCategoriesManager } from "@/components/CustomCategoriesManager";

interface FunctionalSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FunctionalSettingsModal = ({ open, onOpenChange }: FunctionalSettingsModalProps) => {
  const { settings, updateSettings, updateCustomCategories } = useSettings();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Display Preferences</Label>
            
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
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-base font-medium">Application Management</Label>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="confirm-deletes">Confirm Deletes</Label>
                <p className="text-sm text-muted-foreground">
                  Show confirmation dialog before deleting applications
                </p>
              </div>
              <Switch
                id="confirm-deletes"
                checked={settings.confirmDeletes}
                onCheckedChange={(checked) => updateSettings({ confirmDeletes: checked })}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-base font-medium">Custom Categories</Label>
            <CustomCategoriesManager
              customCategories={settings.customCategories}
              onUpdateCategories={updateCustomCategories}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
