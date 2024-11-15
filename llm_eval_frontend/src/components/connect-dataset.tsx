
'use client'

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FaRegFileAlt } from "react-icons/fa";
import { useFileId } from "@/components/context-provider";
import { useState } from "react";

export default function ConnectDataset() {
  const { file_id, setFileId } = useFileId();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/upload-file", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Upload failed');
      }

      const data = await response.json();
      console.log('Response:', data);  // For debugging

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.success) {
        alert(`File uploaded successfully: ${data.file_id}`);
        setFileId(data.file_id);  // Save file_id into the context
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(error instanceof Error ? error.message : "Failed to upload file.");
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center">
          <FaRegFileAlt className="w-12 h-12" />
          <span className="text-sm font-medium text-gray-500">Drag and drop a file or click to browse</span>
          <span className="text-xs text-gray-500">CSV or XLSX</span>
        </div>
        <div className="space-y-2 text-sm">
          <Label htmlFor="file" className="text-sm font-medium">
            File
          </Label>
          <Input id="file" type="file" placeholder="File" accept=".csv,.xlsx" onChange={handleFileChange} />
        </div>
      </CardContent>
      <div>
        <Button className="ml-6 mb-6" size="lg" onClick={handleUpload}>Upload</Button>
      </div>
    </Card>
  );
}