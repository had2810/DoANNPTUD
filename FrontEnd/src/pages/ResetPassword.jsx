import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password reset logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F0FB] px-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
          <p className="text-sm text-gray-500">
            Enter your email and we'll send you a reset link
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
          >
            Send Reset Link
          </Button>
        </form>
        <div className="text-center text-sm">
          Remember your password?{" "}
          <Link to="/login" className="text-[#9b87f5] hover:text-[#7E69AB]">
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;
