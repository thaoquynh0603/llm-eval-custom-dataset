'use client'

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useEffect, useState } from 'react'
import { useModels, useFileId, usePrompts } from "@/components/context-provider"

interface ModelConfig {
  apiKey: string;
  model: string;
  temperature: number;
  topP: number;
  maxLength: number;
}

//const [selectedModels, setSelectedModels] = useState<Record<string, ModelConfig>>({}); om which the key is the provder

type Model = ModelConfig;

interface ModelsResponse {
  models: Record<string, Model>;
}

interface File {
  file_id: string;
  file_name: string;
  uploaded_at: string;
  test_count: number;
}

interface FilesResponse {
  files: File[];
}

interface Prompt {
  prompt: string;
  created_at: string;
}

interface PromptResponse {
  prompts: Prompt[];
}

const AppSidebar: React.FC = () => {
  const [fetchedModels, setModels] = useState<ModelsResponse | null>(null);
  const { selectedModels, setSelectedModels } = useModels();
  const [fetchedFiles, setFetchedFiles] = useState<FilesResponse | null>(null);
  const { file_id, setFileId } = useFileId();
  const handleFileClick = (fileId: string) => {
    setFileId(fileId);
  };
  const [fetchedPrompts, setFetchedPrompts] = useState<PromptResponse | null>(null);
  const { prompts, setPrompts } = usePrompts();

  useEffect(() => {
    fetch("http://localhost:8000/api/models")
      .then((response: Response) => response.json())
      .then((data: ModelsResponse) => setModels(data))
      .catch((error: Error) => console.error('Error fetching models:', error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/files")
      .then((response: Response) => response.json())
      .then((data: FilesResponse) => setFetchedFiles(data))
      .catch((error: Error) => console.error('Error fetching files:', error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/prompts")
      .then((response: Response) => response.json())
      .then((data: PromptResponse) => setFetchedPrompts(data))
      .catch((error: Error) => console.error('Error fetching prompts:', error));
  }, []);

  const handleRemovePrompt = (index: number) => {
    const { [index]: _, ...newPrompts } = prompts;
    setPrompts(newPrompts);
  };

  const handlePromptChange = (index: number, value: string) => {
    setPrompts({ ...prompts, [index]: value });
  };
  
  const handleAddModel = (modelType: string, modelConfig: ModelConfig) => {
    setSelectedModels((prevModels: Record<string, ModelConfig>) => ({
      ...prevModels,
      [modelType]: modelConfig
    }));
  };

  const handleRemoveModel  = (modelKey: string) => {
      setSelectedModels(prevModels => {
        const newModels = { ...prevModels };
        delete newModels[modelKey];
        return newModels;
      });
    };

  console.log(selectedModels, file_id, prompts);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Models</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="max-h-84">
                {fetchedModels?.models && Object.entries(fetchedModels.models).map(([provider, model], index) => (
                  <div key={index} className="mx-3 p-2 mb-2 border rounded">
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={`model-${index}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        <strong>{provider}</strong>
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {model.model} 
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Temperature: {model.temperature} | Max Length: {model.maxLength} | Top P: {model.topP}
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleAddModel(provider, model)}
                        >
                          +
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleRemoveModel(provider)}
                          disabled={!selectedModels[provider]}
                        >
                          -
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </SidebarGroupContent>
          <SidebarGroupLabel>Uploaded Test Files</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="mx-2">
              <Select onValueChange={(value) => handleFileClick(value)} value={file_id || ""}>
                <SelectTrigger className="w-full p-2 border rounded">
                  <SelectValue placeholder="Select a file" />
                </SelectTrigger>
                <SelectContent>
                  {fetchedFiles?.files?.map((file) => (
                    <SelectItem key={file.file_id} value={file.file_id}>
                      {file.file_name} (Test Count: {file.test_count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </SidebarGroupContent>
          <SidebarGroupLabel>Recent Prompts</SidebarGroupLabel>
            <SidebarGroupContent>
            <div className="overflow-y-auto max-h-80">
              {fetchedPrompts?.prompts?.map((prompt, index) => (
              <div key={index} className="mx-3 p-2 mb-2 border rounded">
                <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={`prompt-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <strong>{prompt.prompt}</strong>
                </label>
                <p className="text-sm text-muted-foreground">
                  Created At: {new Date(prompt.created_at).toLocaleString()}
                </p>
                <div className="flex space-x-2">
                  <Button
                  size = "sm"
                  onClick={() => handlePromptChange(index, prompt.prompt)}
                  >
                  +
                  </Button>
                  <Button
                  size = "sm"
                  onClick={() => handleRemovePrompt(index)}
                  disabled={!prompts[index]}
                  >
                  -
                  </Button>
                </div>
                </div>
              </div>
              ))}
            </div>
            </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>

  )
}

export default AppSidebar;
