
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PhoneCall, PhoneMissed, Clock, Calendar, Phone, User, Search } from "lucide-react";

const CallItem = ({ name, number, time, type, duration }: { 
  name: string; 
  number: string; 
  time: string; 
  type: "incoming" | "outgoing" | "missed"; 
  duration?: string;
}) => {
  return (
    <div className="flex items-center justify-between p-3 border-b hover:bg-slate-50">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          type === "missed" ? "bg-red-100 text-red-500" : 
          type === "incoming" ? "bg-green-100 text-green-500" : 
          "bg-blue-100 text-blue-500"
        }`}>
          {type === "missed" ? <PhoneMissed size={18} /> : 
           type === "incoming" ? <PhoneCall size={18} /> : 
           <Phone size={18} />}
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">{number}</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="text-sm text-muted-foreground">{time}</p>
        {duration && <p className="text-xs text-muted-foreground">{duration}</p>}
      </div>
    </div>
  );
};

const Calls = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  
  const calls = [
    { id: 1, name: "John Smith", number: "+1 (555) 123-4567", time: "10:30 AM", type: "incoming" as const, duration: "5:24" },
    { id: 2, name: "Emily Johnson", number: "+1 (555) 234-5678", time: "Yesterday", type: "outgoing" as const, duration: "2:18" },
    { id: 3, name: "Michael Brown", number: "+1 (555) 345-6789", time: "Yesterday", type: "missed" as const },
    { id: 4, name: "Jessica Davis", number: "+1 (555) 456-7890", time: "03/21/2025", type: "incoming" as const, duration: "8:32" },
    { id: 5, name: "David Wilson", number: "+1 (555) 567-8901", time: "03/20/2025", type: "outgoing" as const, duration: "1:45" },
    { id: 6, name: "Sarah Miller", number: "+1 (555) 678-9012", time: "03/19/2025", type: "missed" as const },
    { id: 7, name: "Robert Taylor", number: "+1 (555) 789-0123", time: "03/18/2025", type: "incoming" as const, duration: "4:12" },
    { id: 8, name: "Jennifer Anderson", number: "+1 (555) 890-1234", time: "03/17/2025", type: "outgoing" as const, duration: "6:07" }
  ];

  const filteredCalls = calls.filter(call => {
    if (selectedTab === "all") return true;
    return call.type === selectedTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Call History</h2>
        <Button>
          <Phone className="mr-2" size={18} />
          New Call
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Recent Calls</CardTitle>
              <div className="relative w-48">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search calls..." className="pl-8" />
              </div>
            </div>
            <CardDescription>View and manage your call history</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all" onValueChange={setSelectedTab}>
              <div className="px-6">
                <TabsList className="grid grid-cols-3 mb-2">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="incoming">Incoming</TabsTrigger>
                  <TabsTrigger value="missed">Missed</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="m-0">
                <ScrollArea className="h-[400px]">
                  {filteredCalls.map(call => (
                    <CallItem 
                      key={call.id}
                      name={call.name}
                      number={call.number}
                      time={call.time}
                      type={call.type}
                      duration={call.duration}
                    />
                  ))}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="incoming" className="m-0">
                <ScrollArea className="h-[400px]">
                  {filteredCalls.map(call => (
                    <CallItem 
                      key={call.id}
                      name={call.name}
                      number={call.number}
                      time={call.time}
                      type={call.type}
                      duration={call.duration}
                    />
                  ))}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="missed" className="m-0">
                <ScrollArea className="h-[400px]">
                  {filteredCalls.map(call => (
                    <CallItem 
                      key={call.id}
                      name={call.name}
                      number={call.number}
                      time={call.time}
                      type={call.type}
                      duration={call.duration}
                    />
                  ))}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Call Statistics</CardTitle>
            <CardDescription>Your call activity this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
                    <Phone size={16} />
                  </div>
                  <span>Total Calls</span>
                </div>
                <span className="font-bold">48</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-500 flex items-center justify-center">
                    <PhoneCall size={16} />
                  </div>
                  <span>Incoming Calls</span>
                </div>
                <span className="font-bold">25</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center">
                    <PhoneMissed size={16} />
                  </div>
                  <span>Missed Calls</span>
                </div>
                <span className="font-bold">12</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Upcoming Scheduled Calls</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-muted rounded-md">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Client Follow-up</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock size={12} />
                      <span>3:30 PM</span>
                      <Calendar size={12} />
                      <span>Today</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-muted rounded-md">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Team Meeting</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock size={12} />
                      <span>10:00 AM</span>
                      <Calendar size={12} />
                      <span>Tomorrow</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calls;
