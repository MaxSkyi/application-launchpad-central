
# Application Hub - Desktop Application Launcher

A modern web-based application launcher for managing and launching your desktop applications, web apps, and scripts.

## 🚀 Features

- **Multi-platform Support**: Launch Windows executables (.exe), batch scripts (.bat), web applications, and protocol handlers
- **Smart Search**: Find applications quickly with intelligent search across names, descriptions, and tags
- **Category Management**: Organize applications with built-in and custom categories
- **Multiple Views**: Switch between grid and list views for optimal browsing
- **Application Management**: Add, edit, and remove applications with detailed metadata
- **Settings**: Customize default view, confirmation dialogs, and categories

## 📋 How to Use

### Adding Applications

1. Click the **"Add Application"** button in the top-right corner
2. Fill in the application details:
   - **Name**: Display name for your application
   - **Description**: Brief description of what the application does
   - **Icon URL**: URL to an icon image (or use placeholder)
   - **Category**: Choose from existing categories or create custom ones
   - **Tags**: Add searchable tags (comma-separated)
   - **Executable Path**: Path to the application (see supported formats below)
   - **File Size**: Approximate size of the application

### Supported Executable Formats

#### 1. Windows Desktop Applications (.exe)
```
notepad.exe
C:\Program Files\MyApp\myapp.exe
D:\Games\game.exe
```

#### 2. Batch Scripts (.bat)
```
startup.bat
C:\Scripts\backup.bat
deploy.bat
```

#### 3. Web Applications
```
https://github.com
https://code.visualstudio.com
http://localhost:3000
```

#### 4. Protocol Handlers
```
vscode://file/C:/path/to/file
steam://run/12345
discord://
```

## 🔧 Application Launch Behavior

### Current Implementation (Web Demo)
Since this is a web-based application, actual desktop program launching is **simulated**:

- **Desktop Apps (.exe, .bat)**: Shows launch notification and logs to console
- **Web Apps**: Opens in new browser tab
- **Protocol Handlers**: Attempts to open with system default handler

### For Production Desktop Use

To enable actual desktop application launching, this project would need to be packaged with:

#### Option 1: Electron
```bash
npm install electron
# Package as desktop app with native system access
```

#### Option 2: Tauri
```bash
npm install @tauri-apps/cli
# Lightweight Rust-based desktop wrapper
```

#### Option 3: PWA with File System Access API
```javascript
// For modern browsers with filesystem permissions
const fileHandle = await window.showOpenFilePicker();
```

## 📁 Project Structure for Desktop Integration

For a production desktop version, organize your applications like this:

```
ApplicationHub/
├── apps/                    # Application executables
│   ├── utilities/
│   │   ├── notepad.exe
│   │   └── calculator.exe
│   ├── development/
│   │   ├── vscode.exe
│   │   └── git-bash.bat
│   └── games/
│       └── mygame.exe
├── scripts/                 # Batch scripts
│   ├── backup.bat
│   ├── deploy.bat
│   └── startup.bat
├── icons/                   # Application icons
│   ├── notepad.png
│   ├── vscode.png
│   └── default.png
└── config/
    └── applications.json    # Application metadata
```

## ⚙️ Configuration Files

### applications.json Example
```json
{
  "applications": [
    {
      "id": "1",
      "name": "Notepad",
      "description": "Simple text editor",
      "icon": "./icons/notepad.png",
      "executable": "./apps/utilities/notepad.exe",
      "category": "Utilities",
      "tags": ["text", "editor"],
      "size": "2.1 MB",
      "dateAdded": "2024-01-15"
    }
  ]
}
```

## 🛠️ Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
git clone <repository-url>
cd application-hub
npm install
npm run dev
```

### Building for Production
```bash
npm run build
```

## 🔐 Security Considerations

### Web Version
- Cannot execute local files due to browser security restrictions
- Limited to opening URLs and protocol handlers
- All desktop app launches are simulated

### Desktop Version (Electron/Tauri)
- **Validate executable paths** before launching
- **Sanitize user inputs** to prevent code injection
- **Implement permission system** for sensitive operations
- **Use allowlists** for permitted executable locations

## 🎨 Customization

### Adding Custom Categories
1. Go to Settings (gear icon)
2. Navigate to "Custom Categories"
3. Add your category name
4. Save settings

### Changing Default View
1. Open Settings
2. Select preferred default view (Grid/List)
3. Toggle delete confirmations if desired

## 🐛 Troubleshooting

### Applications Won't Launch
1. **Check executable path**: Ensure the path is correct and file exists
2. **File permissions**: Verify you have permission to execute the file
3. **Browser security**: Web version cannot launch local files
4. **Notifications**: Allow notifications for launch feedback

### Missing Icons
- Use full URLs for web-hosted icons
- For local icons, ensure proper file paths
- Fallback placeholder icons are provided

### Search Not Working
- Check spelling and try partial matches
- Search includes names, descriptions, and tags
- Use category filters to narrow results

## 📖 API Reference

### Application Interface
```typescript
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
```

### Launch Function
```typescript
launchApplication(app: Application): Promise<boolean>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed description
4. Include console logs and error messages

---

**Note**: This is a web-based demo. For production desktop use, package with Electron or Tauri for full system integration.
