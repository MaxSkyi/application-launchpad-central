
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

export const sampleApplications: Application[] = [
  {
    id: "1",
    name: "Visual Studio Code",
    description: "A powerful, lightweight code editor with built-in Git support and extensions.",
    icon: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=64&h=64&fit=crop&crop=center",
    size: "142.3 MB",
    dateAdded: "2024-01-15",
    category: "Development",
    tags: ["coding", "editor", "git"],
    executable: "/Applications/Visual Studio Code.app",
    fileName: "vscode.app"
  },
  {
    id: "2",
    name: "Adobe Photoshop",
    description: "Industry-standard image editing and digital art creation software.",
    icon: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=64&h=64&fit=crop&crop=center",
    size: "3.2 GB",
    dateAdded: "2024-01-10",
    category: "Graphics",
    tags: ["design", "photo", "creative"],
    executable: "/Applications/Adobe Photoshop 2024/Adobe Photoshop 2024.app",
    fileName: "photoshop.app"
  },
  {
    id: "3",
    name: "Google Analytics Dashboard",
    description: "Web-based analytics platform for tracking website performance and user behavior.",
    icon: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=64&h=64&fit=crop&crop=center",
    size: "Web App",
    dateAdded: "2024-01-20",
    category: "Analytics",
    tags: ["analytics", "web", "metrics"],
    executable: "https://analytics.google.com",
    fileName: "analytics.webloc"
  },
  {
    id: "4",
    name: "Spotify",
    description: "Music streaming service with millions of songs, podcasts, and playlists.",
    icon: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=64&h=64&fit=crop&crop=center",
    size: "320.1 MB",
    dateAdded: "2024-01-18",
    category: "Media",
    tags: ["music", "streaming", "audio"],
    executable: "/Applications/Spotify.app",
    fileName: "spotify.app"
  },
  {
    id: "5",
    name: "Terminal",
    description: "Command-line interface for system administration and development tasks.",
    icon: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=64&h=64&fit=crop&crop=center",
    size: "45.2 MB",
    dateAdded: "2024-01-12",
    category: "Utilities",
    tags: ["terminal", "cli", "system"],
    executable: "/Applications/Utilities/Terminal.app",
    fileName: "terminal.app"
  },
  {
    id: "6",
    name: "Steam",
    description: "Digital distribution platform for video games with community features.",
    icon: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=64&h=64&fit=crop&crop=center",
    size: "1.8 GB",
    dateAdded: "2024-01-22",
    category: "Games",
    tags: ["gaming", "platform", "social"],
    executable: "/Applications/Steam.app",
    fileName: "steam.app"
  },
  {
    id: "7",
    name: "Notion",
    description: "All-in-one workspace for notes, tasks, wikis, and project management.",
    icon: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=64&h=64&fit=crop&crop=center",
    size: "156.7 MB",
    dateAdded: "2024-01-25",
    category: "Productivity",
    tags: ["notes", "productivity", "collaboration"],
    executable: "/Applications/Notion.app",
    fileName: "notion.app"
  },
  {
    id: "8",
    name: "Discord",
    description: "Voice, video, and text communication platform for communities and gaming.",
    icon: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=64&h=64&fit=crop&crop=center",
    size: "278.9 MB",
    dateAdded: "2024-01-14",
    category: "Media",
    tags: ["chat", "voice", "gaming"],
    executable: "/Applications/Discord.app",
    fileName: "discord.app"
  }
];
