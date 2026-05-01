"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function EditProfileModal({ user, children }: { user: any, children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
    avatar: user.avatar || '',
    coverImage: user.coverImage || '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setFormData(prev => ({ ...prev, avatar: URL.createObjectURL(e.target.files![0]) }));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
      setFormData(prev => ({ ...prev, coverImage: URL.createObjectURL(e.target.files![0]) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let finalAvatarUrl = formData.avatar;
      let finalCoverUrl = formData.coverImage;

      if (avatarFile) {
        const uploadData = new FormData();
        uploadData.append('file', avatarFile);
        const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
        const data = await res.json();
        if (data.success) finalAvatarUrl = data.url;
      }

      if (coverFile) {
        const uploadData = new FormData();
        uploadData.append('file', coverFile);
        const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
        const data = await res.json();
        if (data.success) finalCoverUrl = data.url;
      }

      const payload = {
        ...formData,
        avatar: finalAvatarUrl,
        coverImage: finalCoverUrl
      };

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        setOpen(false);
        router.refresh(); // Refresh the page to show new data
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {React.cloneElement(children as React.ReactElement, {
        onClick: (e: React.MouseEvent) => {
          setOpen(true);
          if ((children as React.ReactElement).props.onClick) {
            (children as React.ReactElement).props.onClick(e);
          }
        }
      })}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <textarea 
              name="bio" 
              value={formData.bio} 
              onChange={handleChange} 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Mumbai, India" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Website</label>
            <Input name="website" value={formData.website} onChange={handleChange} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Profile Picture</label>
            <div className="flex items-center gap-4">
              {formData.avatar && <img src={formData.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />}
              <Input type="file" accept="image/*" onChange={handleAvatarChange} className="cursor-pointer" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Wall Cover Image</label>
            <div className="flex flex-col gap-2">
              {formData.coverImage && <img src={formData.coverImage} alt="Cover" className="w-full h-24 rounded-lg object-cover" />}
              <Input type="file" accept="image/*" onChange={handleCoverChange} className="cursor-pointer" />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="button" variant="outline" className="mr-2" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
