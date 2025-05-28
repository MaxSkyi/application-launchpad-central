
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Minimize2, Maximize2 } from 'lucide-react';

interface TerminalWindowProps {
  isOpen: boolean;
  onClose: () => void;
  applicationName: string;
  logs: string[];
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  isOpen,
  onClose,
  applicationName,
  logs
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isMaximized, setIsMaximized] = useState(false);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`${isMaximized ? 'max-w-[95vw] max-h-[95vh]' : 'max-w-4xl max-h-[80vh]'} bg-gray-900 text-green-400 font-mono`}
      >
        <DialogHeader className="flex flex-row items-center justify-between border-b border-gray-700 pb-2">
          <DialogTitle className="text-green-400 font-mono text-sm">
            Terminal - {applicationName}
          </DialogTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMaximized(!isMaximized)}
              className="h-6 w-6 p-0 text-green-400 hover:bg-gray-800"
            >
              {isMaximized ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-green-400 hover:bg-gray-800"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </DialogHeader>
        
        <div 
          ref={terminalRef}
          className="bg-black rounded p-4 h-96 overflow-y-auto font-mono text-sm leading-relaxed"
        >
          {logs.map((log, index) => (
            <div key={index} className="mb-1">
              <span className="text-gray-500">
                [{new Date().toLocaleTimeString()}]
              </span>{' '}
              <span className="text-green-400">{log}</span>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-gray-500">Waiting for application logs...</div>
          )}
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-700 pt-2">
          <span>Application Terminal</span>
          <span>{logs.length} log entries</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
