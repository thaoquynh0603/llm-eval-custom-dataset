'use client'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/app-sidebar"
import ConnectDataset from '@/components/connect-dataset';
import { ModelConfig } from "@/components/model-config";
import PromptComponent from "@/components/prompt-component";
import { useAppContext } from '@/components/context-provider';
import { useCallback, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function Home() {
  const { selectedModels, prompts, file_id } = useAppContext();

  console.log('Selected Models:', selectedModels);
  console.log('Prompts:', prompts);
  console.log('File ID:', file_id);

  interface ModelConfig {
    model: string;
    temperature: number;
    maxLength: number;
    topP: number;
    apiKey: string;
  }

  interface SelectedModels {
    [provider: string]: ModelConfig;
  }

  interface Prompt {
    [key: string]: string;
  }

  interface Data {
    provider: string;
    model: string;
    temperature: number;
    max_length: number;
    top_p: number;
    prompt: string;
    token: string;
  }


  const [evalResults, setEvalResults] = useState<{ [key: string]: any }>({});

  const handleSubmit = useCallback((provider: string, prompt: string, evaluationType: string) => {
    if (!file_id) {
      console.error('File ID is required');
      return;
    }

    const config: ModelConfig = selectedModels[provider];
    const data: Data = {
      provider: provider,
      model: config.model,
      temperature: config.temperature,
      max_length: config.maxLength,
      top_p: config.topP,
      prompt: prompt,
      token: config.apiKey
    };
    
    let model_id: string;

    fetch('http://localhost:8000/api/add-model', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Data sent successfully:', data);
        model_id = data.model_id;
        console.log('Model ID:', model_id);

        return fetch('http://localhost:8000/api/add-response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ model_id, file_id })
        });
      })
      .then(response => response.json())
      .then(data => {
        console.log('Response added successfully:', data);
        console.log('Model ID_true:', model_id);
        return fetch(`http://localhost:8000/api/llm-responses?file_id=${file_id}&model_id=${model_id}&evaluation_type=${evaluationType}`);
      })
      .then(response => response.json())
      .then(data => {
        const evalResult = data;
        console.log('Result:', evalResult);
        setEvalResults(prevResults => ({
          ...prevResults,
          [`${provider}-${prompt}`]: evalResult
        }));
        console.log('Result:', evalResult);
  
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [selectedModels, file_id]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <SidebarProvider style={{ width: '50%' }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: '30px', width: '100%' }}>
          <div>
            <ConnectDataset />
            <main style={{ marginTop: '15px', width: '100%' }}>
              <ModelConfig />
            </main>
            <PromptComponent />
          </div>
        </div>
      </SidebarProvider>
      <div style={{ width: '100%', margin: '30px' }}>
      <div>
      <Accordion type="single" collapsible>
        {Object.entries(selectedModels).map(([provider, config]) => (
          Object.values(prompts).map((prompt, index) => (
                <AccordionItem key={`${provider}-${index}`} value={`${provider}-${index}`}>
                    <AccordionTrigger>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'left' }}>
                        <div style={{ marginRight: '10px' }}>
                          <strong> Provider: </strong> {provider}
                        </div>
                        <div style={{ marginRight: '10px' }}>
                            <div style={{ marginLeft: '10px' }}>
                            <strong>Prompt:</strong> {prompt.slice(0, 50)}{prompt.length > 50 ? '...' : ''}
                            </div>
                        </div>
                      </div>
                        <div className="flex items-center space-x-2">
                          <div>
                            <Select onValueChange={(value) => handleSubmit(provider, prompt, value)} defaultValue="absolute">
                            <SelectTrigger className="w-full p-2 border rounded">
                              <SelectValue placeholder="Select evaluation type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="absolute">Absolute</SelectItem>
                              <SelectItem value="relative">Relative</SelectItem>
                            </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className='mx-1'>
                        <div className="button-wrapper" onClick={() => {
                          if (file_id) {
                          const element = document.getElementById(`evaluation-type-${provider}-${index}`) as HTMLSelectElement;
                          const evaluationType = element ? element.value : 'absolute';
                          handleSubmit(provider, prompt, evaluationType);
                          } else {
                          console.error('File ID is required to submit');
                          }
                        }}>
                          <div style={{ backgroundColor: file_id ? 'black' : 'grey', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: file_id ? 'pointer' : 'not-allowed' }}>Submit</div>
                        </div>
                      </div>
                    </div>

                    </AccordionTrigger>
                  <AccordionContent>
                    <div>
                      {evalResults[`${provider}-${prompt}`] && (
                        <div>
                          {evalResults[`${provider}-${prompt}`].output.overall_accuracy !== undefined ? (
                            <div>
                              <p><strong>Overall Accuracy:</strong> {evalResults[`${provider}-${prompt}`].output.overall_accuracy}</p>
                              <p><strong>Accuracy Per Label:</strong></p>
                              <ul>
                                {Object.entries(evalResults[`${provider}-${prompt}`].output.accuracy_per_label).map(([label, accuracy]) => (
                                  <li key={label}><strong>{label}:</strong> {accuracy as string | number}</li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <div>
                              <p><strong>Average:</strong> {evalResults[`${provider}-${prompt}`].output.avg}</p>
                              <p><strong>Max:</strong> {evalResults[`${provider}-${prompt}`].output.max}</p>
                              <p><strong>Min:</strong> {evalResults[`${provider}-${prompt}`].output.min}</p>
                              <p><strong>Square Average:</strong> {evalResults[`${provider}-${prompt}`].output.square_avg}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      {evalResults[`${provider}-${prompt}`] && (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[100px]">Test Index</TableHead>
                              <TableHead>Test</TableHead>
                              <TableHead>Label</TableHead>
                              <TableHead>Response</TableHead>
                              <TableHead>Output</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.keys(evalResults[`${provider}-${prompt}`].table.test_index).map((key) => (
                              <TableRow key={key}>
                                <TableCell className="font-medium">{evalResults[`${provider}-${prompt}`].table.test_index[key]}</TableCell>
                                <TableCell>{evalResults[`${provider}-${prompt}`].table.test[key]}</TableCell>
                                <TableCell>{evalResults[`${provider}-${prompt}`].table.label[key]}</TableCell>
                                <TableCell>{evalResults[`${provider}-${prompt}`].table.response[key]}</TableCell>
                                <TableCell>{evalResults[`${provider}-${prompt}`].table.output[key]}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

              ))
            ))}
      </Accordion>
      </div>
      </div>
    </SidebarProvider>
  );
}
