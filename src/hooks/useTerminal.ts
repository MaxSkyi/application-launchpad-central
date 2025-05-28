
import { useState, useCallback } from 'react';

interface TerminalState {
  isOpen: boolean;
  applicationName: string;
  logs: string[];
}

export const useTerminal = () => {
  const [terminalState, setTerminalState] = useState<TerminalState>({
    isOpen: false,
    applicationName: '',
    logs: []
  });

  const openTerminal = useCallback((applicationName: string) => {
    setTerminalState({
      isOpen: true,
      applicationName,
      logs: [`Starting ${applicationName}...`]
    });
  }, []);

  const closeTerminal = useCallback(() => {
    setTerminalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const addLog = useCallback((message: string) => {
    setTerminalState(prev => ({
      ...prev,
      logs: [...prev.logs, message]
    }));
  }, []);

  const clearLogs = useCallback(() => {
    setTerminalState(prev => ({ ...prev, logs: [] }));
  }, []);

  return {
    terminalState,
    openTerminal,
    closeTerminal,
    addLog,
    clearLogs
  };
};
