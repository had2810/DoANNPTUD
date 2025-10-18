
import { useState } from "react";
import { Search, Phone, Send, Paperclip, Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  sender: "user" | "customer";
  text: string;
  time: string;
}

const contacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    lastMessage: "I've been having trouble logging in...",
    time: "10:42 AM",
    unread: 2,
    online: true
  },
  {
    id: "2",
    name: "Thomas Lee",
    lastMessage: "Thanks for your help with my request",
    time: "Yesterday",
    unread: 0,
    online: false
  },
  {
    id: "3",
    name: "Emma Wilson",
    lastMessage: "Can I get an update on my refund?",
    time: "Yesterday",
    unread: 1,
    online: true
  },
  {
    id: "4",
    name: "Michael Brown",
    lastMessage: "I'll try the steps you suggested",
    time: "Monday",
    unread: 0,
    online: false
  },
  {
    id: "5",
    name: "Jane Smith",
    lastMessage: "When will my order be delivered?",
    time: "Monday",
    unread: 0,
    online: true
  }
];

const messages: Message[] = [
  {
    id: "m1",
    sender: "customer",
    text: "Hello! I've been having trouble logging into my account after the password reset.",
    time: "10:30 AM"
  },
  {
    id: "m2",
    sender: "user",
    text: "Hi Sarah, I'm sorry to hear that. Let me help you with this issue. Could you tell me what happens when you try to log in?",
    time: "10:32 AM"
  },
  {
    id: "m3",
    sender: "customer",
    text: "When I enter my new password, it says 'Invalid credentials' even though I'm sure I'm typing it correctly.",
    time: "10:35 AM"
  },
  {
    id: "m4",
    sender: "user",
    text: "Thank you for that information. Let's try to troubleshoot this. First, could you try clearing your browser cache and cookies, then attempt to log in again?",
    time: "10:38 AM"
  },
  {
    id: "m5",
    sender: "customer",
    text: "I just tried that and I'm still getting the same error message unfortunately.",
    time: "10:40 AM"
  },
  {
    id: "m6",
    sender: "user",
    text: "I see. In that case, let me reset your password manually from our system. After that, you'll receive an email with a temporary password that you can use to log in and then change to a new password of your choice.",
    time: "10:42 AM"
  }
];

const ContactItem = ({ contact, isActive, onClick }: { contact: Contact, isActive: boolean, onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-muted transition-colors",
        isActive && "bg-muted"
      )}
    >
      <div className="relative">
        <Avatar>
          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
        </Avatar>
        {contact.online && (
          <span className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">{contact.name}</span>
          <span className="text-xs text-muted-foreground">{contact.time}</span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
      </div>
      {contact.unread > 0 && (
        <Badge variant="default" className="rounded-full h-5 min-w-[20px] flex items-center justify-center">
          {contact.unread}
        </Badge>
      )}
    </button>
  );
};

const Conversations = () => {
  const [activeContact, setActiveContact] = useState(contacts[0]);
  
  return (
    <div className="flex h-[calc(100vh-9rem)]">
      {/* Contact List */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-8 h-9 bg-muted/50 border-0"
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {contacts.map(contact => (
            <ContactItem 
              key={contact.id} 
              contact={contact} 
              isActive={contact.id === activeContact.id}
              onClick={() => setActiveContact(contact)}
            />
          ))}
        </div>
      </div>
      
      {/* Conversation */}
      <div className="flex-1 flex flex-col">
        {/* Conversation Header */}
        <div className="h-16 border-b px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{activeContact.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{activeContact.name}</h3>
              <p className="text-xs text-muted-foreground">
                {activeContact.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={cn(
                "flex",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div 
                className={cn(
                  "max-w-[70%] px-4 py-3 rounded-lg",
                  message.sender === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{message.text}</p>
                <span className={cn(
                  "text-xs mt-1 block",
                  message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  {message.time}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Message Input */}
        <div className="p-4 border-t bg-card flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input placeholder="Type a message..." className="flex-1" />
          <Button variant="ghost" size="icon" className="shrink-0">
            <Smile className="h-5 w-5" />
          </Button>
          <Button size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Conversations;
