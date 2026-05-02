"use client";

import { useState } from "react";
import { createClient } from "pexels";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PexelsImageSearchProps {
  onImageSelect: (url: string) => void;
}

export function PexelsImageSearch({ onImageSelect }: PexelsImageSearchProps) {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const searchImages = async () => {
    if (!query) return;
    setLoading(true);
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
      if (!apiKey) {
        toast.error("Pexels API key is not configured.");
        setLoading(false);
        return;
      }

      const client = createClient(apiKey);
      const response = await client.photos.search({ query, per_page: 20 });
      
      if ("photos" in response) {
        setImages(response.photos);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error("Error fetching images from Pexels:", error);
      toast.error("Failed to fetch images.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (url: string) => {
    onImageSelect(url);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">Search Pexels</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Search Images from Pexels</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 my-4">
          <Input 
            placeholder="Search for photos..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchImages()}
          />
          <Button onClick={searchImages} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-1">
          {images.map((img) => (
            <div 
              key={img.id} 
              className="relative aspect-square cursor-pointer overflow-hidden rounded-md hover:opacity-80 transition-opacity border"
              onClick={() => handleSelect(img.src.large)}
            >
              <Image 
                src={img.src.medium} 
                alt={img.alt || "Pexels photo"} 
                fill 
                className="object-cover" 
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
          {images.length === 0 && !loading && query && (
            <div className="col-span-full text-center text-muted-foreground mt-8">
              No images found.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
