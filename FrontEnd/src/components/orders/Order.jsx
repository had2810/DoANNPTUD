import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Appointment, getAppointments } from "@/services/appontmentService";
import { getAccessToken } from "@/lib/authStorage";
import useSearchPagination from "@/hooks/useSearchPagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

// ...rest of code from employee-ui Order.tsx

export default Orders;
