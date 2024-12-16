"use client";

import { useState, useRef } from "react";
import { Button, ButtonWithLoading } from "@/app/(client)/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/(client)/components/ui/card";
import { Mic, Upload, X } from "lucide-react";
import Image from "next/image";
import { fileTypes } from "./fileTypes";
import { Textarea } from "@/app/(client)/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/(client)/components/ui/select";
import { Project } from "@/types/project";
import { Label } from "@/app/(client)/components/ui/label";
import { useSpeechRecognition } from "@/app/(client)/hooks/useSpeechRecognition";
import { toast } from "@/app/(client)/components/ui/use-toast";
import ky from "ky";

interface DocumentationGeneratorProps {
  projects: Project[];
}

export default function DocumentationGenerator({
  projects,
}: DocumentationGeneratorProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isRecording,
    transcript: description,
    toggleRecording,
    setTranscript: setDescription,
  } = useSpeechRecognition();

  const handleAddPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files).map((file) =>
        URL.createObjectURL(file),
      );
      setPhotos((prev) => [...prev, ...newPhotos]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadPhotos = async () => {
    const formData = new FormData();
    Array.from(fileInputRef.current?.files || []).forEach((file) => {
      formData.append("files", file);
    });

    try {
      await ky
        .post(`/api/project/${selectedProject}/docs/images`, {
          body: formData,
        })
        .json();
      setPhotos([]);
    } catch (error) {
      console.error("Error uploading photos:", error);
      toast({
        title: "Error",
        description: "Failed to upload photos. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleGenerate = async () => {
    // First, upload any photos
    if (photos.length > 0) {
      await uploadPhotos();
    }

    // TODO: Implement the rest of the generation logic
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Ready to Showcase your Project?
          </CardTitle>
          <p className="text-center text-muted-foreground !mt-6">
            Auto-generate READMEs, Devpost docs, and pitch decks for your
            project — tailored to impress judges, investors, your friends, and
            more! Focus on coding, while we craft your story.
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <Label htmlFor="project-select">Choose a Project</Label>
            <Select onValueChange={setSelectedProject} value={selectedProject}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="What do you want to demo?" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Voice Input Section */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                variant="outline"
                className={
                  isRecording
                    ? "bg-red-100 hover:bg-red-200 dark:text-background"
                    : ""
                }
                onClick={toggleRecording}
              >
                <Mic
                  className={`w-4 h-4 ${isRecording ? "text-red-500" : ""} mr-2`}
                />
                {isRecording ? "Stop Recording" : "Describe Your Project"}
              </Button>
            </div>
            <div className="relative">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ex: what you did, how it went, key features, challenges overcome..."
                className="w-full min-h-[150px] p-3 rounded-md border border-input"
              />
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleAddPhoto}
            />
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Add Photos
            </Button>
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative aspect-video">
                    <Image
                      src={photo}
                      alt={`Uploaded photo ${index + 1}`}
                      fill
                      className="object-cover rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-85"
                      onClick={() => handleRemovePhoto(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* File Selection */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">
              Which Docs Should Be Generated?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fileTypes.map((file) => (
                <Card
                  key={file.id}
                  className={`cursor-pointer transition-all ${
                    selectedFiles.includes(file.id)
                      ? "ring-2 ring-primary"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => {
                    setSelectedFiles((prev) =>
                      prev.includes(file.id)
                        ? prev.filter((id) => id !== file.id)
                        : [...prev, file.id],
                    );
                  }}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    {file.icon}
                    <h4 className="font-semibold my-2">{file.label}</h4>
                    <p className="text-sm text-muted-foreground !mt-0">
                      {file.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <ButtonWithLoading
            className="w-full"
            loadingText="Crafting Your documentation..."
            onClick={handleGenerate}
            disabled={
              selectedFiles.length === 0 || !selectedProject || !description
            }
          >
            Generate Documentation
          </ButtonWithLoading>
        </CardContent>
      </Card>
    </div>
  );
}
