import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "@/services/appontmentService";
import React from "react";
import { formatDateTimeFull } from "@/lib/format";
import { toast } from "@/hooks/use-toast";

// ...rest of code from employee-ui Customers.tsx

export default Customers;
