'use client';

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, MoreVertical, Phone, Video, Paperclip, Smile, Send, Check, CheckCheck, EyeOff, Users, ShieldCheck } from 'lucide-react';

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState(1);

  const chats = [
    {
      id: 1,
      name: 'AI Automation Society',
      avatar: 'https://i.pravatar.cc/150?u=12',
      isGroup: true,
      membersCount: '347.4k',
      hideMembers: false,
      lastMessage: 'Alex: Make sure to check the new module!',
      time: '10:42 AM',
      unread: 5,
      online: '1.2k online'
    },
    {
      id: 2,
      name: 'Sabaka Mangal Ho',
      avatar: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=150',
      isGroup: true,
      membersCount: '128',
      hideMembers: true, // Admin hid members
      lastMessage: 'Rahul: Bhai, new update is awesome.',
      time: '09:15 AM',
      unread: 0,
      online: '12 online'
    },
    {
      id: 3,
      name: 'Sarah Chen',
      avatar: 'https://i.pravatar.cc/150?u=41',
      isGroup: false,
      lastMessage: 'Thanks for the help with the webhook!',
      time: 'Yesterday',
      unread: 1,
      online: 'Online'
    }
  ];

  const messages = [
    { id: 1, sender: 'Alex Johnson', senderAvatar: 'https://i.pravatar.cc/150?u=99', text: 'Welcome everyone to the official AI Automation chat!', time: '10:00 AM', isMe: false },
    { id: 2, sender: 'Sarah Chen', senderAvatar: 'https://i.pravatar.cc/150?u=41', text: 'Excited to be here! When is the next live Q&A?', time: '10:05 AM', isMe: false },
    { id: 3, sender: 'Me', senderAvatar: 'https://i.pravatar.cc/150?u=me', text: 'I think it is scheduled for Friday. Check the calendar tab.', time: '10:12 AM', isMe: true },
    { id: 4, sender: 'Alex Johnson', senderAvatar: 'https://i.pravatar.cc/150?u=99', text: 'Yes, Friday at 5 PM EST. Make sure to check the new module before then!', time: '10:42 AM', isMe: false },
  ];

  const activeChatDetails = chats.find(c => c.id === activeChat);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-[#0a0a0a] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 m-4 lg:m-0 lg:border-none lg:rounded-none">
      
      {/* Left Chat List (WhatsApp Left Panel) */}
      <div className="w-full md:w-[350px] lg:w-[400px] flex-shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50 dark:bg-[#121212]">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chats</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-gray-500 rounded-full"><PlusCircle className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" className="text-gray-500 rounded-full"><MoreVertical className="w-5 h-5" /></Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search or start new chat" 
              className="w-full pl-9 bg-white dark:bg-gray-900 border-none rounded-lg h-10"
            />
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {chats.map((chat) => (
              <div 
                key={chat.id} 
                onClick={() => setActiveChat(chat.id)}
                className={`flex items-center gap-3 p-3 mx-2 rounded-xl cursor-pointer transition-colors ${
                  activeChat === chat.id 
                    ? 'bg-primary/10 dark:bg-primary/20' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback>{chat.name[0]}</AvatarFallback>
                  </Avatar>
                  {chat.online === 'Online' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#121212] rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className={`font-semibold text-[15px] truncate ${activeChat === chat.id ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                      {chat.name}
                    </h3>
                    <span className={`text-xs whitespace-nowrap ml-2 ${chat.unread > 0 ? 'text-primary font-bold' : 'text-gray-500'}`}>
                      {chat.time}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate pr-2">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <div className="bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Chat Window */}
      <div className="hidden md:flex flex-1 flex-col bg-[#e8f1e4]/30 dark:bg-[#0a0a0a] relative">
        {/* Chat Pattern Background (Like WhatsApp) */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}>
        </div>

        {activeChatDetails ? (
          <>
            {/* Chat Header */}
            <div className="h-16 flex items-center justify-between px-4 lg:px-6 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 z-10">
              <div className="flex items-center gap-3 cursor-pointer">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={activeChatDetails.avatar} />
                  <AvatarFallback>{activeChatDetails.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {activeChatDetails.name}
                    {activeChatDetails.isGroup && activeChatDetails.hideMembers && (
                      <EyeOff className="w-3.5 h-3.5 text-gray-400" title="Member list hidden by admin" />
                    )}
                  </h2>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    {activeChatDetails.isGroup ? (
                      <>
                        <span>{activeChatDetails.membersCount} members</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-green-600 dark:text-green-400 font-medium">{activeChatDetails.online}</span>
                      </>
                    ) : (
                      <span className="text-green-600 dark:text-green-400 font-medium">{activeChatDetails.online}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 text-gray-500">
                <Button variant="ghost" size="icon" className="rounded-full"><Video className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full"><Phone className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full"><Search className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="w-5 h-5" /></Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 lg:p-6 z-10">
              <div className="flex flex-col gap-4">
                
                {/* Date Badge */}
                <div className="flex justify-center mb-2">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 text-xs font-semibold px-3 py-1 rounded-md shadow-sm">
                    Today
                  </div>
                </div>

                {/* Info Message (Point 5 - Hidden Members logic) */}
                {activeChatDetails.isGroup && activeChatDetails.hideMembers && (
                  <div className="flex justify-center mb-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-500 text-xs text-center px-4 py-2 rounded-lg max-w-md border border-yellow-200 dark:border-yellow-900/50">
                      <ShieldCheck className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                      The admin has restricted visibility of the member list. You can still chat here safely.
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <div key={msg.id} className={`flex max-w-[80%] ${msg.isMe ? 'self-end' : 'self-start'}`}>
                    
                    {!msg.isMe && activeChatDetails.isGroup && (
                      <Avatar className="w-8 h-8 mr-2 flex-shrink-0 mt-auto mb-1">
                        <AvatarImage src={msg.senderAvatar} />
                      </Avatar>
                    )}
                    
                    <div className="flex flex-col">
                      {!msg.isMe && activeChatDetails.isGroup && (
                        <span className="text-[11px] text-gray-500 font-semibold mb-1 ml-1">{msg.sender}</span>
                      )}
                      
                      <div className={`relative px-4 py-2.5 rounded-2xl shadow-sm ${
                        msg.isMe 
                          ? 'bg-primary text-white rounded-tr-sm' 
                          : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-tl-sm border border-gray-100 dark:border-gray-800'
                      }`}>
                        <p className="text-[15px] leading-relaxed">{msg.text}</p>
                        
                        <div className={`flex items-center justify-end gap-1 mt-1 -mb-1 ${msg.isMe ? 'text-primary-foreground/70' : 'text-gray-400'}`}>
                          <span className="text-[10px]">{msg.time}</span>
                          {msg.isMe && <CheckCheck className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-3 lg:p-4 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 z-10">
              <div className="flex items-end gap-2 bg-gray-100 dark:bg-gray-900 rounded-2xl p-2 pl-4 pr-2">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full h-10 w-10 flex-shrink-0">
                  <Smile className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full h-10 w-10 flex-shrink-0">
                  <Paperclip className="w-5 h-5" />
                </Button>
                
                <textarea 
                  placeholder="Type a message..." 
                  className="w-full max-h-32 min-h-[40px] bg-transparent border-none focus:ring-0 resize-none py-2.5 text-[15px] text-gray-900 dark:text-white placeholder:text-gray-400"
                  rows={1}
                ></textarea>
                
                <Button size="icon" className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-white shadow-md flex-shrink-0">
                  <Send className="w-4 h-4 ml-0.5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 z-10">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tolee Web</h2>
            <p className="text-gray-500 max-w-md">
              Send and receive messages without keeping your phone online. 
              <br />Use Tolee on up to 4 linked devices and 1 phone at the same time.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

// PlusCircle component not imported, let's create a quick SVG or import it
function PlusCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}
