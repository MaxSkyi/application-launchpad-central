
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

interface AddApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddApplication: (app: any) => void;
}

const categories = ["Development", "Graphics", "Analytics", "Media", "Utilities", "Games", "Productivity"];

const ALLOWED_EXTENSIONS = ['.zip', '.rar', '.tar', '.7z', '.gz'];
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

interface FileStructure {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileStructure[];
}

export const AddApplicationModal = ({ open, onOpenChange, onAddApplication }: AddApplicationModalProps) => {
  const { toast } = useToast();
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

  const validateFile = (file: File): boolean => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      toast({
        title: "Invalid File Type",
        description: `Please upload a file with one of these extensions: ${ALLOWED_EXTENSIONS.join(', ')}`,
        variant: "destructive",
      });
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File Too Large",
        description: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Simulate archive extraction and folder structure analysis
  const simulateArchiveExtraction = (fileName: string): FileStructure => {
    const baseName = fileName.replace(/\.(zip|rar|tar|7z|gz)$/i, '');
    
    // Create a realistic folder structure simulation
    const structure: FileStructure = {
      name: baseName,
      type: 'folder',
      path: baseName,
      children: [
        {
          name: 'bin',
          type: 'folder',
          path: `${baseName}/bin`,
          children: [
            { name: 'app.exe', type: 'file', path: `${baseName}/bin/app.exe` },
            { name: 'launcher.bat', type: 'file', path: `${baseName}/bin/launcher.bat` }
          ]
        },
        {
          name: 'data',
          type: 'folder',
          path: `${baseName}/data`,
          children: [
            { name: 'config.json', type: 'file', path: `${baseName}/data/config.json` }
          ]
        },
        { name: 'main.exe', type: 'file', path: `${baseName}/main.exe` },
        { name: 'start.bat', type: 'file', path: `${baseName}/start.bat` },
        { name: 'readme.txt', type: 'file', path: `${baseName}/readme.txt` }
      ]
    };

    return structure;
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Extract and analyze archive structure
      const structure = simulateArchiveExtraction(file.name);
      setExtractedStructure(structure);
      
      // Auto-populate form fields
      const fileName = file.name.replace(/\.(zip|rar|tar|7z|gz)$/i, '');
      const cleanName = fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      setFormData(prev => ({
        ...prev,
        name: prev.name || cleanName,
      }));

      toast({
        title: "Archive Processed",
        description: `${file.name} has been extracted and analyzed.`,
      });
    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Failed to process the archive. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderFileTree = (structure: FileStructure, level: number = 0): JSX.Element => {
    const isExecutable = structure.type === 'file' && 
      (structure.name.endsWith('.exe') || structure.name.endsWith('.bat'));
    
    return (
      <div key={structure.path} style={{ marginLeft: `${level * 20}px` }}>
        <div 
          className={`flex items-center gap-2 p-1 rounded cursor-pointer hover:bg-gray-100 ${
            selectedExecutable === structure.path ? 'bg-blue-100' : ''
          }`}
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
            <File className={`h-4 w-4 ${isExecutable ? 'text-green-500' : 'text-gray-500'}`} />
          )}
          <span className={`text-sm ${isExecutable ? 'font-medium text-green-700' : ''}`}>
            {structure.name}
          </span>
          {isExecutable && (
            <span className="text-xs text-green-600 ml-auto">Executable</span>
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
      archiveStructure: extractedStructure
    };

    onAddApplication(newApp);
    onOpenChange(false);
    
    // Reset form
    setFormData({ name: "", description: "", category: "", mainExecutable: "", tags: "" });
    setSelectedFile(null);
    setExtractedStructure(null);
    setSelectedExecutable("");
    
    toast({
      title: "Application Added",
      description: `${newApp.name} has been added to your hub.`,
    });
  };

  const removeFile = () => {
    setSelectedFile(null);
    setExtractedStructure(null);
    setSelectedExecutable("");
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
                        {isProcessing ? "Processing archive..." : "Drag & drop an archive file here"}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Supports ZIP, RAR, TAR, 7Z, GZ formats (max 500MB)
                      </p>
                      <Button type="button" variant="outline" asChild disabled={isProcessing}>
                        <label htmlFor="file-upload" className="cursor-pointer">
                          {isProcessing ? "Processing..." : "Browse Files"}
                        </label>
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".zip,.rar,.tar,.7z,.gz"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isProcessing}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* File Structure Display */}
              {extractedStructure && (
                <div className="space-y-2">
                  <Label>Archive Contents - Select Executable</Label>
                  <div className="border rounded-lg p-4 max-h-64 overflow-y-auto bg-gray-50">
                    <p className="text-sm text-gray-600 mb-2">
                      Click on an .exe or .bat file to select it as the main executable:
                    </p>
                    {renderFileTree(extractedStructure)}
                  </div>
                  {selectedExecutable && (
                    <p className="text-sm text-green-600">
                      Selected: {selectedExecutable}
                    </p>
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
              {isProcessing ? "Processing..." : "Add Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
