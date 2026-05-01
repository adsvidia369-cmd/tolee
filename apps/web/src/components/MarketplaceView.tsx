'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Search, PlusCircle, MessageCircle, Home, Car, Smartphone, Briefcase, Camera, Store } from 'lucide-react';
import { createListing } from '@/actions/marketplace';

export function MarketplaceView({ initialListings }: { initialListings: any[] }) {
  const [listings, setListings] = useState(initialListings);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');

  // New Listing State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    locationText: '',
    category: 'Property',
    condition: 'new',
    description: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    furnishing: 'Unfurnished'
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { name: 'All', icon: Search },
    { name: 'Property', icon: Home },
    { name: 'Vehicles', icon: Car },
    { name: 'Electronics', icon: Smartphone },
    { name: 'Services', icon: Briefcase },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Limit to 10 photos
      const newFiles = [...selectedFiles, ...files].slice(0, 10);
      setSelectedFiles(newFiles);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalImageUrls: string[] = [];

    if (selectedFiles.length > 0) {
      for (const file of selectedFiles) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: uploadData
          });
          const uploadJson = await res.json();
          if (uploadJson.success) {
            finalImageUrls.push(uploadJson.url);
          }
        } catch (err) {
          console.error("Upload failed", err);
        }
      }
    }

    // Format description for properties
    let finalDescription = formData.description;
    if (formData.category === 'Property') {
      const propDetails = [];
      if (formData.bedrooms) propDetails.push(`Bedrooms: ${formData.bedrooms}`);
      if (formData.bathrooms) propDetails.push(`Bathrooms: ${formData.bathrooms}`);
      if (formData.area) propDetails.push(`Area: ${formData.area} sq ft`);
      if (formData.furnishing) propDetails.push(`Furnishing: ${formData.furnishing}`);
      
      if (propDetails.length > 0) {
        finalDescription = `**Property Details:**\n${propDetails.join(' | ')}\n\n${formData.description}`;
      }
    }

    const res = await createListing({
      title: formData.title,
      price: parseFloat(formData.price) || 0,
      locationText: formData.locationText,
      category: formData.category,
      condition: formData.condition,
      description: finalDescription,
      images: finalImageUrls.join(',')
    });

    if (res.success && res.listing) {
      const newListing = {
        ...res.listing,
        seller: {
          name: 'You', // optimistic update
          avatar: 'https://i.pravatar.cc/150?u=me'
        }
      };
      setListings([newListing, ...listings]);
      setIsModalOpen(false);
      setFormData({
        title: '', price: '', locationText: '', category: 'Property', condition: 'new', description: '', bedrooms: '', bathrooms: '', area: '', furnishing: 'Unfurnished'
      });
      setSelectedFiles([]);
      setImagePreviews([]);
    }
    setIsSubmitting(false);
  };

  const filteredListings = listings.filter(l => 
    (category === 'All' || l.category === category) &&
    l.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 max-w-7xl pt-24 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Marketplace</h1>
          <p className="text-gray-500">Buy and sell items locally</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="font-bold px-6 h-12 rounded-xl shadow-md bg-blue-600 hover:bg-blue-700 text-white">
          <PlusCircle className="w-5 h-5 mr-2" />
          Create New Listing
        </Button>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px] p-6 bg-white dark:bg-[#121212] rounded-2xl border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Create Listing</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              
              {/* Image Upload (Multiple) */}
              <div>
                <label className="block text-sm font-semibold mb-2">Photos (Up to 10)</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 group">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  ))}
                  
                  {imagePreviews.length < 10 && (
                    <div 
                      className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="w-6 h-6 text-gray-500 mb-1" />
                      <span className="text-[10px] font-medium text-gray-500">Add Photo</span>
                    </div>
                  )}
                </div>
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Title (e.g., 2BHK Flat for Sale)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="h-12 bg-gray-50 dark:bg-gray-900 border-none" />
                <Input placeholder="Price (₹)" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required className="h-12 bg-gray-50 dark:bg-gray-900 border-none" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select 
                  className="h-12 bg-gray-50 dark:bg-gray-900 border-none rounded-md px-3 text-sm outline-none"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Property">Property for Sale/Rent</option>
                  <option value="Vehicles">Vehicle for Sale</option>
                  <option value="Electronics">Item for Sale (Electronics)</option>
                  <option value="Services">Services</option>
                </select>
                <Input placeholder="Location (e.g., Ghatkopar East, Mumbai)" value={formData.locationText} onChange={e => setFormData({...formData, locationText: e.target.value})} required className="h-12 bg-gray-50 dark:bg-gray-900 border-none" />
              </div>

              {/* Real Estate Specific Fields */}
              {formData.category === 'Property' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 ml-1">Bedrooms</label>
                    <Input placeholder="e.g. 2BHK" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} className="h-10 bg-white dark:bg-[#121212] border-none text-sm mt-1" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 ml-1">Bathrooms</label>
                    <Input placeholder="e.g. 2" type="number" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} className="h-10 bg-white dark:bg-[#121212] border-none text-sm mt-1" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 ml-1">Area (sq ft)</label>
                    <Input placeholder="e.g. 1000" type="number" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="h-10 bg-white dark:bg-[#121212] border-none text-sm mt-1" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 ml-1">Furnishing</label>
                    <select 
                      className="h-10 w-full bg-white dark:bg-[#121212] border-none rounded-md px-2 text-sm outline-none mt-1"
                      value={formData.furnishing}
                      onChange={e => setFormData({...formData, furnishing: e.target.value})}
                    >
                      <option value="Unfurnished">Unfurnished</option>
                      <option value="Semi-Furnished">Semi-Furnished</option>
                      <option value="Fully Furnished">Fully Furnished</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Status/Condition */}
              {formData.category !== 'Property' && (
                <div className="flex gap-4">
                  <select 
                    className="h-12 bg-gray-50 dark:bg-gray-900 border-none rounded-md px-3 flex-1 text-sm outline-none"
                    value={formData.condition}
                    onChange={e => setFormData({...formData, condition: e.target.value})}
                  >
                    <option value="new">New</option>
                    <option value="like_new">Like New</option>
                    <option value="used">Used</option>
                  </select>
                </div>
              )}

              <textarea 
                placeholder="Description (Area, Price, Amenities, Nearby places, Contact details...)" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                required 
                className="w-full min-h-[120px] bg-gray-50 dark:bg-gray-900 border-none rounded-xl p-3 text-sm outline-none resize-y"
              />

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 text-xs text-blue-800 dark:text-blue-300">
                <span className="font-bold flex items-center mb-1"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Pro Tip:</span>
                Upload up to 10 photos. Listings with high-quality photos and detailed descriptions sell 40% faster.
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-12 font-bold text-base bg-blue-600 hover:bg-blue-700 text-white rounded-xl mt-2">
                {isSubmitting ? 'Publishing...' : 'Publish Listing'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <Input 
              placeholder="Search marketplace..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-white dark:bg-[#121212] border-gray-200 dark:border-gray-800 rounded-xl"
            />
          </div>

          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    category === cat.name 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <cat.icon className="w-5 h-5" />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="flex-1">
          {filteredListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
              <Store className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No listings found</h3>
              <p className="text-gray-500 max-w-md">Try adjusting your filters or search query to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredListings.map(listing => (
                <Card key={listing.id} className="overflow-hidden border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] group hover:shadow-lg transition-all rounded-2xl">
                  <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
                    <img 
                      src={listing.images || `https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt={listing.title}
                    />
                    <div className="absolute top-3 left-3 bg-white dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                      ₹{listing.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-[17px] text-gray-900 dark:text-white line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
                      {listing.title}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center mb-3">
                      <MapPin className="w-3.5 h-3.5 mr-1" /> {listing.locationText}
                    </p>
                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
                      <span className="text-xs font-semibold text-gray-400">{listing.category} • {listing.condition}</span>
                      <Button size="sm" variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-full font-bold">
                        <MessageCircle className="w-4 h-4 mr-1.5" /> Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
