"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthMiddleware } from "@/app/auth/middleware/useAuthMiddleware";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PexelsImageSearch } from "./PexelsImageSearch";
import Image from "next/image";


export default function CreateCandidatePage() {
  const { user, loading, isAdmin } = useAuthMiddleware();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [pexelsUrl, setPexelsUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  if (loading) return <h1>Loading...</h1>;

  if (!user || isAdmin === false) return <h1>Access Denied</h1>;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setPexelsUrl("");
    }
  };

  const handleSubmit = async () => {
    if (!file && !pexelsUrl) {
      toast.error("Please select or search for a photo");
      return;
    }

    setUploading(true);

    try {
      let finalPhotoUrl = pexelsUrl;

      if (file) {
        // Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('candidates')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('candidates')
          .getPublicUrl(filePath);

        finalPhotoUrl = publicUrl;
      }

      const { error: insertError } = await supabase
        .from('candidates')
        .insert({
          name,
          description,
          photo_url: finalPhotoUrl,
          vision,
          mission,
        });

      if (insertError) throw insertError;

      setUploading(false);
      setName("");
      setDescription("");
      setVision("");
      setMission("");
      setFile(null);
      setPexelsUrl("");

      toast.success("Candidate created successfully");
      router.push("/dashboard/candidates");
    } catch (error: any) {
      console.error("Error saving candidate:", error);
      setUploading(false);
      toast.error(error.message || "Error saving candidate");
    }
  };


  return (
    <div>
      <div className="">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/candidates">
                Candidates
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/candidates/create">
                Create
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="font-bold text-lg mt-4">Create Candidate</h1>

      <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="grid w-full gap-1.5 max-w-sm mt-4">
        <Label htmlFor="description">Description</Label>
        <Textarea
          placeholder="Type candidate's description here."
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid w-full gap-1.5 max-w-sm mt-4">
        <Label htmlFor="vision">Vision</Label>
        <Textarea
          placeholder="Type candidate's vision here."
          id="vision"
          value={vision}
          onChange={(e) => setVision(e.target.value)}
        />
      </div>

      <div className="grid w-full gap-1.5 max-w-sm mt-4">
        <Label htmlFor="mission">Mission</Label>
        <Textarea
          placeholder="Type candidate's mission here."
          id="mission"
          value={mission}
          onChange={(e) => setMission(e.target.value)}
        />
      </div>

      <div className="grid w-full gap-1.5 max-w-sm mt-4">
        <Label htmlFor="picture">Picture</Label>
        <div className="flex gap-2 items-center">
          <Input id="picture" type="file" onChange={handleFileChange} />
          <span className="text-sm font-medium">OR</span>
          <PexelsImageSearch onImageSelect={(url) => {
            setPexelsUrl(url);
            setFile(null);
            // Reset file input
            const fileInput = document.getElementById('picture') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
          }} />
        </div>
        {pexelsUrl && (
          <div className="mt-2 relative w-32 h-32 rounded-md overflow-hidden border">
            <Image src={pexelsUrl} alt="Selected from Pexels" fill className="object-cover" />
          </div>
        )}
      </div>

      <Button
        className="text-white dark:text-slate-900 mt-4"
        onClick={handleSubmit}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Submit"}
      </Button>
    </div>
  );
}
