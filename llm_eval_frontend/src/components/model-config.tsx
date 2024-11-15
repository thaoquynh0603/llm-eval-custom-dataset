'use client'

import React, { createContext, useContext, useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoRemove } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { useModels } from '@/components/context-provider';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


export function ModelConfig() {
    return <ModelConfigContent />;
}

interface ModelConfig {
    apiKey: string;
    model: string;
    temperature: number;
    topP: number;
    maxLength: number;
    modelType: string;
}

function ModelConfigContent() {
    const { selectedModels, setSelectedModels } = useModels();

    const initialConfigs: { [key: string]: ModelConfig } = {
        GoogleCloud: { apiKey: '', model: '', temperature: 0.5, topP: 0.9, maxLength: 100, modelType: 'GoogleCloud' },
        OpenAI: { apiKey: '', model: '', temperature: 0.5, topP: 0.9, maxLength: 100, modelType: 'OpenAI' },
        Anthropic: { apiKey: '', model: '', temperature: 0.5, topP: 0.9, maxLength: 100, modelType: 'Anthropic' },
    };
    
    const [configs, setConfigs] = useState<{ [key: string]: ModelConfig }>(initialConfigs);

    const handleChange = (modelType: string, field: string, newValue: any) => {
        setConfigs((prevConfigs) => ({
            ...prevConfigs,
            [modelType]: {
                ...prevConfigs[modelType],
                [field]: newValue,
            },
        }));
    };

    const handleAddModel  = (modelType: string, modelConfig: ModelConfig) => {
        setSelectedModels({
          ...selectedModels,
          [modelType]: modelConfig
        });
      };

    const handleRemoveModel  = (modelKey: string) => {
        setSelectedModels(prevModels => {
          const newModels = { ...prevModels };
          delete newModels[modelKey];
          return newModels;
        });
      };
    
    // Log the selected models to the console for debugging purposes
    console.log('Selected Models:', selectedModels);

    const renderConfigBlock = (modelType: string, models: string[]) => (
        <div className="config-block" key={modelType}>
            <Card>
                <CardHeader>
                    <CardTitle>{modelType}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>API Key:</p>
                    <Input
                        type="password"
                        value={selectedModels[modelType]?.apiKey || configs[modelType].apiKey}
                        onChange={(e) => handleChange(modelType, 'apiKey', e.target.value)}
                    />
                </CardContent>
                <CardContent>
                    <p>Model:</p>
                    <Select
                        value={selectedModels[modelType]?.model || configs[modelType].model}
                        onValueChange={(value) => handleChange(modelType, 'model', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent>
                            {models.map((model) => (
                                <SelectItem key={model} value={model}>
                                    {model}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
                <CardContent>
                    <p>Temperature:</p>
                    <Slider
                        value={[selectedModels[modelType]?.temperature || configs[modelType].temperature]}
                        onValueChange={(value) => handleChange(modelType, 'temperature', value[0])}
                        step={0.1}
                        min={0}
                        max={1}
                    />
                </CardContent>
                <CardContent>
                    <p>Top-P:</p>
                    <Slider
                        value={[selectedModels[modelType]?.topP || configs[modelType].topP]}
                        onValueChange={(value) => handleChange(modelType, 'topP', value[0])}
                        step={0.1}
                        min={0}
                        max={1}
                    />
                </CardContent>
                <CardContent>
                    <p>Max Length:</p>
                    <Slider
                        value={[selectedModels[modelType]?.maxLength || configs[modelType].maxLength]}
                        onValueChange={(value) => handleChange(modelType, 'maxLength', value[0])}
                        step={1}
                        min={1}
                        max={1000}
                    />
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={() => handleAddModel(modelType, configs[modelType])}
                        disabled={!configs[modelType].apiKey || !configs[modelType].model}
                    >
                        <IoMdAdd />
                    </Button>
                    <Button
                        onClick={() => handleRemoveModel(modelType)}
                        disabled={!selectedModels[modelType]}
                        style={{ marginLeft: '15px' }}
                    >
                        <IoRemove />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );

    return (
        <div className="model-config" style={{ display: 'flex', gap: '16px' }}>
            {renderConfigBlock('GoogleCloud', ['gemini-1.5-flash-002', 'gemini-1.5-pro-002'])}
            {renderConfigBlock('OpenAI', ['gpt-4o-mini', 'gpt-3.5-turbo', 'gpt-4o', 'gpt-4-turbo'])}
            {renderConfigBlock('Anthropic', ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'])}
        </div>
    );
};
