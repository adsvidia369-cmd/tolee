import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Image as ImageIcon, Video, Paperclip, CheckCircle2, ShieldCheck, Globe, Trophy, X } from 'lucide-react';

export function CreatePostModal({ children, onPost, videoOnly = false }: { children: React.ReactNode, onPost?: (post: any) => void, videoOnly?: boolean }) {
  const [postType, setPostType] = useState('regular'); // regular, win
  const [content, setContent] = useState('');
  const [selectedTolees, setSelectedTolees] = useState<string[]>([]);
  const [media, setMedia] = useState<{type: 'image'|'video', url: string} | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock joined Tolees from API
  const joinedTolees = [
    { id: 't1', name: 'AI Automation Society', slug: 'ai-automation-society', isPrivate: false },
    { id: 't2', name: 'Sabaka Mangal Ho', slug: 'sabaka-mangal-ho', isPrivate: true },
    { id: 't3', name: 'That Pickleball Tolee', slug: 'pickleball', isPrivate: false },
  ];

  const toggleTolee = (id: string) => {
    if (selectedTolees.includes(id)) {
      setSelectedTolees(selectedTolees.filter(tId => tId !== id));
    } else {
      setSelectedTolees([...selectedTolees, id]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      const fileType = file.type.startsWith('video/') ? 'video' : 'image';
      setMedia({ type: fileType, url });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = (accept: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  };

  const handlePost = async () => {
    if (onPost && isPostReady) {
      setIsUploading(true);
      const selectedToleeObj = joinedTolees.find(t => t.id === selectedTolees[0]);
      
      let finalMediaUrl = media?.url;
      
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          if (data.success) {
            finalMediaUrl = data.url;
          }
        } catch (e) {
          console.error("Upload failed", e);
        }
      }

      await onPost({
        content,
        postType,
        toleeName: selectedToleeObj?.name || 'Selected Tolees',
        toleeSlug: selectedToleeObj?.slug || 'group',
        media: media && finalMediaUrl ? { type: media.type, url: finalMediaUrl } : null
      });
      setIsUploading(false);
    }
    // Reset form
    setContent('');
    setMedia(null);
    setSelectedFile(null);
    setSelectedTolees([]);
    setIsOpen(false);
  };

  const isPostReady = content.trim().length > 0 && selectedTolees.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={React.isValidElement(children) ? children as React.ReactElement : <button>{children}</button>} />
      <DialogContent className="sm:max-w-[550px] p-0 bg-white dark:bg-[#121212] overflow-y-auto max-h-[90vh] rounded-2xl border-gray-200 dark:border-gray-800">

        {/* Header */}
        <DialogHeader className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">Create Post</DialogTitle>
          <div className="flex bg-gray-100 dark:bg-gray-900 rounded-full p-1 border border-gray-200 dark:border-gray-800">
            <button 
              onClick={() => setPostType('regular')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${postType === 'regular' ? 'bg-white dark:bg-black shadow-sm text-primary' : 'text-gray-500'}`}
            >
              Post
            </button>
            <button 
              onClick={() => setPostType('win')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1 ${postType === 'win' ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-500 shadow-sm' : 'text-gray-500'}`}
            >
              <Trophy className="w-4 h-4" /> Win
            </button>
          </div>
        </DialogHeader>

        {/* User Info */}
        <div className="p-4 flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://i.pravatar.cc/150?u=me" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Alex Johnson</h3>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Globe className="w-3 h-3" /> Visible only to selected Tolees
            </span>
          </div>
        </div>

        {/* Text Area */}
        <div className="px-4 pb-2">
          <textarea
            placeholder={postType === 'win' ? "Share your recent win with the community! 🚀" : "What do you want to share?"}
            className="w-full min-h-[100px] bg-transparent border-none focus:ring-0 resize-none text-[17px] text-gray-900 dark:text-white placeholder:text-gray-400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        {/* Media Preview */}
        {media && (
          <div className="px-4 pb-4 relative">
            <button onClick={() => { setMedia(null); setSelectedFile(null); }} className="absolute top-2 right-6 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full p-1 backdrop-blur-md">
              <X className="w-4 h-4" />
            </button>
            {media.type === 'image' ? (
              <img src={media.url} alt="Attached" className="w-full h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-800" />
            ) : (
              <video src={media.url} className="w-full h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-800" controls />
            )}
          </div>
        )}

        {/* Attachments */}
        <div className="px-4 py-2 border-t border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Add to your post</span>
          <div className="flex gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />
            {!videoOnly && (
              <Button onClick={() => triggerFileInput('image/*')} variant="ghost" size="icon" className="text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950 rounded-full h-10 w-10">
                <ImageIcon className="w-6 h-6" />
              </Button>
            )}
            <Button onClick={() => triggerFileInput('video/*')} variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-full h-10 w-10">
              <Video className="w-6 h-6" />
            </Button>
            {!videoOnly && (
              <Button onClick={() => triggerFileInput('*/*')} variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full h-10 w-10">
                <Paperclip className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Select Tolees Section (Point 9, 13) */}
        <div className="p-4 bg-gray-50 dark:bg-[#1a1a1a]">
          <h4 className="text-sm font-bold mb-3 text-gray-700 dark:text-gray-300">
            Post to these Tolees <span className="text-red-500">*</span>
          </h4>
          
          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2">
            {joinedTolees.map((tolee) => (
              <div 
                key={tolee.id}
                onClick={() => toggleTolee(tolee.id)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedTolees.includes(tolee.id) 
                    ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold text-xs">
                    {tolee.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm">{tolee.name}</h5>
                    {tolee.isPrivate && (
                      <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-3 h-3" /> Private Group
                      </span>
                    )}
                  </div>
                </div>
                
                {selectedTolees.includes(tolee.id) ? (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-700" />
                )}
              </div>
            ))}
          </div>
          
          {selectedTolees.length === 0 && (
            <p className="text-xs text-red-500 mt-2 font-medium">Please select at least one Tolee.</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white dark:bg-[#121212] border-t border-gray-100 dark:border-gray-800">
          <Button 
            className="w-full h-12 text-base font-bold rounded-xl"
            disabled={!isPostReady || isUploading}
            onClick={handlePost}
          >
            {isUploading ? 'Uploading...' : `Post to ${selectedTolees.length > 0 ? `${selectedTolees.length} Tolees` : 'Tolee'}`}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
