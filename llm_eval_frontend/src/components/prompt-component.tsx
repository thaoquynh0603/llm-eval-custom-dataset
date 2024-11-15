'use client'

import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { IoIosRemoveCircle } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { usePrompts } from '@/components/context-provider';



const PromptComponent: React.FC = () => {
    const { prompts, setPrompts } = usePrompts();

    const handleAddPrompt = () => {
        if (Object.keys(prompts).length < 3) {
            const newIndex = Object.keys(prompts).length ? Math.max(...Object.keys(prompts).map(Number)) + 1 : 0;
            setPrompts({ ...prompts, [newIndex]: '' });
        }
    };

    const handleRemovePrompt = (index: number) => {
        const { [index]: _, ...newPrompts } = prompts;
        setPrompts(newPrompts);
    };

    const handlePromptChange = (index: number, value: string) => {
        setPrompts({ ...prompts, [index]: value });
    };

    return (
        <div style={{   marginTop: '16px'}}>
            {Object.entries(prompts).map(([index, prompt]: [string, string]) => (
            <Card key={index} className="mb-4">
                <CardHeader>
                <CardTitle>Prompt {index}</CardTitle>
                </CardHeader>
                <CardContent>
                <Textarea
                    value={prompt}
                    onChange={(e) => handlePromptChange(Number(index), e.target.value)}
                    placeholder="Enter prompt"
                />
                </CardContent>
                <CardFooter>
                {Object.keys(prompts).length > 1 && (
                    <Button variant="destructive" onClick={() => handleRemovePrompt(Number(index))}>
                    <IoIosRemoveCircle />
                    </Button>
                )}
                </CardFooter>
            </Card>
            ))}
            {Object.keys(prompts).length < 3 && (
            <Button size='lg' onClick={handleAddPrompt}><FaPlus /> Add Your Prompt </Button>
            )}
        </div>
    );
};

export default PromptComponent;