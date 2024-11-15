'use client'

import React, { createContext, useContext, useState } from 'react';

interface ModelConfig {
  apiKey: string;
  model: string;
  temperature: number;
  topP: number;
  maxLength: number;
}

interface AppContextType {
  selectedModels: Record<string, ModelConfig>;
  setSelectedModels: React.Dispatch<React.SetStateAction<Record<string, ModelConfig>>>;
  prompts: Record<number, string>;
  setPrompts: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  file_id: string;
  setFileId: React.Dispatch<React.SetStateAction<string>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedModels, setSelectedModels] = useState<Record<string, ModelConfig>>({});
  const [prompts, setPrompts] = useState<Record<number, string>>({});
  const [file_id, setFileId] = useState<string>('');

  return (
      <AppContext.Provider value={{
          selectedModels,
          setSelectedModels,
          prompts,
          setPrompts,
          file_id,
          setFileId
      }}>
          {children}
      </AppContext.Provider>
  );
}


export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
      throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export function useModels() {
  const { selectedModels, setSelectedModels } = useAppContext();
  return { selectedModels, setSelectedModels };
}

export function usePrompts() {
  const { prompts, setPrompts } = useAppContext();
  return { prompts, setPrompts };
}

export function useFileId() {
  const { file_id, setFileId } = useAppContext();
  return { file_id, setFileId };
}