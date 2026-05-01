'use client';

import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Link as LinkIcon, Calendar, Trophy, Star, ShieldCheck, Mail, Edit3, Camera } from 'lucide-react';
import { FollowButton } from '@/components/FollowButton';
import { EditProfileModal } from '@/components/EditProfileModal';
import { useRouter } from 'next/navigation';
import { ImageCropModal } from '@/components/ImageCropModal';

export function ProfileHeaderCard({ 
  user, 
  isMe, 
  currentUserId, 
  isFollowing 
}: { 
  user: any; 
  isMe: boolean; 
  currentUserId: string | undefined; 
  isFollowing: boolean;
}) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Cropping states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropType, setCropType] = useState<'avatar' | 'coverImage'>('avatar');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'coverImage') => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setCropImageSrc(url);
      setCropType(type);
      setCropModalOpen(true);
      // Reset input so the same file can be selected again
      e.target.value = '';
    }
  };

  const handleUpload = async (file: File, type: 'avatar' | 'coverImage') => {
    setCropModalOpen(false);
    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      
      // 1. Upload the image to get the URL
      const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
      const data = await res.json();
      
      if (data.success) {
        // 2. Update the user profile with the new URL
        const payload = {
          name: user.name,
          bio: user.bio || '',
          location: user.location || '',
          website: user.website || '',
          avatar: type === 'avatar' ? data.url : user.avatar,
          coverImage: type === 'coverImage' ? data.url : user.coverImage,
        };

        const updateRes = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (updateRes.ok) {
          router.refresh();
        }
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-[#121212] overflow-hidden mb-8">
      {/* Cover Image */}
      <div 
        className="h-48 bg-gradient-to-r from-primary/80 to-accent/80 relative bg-cover bg-center group"
        style={user.coverImage ? { backgroundImage: `url(${user.coverImage})` } : {}}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        
        {isMe && (
          <>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={coverInputRef}
              onChange={(e) => handleFileChange(e, 'coverImage')} 
            />
            <Button 
              variant="secondary" 
              className="absolute bottom-4 right-4 bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black backdrop-blur-sm text-sm font-bold shadow-md z-50"
              onClick={() => coverInputRef.current?.click()}
              disabled={isUploading}
            >
              <Camera className="w-4 h-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Edit cover photo'}
            </Button>
          </>
        )}
      </div>
      
      <CardContent className="px-6 sm:px-8 pb-8 relative">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-end -mt-16 sm:-mt-20 mb-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-[#121212] overflow-hidden shadow-xl bg-white relative">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            {isMe && (
              <>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={avatarInputRef}
                  onChange={(e) => handleFileChange(e, 'avatar')} 
                />
                <button 
                  className="absolute bottom-2 right-2 w-10 h-10 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full flex items-center justify-center border-2 border-white dark:border-[#121212] shadow-md transition-colors"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Camera className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </>
            )}
          </div>
          
          <div className="flex-grow text-center sm:text-left mb-2">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{user.name}</h1>
              {user.isVerified && <ShieldCheck className="w-6 h-6 text-primary fill-primary/10" />}
            </div>
            <p className="text-lg text-gray-500 font-medium mb-3">@{user.username}</p>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {user.location}</span>
              <span className="flex items-center gap-1.5"><LinkIcon className="w-4 h-4" /> <a href="#" className="text-primary hover:underline">{user.website}</a></span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {user.joinedDate}</span>
            </div>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            {!isMe && currentUserId && (
              <FollowButton targetUserId={user.id} initialIsFollowing={isFollowing} />
            )}
            {isMe && (
              <EditProfileModal user={user}>
                <Button variant="outline" className="w-full sm:w-auto font-bold px-8 rounded-full shadow-md">Edit Profile</Button>
              </EditProfileModal>
            )}
            <Button variant="outline" className="w-12 px-0 rounded-full"><Mail className="w-5 h-5" /></Button>
          </div>
        </div>

        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto sm:mx-0 text-center sm:text-left">
          {user.bio}
        </p>

        {/* Gamification Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
            <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{user.level}</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Level</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
            <Star className="w-8 h-8 text-primary mb-2" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{(user.points / 1000).toFixed(1)}k</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Points</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
            <ShieldCheck className="w-8 h-8 text-green-500 mb-2" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{user.trustScore}%</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Trust Score</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
            <Edit3 className="w-8 h-8 text-purple-500 mb-2" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{user.posts.length}</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Posts</span>
          </div>
        </div>
      </CardContent>

      {/* Image Crop Modal */}
      {cropImageSrc && (
        <ImageCropModal
          isOpen={cropModalOpen}
          onClose={() => setCropModalOpen(false)}
          imageSrc={cropImageSrc}
          onSave={(file) => handleUpload(file, cropType)}
          aspectRatio={cropType === 'avatar' ? 1 : 3}
          cropShape={cropType === 'avatar' ? 'round' : 'rect'}
          title={cropType === 'avatar' ? 'Adjust Profile Picture' : 'Adjust Cover Photo'}
        />
      )}
    </Card>
  );
}
