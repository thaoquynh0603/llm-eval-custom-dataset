'use client'

import React from 'react';
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

interface ResultDisplayProps {
    model: string;
    promptNumber: number;
    accuracy: number;
    tableData: Array<{ testItem: string; label: string; output: string; matchValue: boolean }>;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ model, promptNumber, accuracy, tableData }) => {
    return (
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
            <AccordionTrigger>{`Model: ${model}, Prompt Number: ${promptNumber}, Accuracy: ${accuracy}%`}</AccordionTrigger>
            <AccordionContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Test Item</TableHead>
                            <TableHead>Label</TableHead>
                            <TableHead>Output</TableHead>
                            <TableHead>Match Value</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tableData.length ? (
                            tableData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.testItem}</TableCell>
                                    <TableCell>{row.label}</TableCell>
                                    <TableCell>{row.output}</TableCell>
                                    <TableCell>{row.matchValue ? 'True' : 'False'}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default ResultDisplay;