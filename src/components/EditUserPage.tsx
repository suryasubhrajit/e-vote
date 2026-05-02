"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthMiddleware } from "@/app/auth/middleware/useAuthMiddleware";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useParams, useRouter } from "next/navigation";
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
import { toast } from "sonner";
import User from "./types/UserType";

export default function EditUserPage() {
  const { user, loading, isAdmin } = useAuthMiddleware();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdminState, setIsAdminState] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [uploading, setUploading] = useState(false);
  const [users, setUser] = useState<User | null>(null);

  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id as string)
          .single();

        if (error) {
          console.error("Error fetching user:", error);
          return;
        }

        if (data) {
          setUser({
            uid: data.id,
            name: data.name || "",
            email: data.email || "",
            isAdmin: data.is_admin || false,
            selectedCandidate: data.selected_candidate || "",
          });

          setName(data.name || "");
          setEmail(data.email || "");
          setIsAdminState(data.is_admin || false);
          setSelectedCandidate(data.selected_candidate || "");
        }
      };


      fetchUser();
    }
  }, [id]);

  if (loading) return <h1>Loading...</h1>;

  if (!user || !isAdmin) return <h1>Access Denied</h1>;

  const handleSubmit = async () => {
    setUploading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name,
          email,
          is_admin: isAdminState,
          selected_candidate: selectedCandidate || null,
        })
        .eq('id', id as string);

      if (error) throw error;


      toast.success("User updated successfully");
      router.push("/dashboard/users");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div>
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/users">Users</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/users/edit/${id}`}>
                  Edit
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <h1 className="mt-4 font-bold text-lg">Edit User</h1>

        <div className="items-center gap-1.5 grid mt-4 w-full max-w-sm">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="gap-1.5 grid mt-4 w-full max-w-sm">
          <Label htmlFor="email">Email</Label>
          <Input
            placeholder="Type candidate's email here."
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="gap-1.5 grid mt-4 w-full max-w-sm">
          <Label>Is Admin</Label>
          <Select
            value={isAdminState.toString()}
            onValueChange={(value) => setIsAdminState(value === "true")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Is Admin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="mt-4 text-white dark:text-slate-900"
          onClick={handleSubmit}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Submit"}
        </Button>
        <Button
          className="mt-4 text-white ms-4"
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
