"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthMiddleware } from "@/app/auth/middleware/useAuthMiddleware";


import { useParams, useRouter } from "next/navigation";
import Candidate from "./types/CandidateType";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import Image from "next/image";
import DotPattern from "./magicui/dot-pattern";
import { cn } from "@/lib/utils";

export default function EditCandidatePage() {
  const { user, loading, isAdmin } = useAuthMiddleware();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [candidate, setCandidate] = useState<Candidate | null>(null);

  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchCandidate = async () => {
        const { data, error } = await supabase
          .from('candidates')
          .select('*')
          .eq('id', id as string)
          .single();

        if (error) {
          console.error("Error fetching candidate:", error);
          return;
        }

        if (data) {
          setCandidate({
            id: data.id,
            name: data.name || "",
            description: data.description || "",
            vision: data.vision || "",
            mission: data.mission || "",
            photoURL: data.photo_url || "",
          });

          setName(data.name || "");
          setDescription(data.description || "");
          setVision(data.vision || "");
          setMission(data.mission || "");
        }
      };


      fetchCandidate();
    }
  }, [id]);

  if (loading) return <h1>Loading...</h1>;

  if (!user || isAdmin === false) return <h1>Access Denied</h1>;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFile = e.target.files[0];
      setFile(newFile);

      // Update the candidate state to show the new image immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setCandidate(
          (prev) => prev && { ...prev, photoURL: e.target?.result as string }
        );
      };
      reader.readAsDataURL(newFile);
    }
  };

  const handleSubmit = async () => {
    setUploading(true);

    try {
      let photo_url = candidate?.photoURL || "";

      if (file) {
        // In Supabase, we can just upload and overwrite if needed, or delete old one
        if (candidate?.photoURL) {
          // Extract file path from URL if needed, or just let it be
          // For simplicity, we just upload a new one
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('candidates')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('candidates')
          .getPublicUrl(filePath);

        photo_url = publicUrl;
      }

      // Update candidate in Supabase
      const { error: updateError } = await supabase
        .from('candidates')
        .update({
          name,
          description,
          vision,
          mission,
          photo_url,
        })
        .eq('id', id as string);

      if (updateError) throw updateError;


      toast.success("Candidate updated successfully");
      router.push("/dashboard/candidates");
    } catch (error) {
      console.error("Error updating candidate:", error);
      toast.error("Error updating candidate");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="">
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
                <BreadcrumbLink href={`/dashboard/candidates/edit/${id}`}>
                  Edit
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <h1 className="font-bold text-lg mt-4">Edit Candidate</h1>

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
          {candidate?.photoURL && (
            <div className="rounded-md overflow-hidden object-cover flex justify-center">
              <Image
                width={200}
                height={100}
                src={candidate.photoURL}
                alt={candidate?.name}
                className="rounded-md"
              />
            </div>
          )}
          <Label htmlFor="picture" className="mt-2">
            Picture
          </Label>
          <Input id="picture" type="file" onChange={handleFileChange} />
        </div>

        <Button
          className="text-white dark:text-slate-900 mt-4"
          onClick={handleSubmit}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Submit"}
        </Button>
        <Button
          className="text-white mt-4 ms-4"
          onClick={() => {
            router.back();
          }}
          variant={"destructive"}
        >
          Cancel
        </Button>
      </div>
    </>
  );
}
