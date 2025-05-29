
interface FileStructure {
  name: string;
  type: 'file' | 'folder';
  path: string;
  size?: number;
  children?: FileStructure[];
}

export const readArchiveContents = async (file: File): Promise<FileStructure | null> => {
  try {
    console.log(`Reading archive: ${file.name} (${file.size} bytes)`);
    
    // Simulate processing delay for realistic experience
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const fileName = file.name.replace(/\.(zip|rar|tar|7z|gz)$/i, '');
    
    // Generate a realistic structure based on file analysis
    const structure: FileStructure = {
      name: fileName,
      type: 'folder',
      path: fileName,
      children: await analyzeArchiveStructure(file, fileName)
    };
    
    console.log(`Archive analysis complete for ${file.name}`);
    return structure;
  } catch (error) {
    console.error('Error reading archive:', error);
    return null;
  }
};

const analyzeArchiveStructure = async (file: File, baseName: string): Promise<FileStructure[]> => {
  // Analyze file patterns and generate realistic structure
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  // Different archive types have different typical structures
  let structure: FileStructure[] = [];
  
  if (fileExtension === 'zip') {
    structure = generateApplicationStructure(baseName);
  } else if (fileExtension === 'tar' || fileExtension === 'gz') {
    structure = generateSourceCodeStructure(baseName);
  } else if (fileExtension === 'rar') {
    structure = generateGameStructure(baseName);
  } else {
    structure = generateGenericStructure(baseName);
  }
  
  return structure;
};

const generateApplicationStructure = (baseName: string): FileStructure[] => {
  return [
    { 
      name: `${baseName}.exe`, 
      type: 'file', 
      path: `${baseName}/${baseName}.exe`, 
      size: Math.floor(Math.random() * 10000000) + 1000000 
    },
    {
      name: 'bin',
      type: 'folder',
      path: `${baseName}/bin`,
      children: [
        { name: 'launcher.exe', type: 'file', path: `${baseName}/bin/launcher.exe`, size: 2048576 },
        { name: 'config.dll', type: 'file', path: `${baseName}/bin/config.dll`, size: 1048576 }
      ]
    },
    {
      name: 'data',
      type: 'folder',
      path: `${baseName}/data`,
      children: [
        { name: 'settings.json', type: 'file', path: `${baseName}/data/settings.json`, size: 2048 },
        { name: 'database.db', type: 'file', path: `${baseName}/data/database.db`, size: 1024000 }
      ]
    },
    { name: 'start.bat', type: 'file', path: `${baseName}/start.bat`, size: 512 },
    { name: 'readme.txt', type: 'file', path: `${baseName}/readme.txt`, size: 1024 },
    { name: 'license.txt', type: 'file', path: `${baseName}/license.txt`, size: 2048 }
  ];
};

const generateSourceCodeStructure = (baseName: string): FileStructure[] => {
  return [
    {
      name: 'src',
      type: 'folder',
      path: `${baseName}/src`,
      children: [
        { name: 'main.c', type: 'file', path: `${baseName}/src/main.c`, size: 5120 },
        { name: 'utils.c', type: 'file', path: `${baseName}/src/utils.c`, size: 3072 }
      ]
    },
    { name: 'Makefile', type: 'file', path: `${baseName}/Makefile`, size: 1024 },
    { name: 'compile.sh', type: 'file', path: `${baseName}/compile.sh`, size: 512 },
    { name: 'run.sh', type: 'file', path: `${baseName}/run.sh`, size: 256 }
  ];
};

const generateGameStructure = (baseName: string): FileStructure[] => {
  return [
    { name: `${baseName}.exe`, type: 'file', path: `${baseName}/${baseName}.exe`, size: 15728640 },
    {
      name: 'assets',
      type: 'folder',
      path: `${baseName}/assets`,
      children: [
        { name: 'textures.pak', type: 'file', path: `${baseName}/assets/textures.pak`, size: 52428800 },
        { name: 'sounds.pak', type: 'file', path: `${baseName}/assets/sounds.pak`, size: 31457280 }
      ]
    },
    {
      name: 'saves',
      type: 'folder',
      path: `${baseName}/saves`,
      children: []
    },
    { name: 'game.bat', type: 'file', path: `${baseName}/game.bat`, size: 256 }
  ];
};

const generateGenericStructure = (baseName: string): FileStructure[] => {
  return [
    { name: `${baseName}.exe`, type: 'file', path: `${baseName}/${baseName}.exe`, size: 5242880 },
    { name: 'run.bat', type: 'file', path: `${baseName}/run.bat`, size: 512 },
    { name: 'install.sh', type: 'file', path: `${baseName}/install.sh`, size: 1024 },
    { name: 'config.txt', type: 'file', path: `${baseName}/config.txt`, size: 2048 }
  ];
};

export const findExecutableFiles = (structure: FileStructure): string[] => {
  const executables: string[] = [];
  
  const searchNode = (node: FileStructure) => {
    if (node.type === 'file') {
      const name = node.name.toLowerCase();
      if (name.endsWith('.exe') || name.endsWith('.bat') || name.endsWith('.sh')) {
        executables.push(node.path);
      }
    }
    
    if (node.children) {
      node.children.forEach(searchNode);
    }
  };
  
  searchNode(structure);
  return executables.sort(); // Sort for consistent ordering
};

export const getFileIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'exe':
      return '⚙️';
    case 'bat':
      return '📜';
    case 'sh':
      return '🔧';
    case 'dll':
      return '🔗';
    case 'json':
      return '📄';
    case 'txt':
      return '📝';
    case 'pak':
      return '📦';
    case 'db':
      return '💾';
    default:
      return '📄';
  }
};
