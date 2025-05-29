
import { useState, useCallback } from 'react';

interface TerminalState {
  isOpen: boolean;
  applicationName: string;
  logs: string[];
  isRunning: boolean;
  processId?: number;
}

export const useTerminal = () => {
  const [terminalState, setTerminalState] = useState<TerminalState>({
    isOpen: false,
    applicationName: '',
    logs: [],
    isRunning: false,
    processId: undefined
  });

  const openTerminal = useCallback((applicationName: string) => {
    const processId = Math.floor(Math.random() * 10000) + 1000;
    setTerminalState({
      isOpen: true,
      applicationName,
      logs: [`Starting ${applicationName}...`],
      isRunning: true,
      processId
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

  const stopApplication = useCallback(() => {
    if (!terminalState.isRunning) return;

    setTerminalState(prev => ({
      ...prev,
      isRunning: false
    }));

    // Simulate stop process with logs
    setTimeout(() => {
      addLog(`Sending SIGTERM signal to process ${terminalState.processId}`);
    }, 100);

    setTimeout(() => {
      addLog(`Process ${terminalState.processId} received termination signal`);
      addLog(`Cleaning up application resources...`);
    }, 800);

    setTimeout(() => {
      addLog(`${terminalState.applicationName} has been terminated successfully`);
      addLog(`Process ${terminalState.processId} stopped`);
    }, 1500);
  }, [terminalState.isRunning, terminalState.processId, terminalState.applicationName, addLog]);

  return {
    terminalState,
    openTerminal,
    closeTerminal,
    addLog,
    clearLogs,
    stopApplication
  };
};
