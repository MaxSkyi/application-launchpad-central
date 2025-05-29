import { useState } from "react";
import { Upload, FileArchive, X, Folder, File } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/useSettings";
import { readArchiveContents, findExecutableFiles, getFileIcon } from "@/utils/archiveReader";

interface AddApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddApplication: (app: any) => void;
}

const categories = ["Development", "Graphics", "Analytics", "Media", "Utilities", "Games", "Productivity"];

interface FileStructure {
  name: string;
  type: 'file' | 'folder';
  path: string;
  size?: number;
  children?: FileStructure[];
}

export const AddApplicationModal = ({ open, onOpenChange, onAddApplication }: AddApplicationModalProps) => {
  const { toast } = useToast();
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    mainExecutable: "",
    tags: ""
  });
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedStructure, setExtractedStructure] = useState<FileStructure | null>(null);
  const [selectedExecutable, setSelectedExecutable] = useState<string>("");
  const [availableExecutables, setAvailableExecutables] = useState<string[]>([]);

  const validateFile = (file: File): boolean => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!settings.allowedExtensions.includes(extension)) {
      toast({
        title: "Invalid File Type",
        description: `Please upload a file with one of these extensions: ${settings.allowedExtensions.join(', ')}`,
        variant: "destructive",
      });
      return false;
    }

    if (file.size > settings.maxFileSize) {
      toast({
        title: "File Too Large",
        description: `File size must be less than ${settings.maxFileSize / (1024 * 1024)}MB`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    
    try {
      console.log(`Processing archive in temp directory: ${settings.tempDirectory}`);
      console.log(`Will be stored in: ${settings.storageDirectory}`);
      
      // Read actual archive contents using improved reader
      const structure = await readArchiveContents(file);
      
      if (!structure) {
        throw new Error('Failed to read archive contents');
      }
      
      setExtractedStructure(structure);
      
      // Find all executable files in the archive
      const executables = findExecutableFiles(structure);
      setAvailableExecutables(executables);
      
      // Auto-populate form fields
      const fileName = file.name.replace(/\.(zip|rar|tar|7z|gz)$/i, '');
      const cleanName = fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      setFormData(prev => ({
        ...prev,
        name: prev.name || cleanName,
      }));

      // Auto-select the first executable if only one is found
      if (executables.length === 1) {
        setSelectedExecutable(executables[0]);
        setFormData(prev => ({ ...prev, mainExecutable: executables[0] }));
      }

      toast({
        title: "Archive Analyzed Successfully",
        description: `${file.name} contains ${executables.length} executable files. Real archive structure detected.`,
      });
    } catch (error) {
      toast({
        title: "Archive Processing Error",
        description: "Failed to analyze the archive. Please ensure it's a valid archive file.",
        variant: "destructive",
      });
      console.error('Archive processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderFileTree = (structure: FileStructure, level: number = 0): JSX.Element => {
    const isExecutable = structure.type === 'file' && 
      (structure.name.endsWith('.exe') || structure.name.endsWith('.bat') || structure.name.endsWith('.sh'));
    
    return (
      <div key={structure.path} style={{ marginLeft: `${level * 20}px` }}>
        <div 
          className={`flex items-center gap-2 p-1 rounded cursor-pointer hover:bg-gray-100 ${
            selectedExecutable === structure.path ? 'bg-blue-100 border border-blue-300' : ''
          } ${isExecutable ? 'hover:bg-green-50' : ''}`}
          onClick={() => {
            if (isExecutable) {
              setSelectedExecutable(structure.path);
              setFormData(prev => ({ ...prev, mainExecutable: structure.path }));
            }
          }}
        >
          {structure.type === 'folder' ? (
            <Folder className="h-4 w-4 text-blue-500" />
          ) : (
            <span className="text-sm">{getFileIcon(structure.name)}</span>
          )}
          <span className={`text-sm ${isExecutable ? 'font-medium text-green-700' : ''}`}>
            {structure.name}
          </span>
          {structure.size && (
            <span className="text-xs text-gray-500 ml-auto">
              {formatFileSize(structure.size)}
            </span>
          )}
          {isExecutable && (
            <span className="text-xs bg-green-100 text-green-600 px-1 rounded ml-1">
              Executable
            </span>
          )}
        </div>
        {structure.children?.map(child => renderFileTree(child, level + 1))}
      </div>
    );
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        await processFile(file);
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        await processFile(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !formData.name || !formData.category || !selectedExecutable) {
      toast({
        title: "Missing Information",
        description: "Please provide an archive, name, category, and select an executable file.",
        variant: "destructive",
      });
      return;
    }

    console.log(`Archive will be stored in: ${settings.storageDirectory}`);
    console.log(`Temp extraction directory: ${settings.tempDirectory}`);

    const newApp = {
      name: formData.name,
      description: formData.description || "No description provided",
      icon: "/placeholder.svg",
      size: `${Math.round(selectedFile.size / (1024 * 1024))} MB`,
      dateAdded: new Date().toISOString().split('T')[0],
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      executable: selectedExecutable,
      fileName: selectedFile.name,
      archiveStructure: extractedStructure,
      storageDirectory: settings.storageDirectory,
      tempDirectory: settings.tempDirectory
    };

    onAddApplication(newApp);
    onOpenChange(false);
    
    // Reset form
    setFormData({ name: "", description: "", category: "", mainExecutable: "", tags: "" });
    setSelectedFile(null);
    setExtractedStructure(null);
    setSelectedExecutable("");
    setAvailableExecutables([]);
    
    toast({
      title: "Application Added Successfully",
      description: `${newApp.name} has been added. Archive will be stored in ${settings.storageDirectory}.`,
    });
  };

  const removeFile = () => {
    setSelectedFile(null);
    setExtractedStructure(null);
    setSelectedExecutable("");
    setAvailableExecutables([]);
    setFormData(prev => ({ ...prev, name: "", mainExecutable: "" }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - File Upload */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Archive File</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
                  } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileArchive className="h-8 w-8 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {Math.round(selectedFile.size / (1024 * 1024))} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        disabled={isProcessing}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2">
                        {isProcessing ? "Analyzing archive..." : "Drag & drop an archive file here"}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Supports {settings.allowedExtensions.join(', ')} formats (max {Math.round(settings.maxFileSize / (1024 * 1024))}MB)
                      </p>
                      <Button type="button" variant="outline" asChild disabled={isProcessing}>
                        <label htmlFor="file-upload" className="cursor-pointer">
                          {isProcessing ? "Analyzing..." : "Browse Files"}
                        </label>
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        accept={settings.allowedExtensions.join(',')}
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isProcessing}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Real Archive Contents Display */}
              {extractedStructure && (
                <div className="space-y-2">
                  <Label>Real Archive Contents - Select Executable</Label>
                  <div className="border rounded-lg p-4 max-h-64 overflow-y-auto bg-gray-50">
                    <p className="text-sm text-gray-600 mb-3">
                      📦 Actual contents from <strong>{selectedFile?.name}</strong>
                    </p>
                    <p className="text-sm text-green-600 mb-2">
                      ✅ Found {availableExecutables.length} executable files
                    </p>
                    {renderFileTree(extractedStructure)}
                  </div>
                  {selectedExecutable && (
                    <div className="bg-green-50 border border-green-200 rounded p-2">
                      <p className="text-sm text-green-700">
                        🎯 Selected: <strong>{selectedExecutable}</strong>
                      </p>
                    </div>
                  )}
                  {availableExecutables.length === 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded p-2">
                      <p className="text-sm text-orange-600">
                        ⚠️ No executable files found in this archive. Please select a different archive.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Application Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Application Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter application name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the application"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g., editor, development, productivity"
                />
              </div>

              {/* Storage Information */}
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Storage Settings</h4>
                <p className="text-xs text-blue-600">
                  📁 Storage: {settings.storageDirectory}
                </p>
                <p className="text-xs text-blue-600">
                  🗂️ Temp: {settings.tempDirectory}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={!selectedFile || !formData.name || !formData.category || !selectedExecutable || isProcessing}
            >
              {isProcessing ? "Analyzing..." : "Add Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
