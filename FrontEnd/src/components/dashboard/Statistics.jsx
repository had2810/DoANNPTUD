import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Users, Clock, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "@/services/appontmentService";
import React from "react";

// ...rest of code from employee-ui Statistics.tsx

export default Statistics;
