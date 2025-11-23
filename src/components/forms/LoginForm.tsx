'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, KeyRound } from "lucide-react";

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send OTP
    setStep('otp');
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Verify OTP
    onSuccess?.();
  };

  if (step === 'phone') {
    return (
      <form onSubmit={handleSendOTP} className="space-y-4">
        <div>
          <Label htmlFor="phone">شماره تلفن</Label>
          <div className="relative mt-2">
            <Phone className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="09123456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pr-10"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full">
          ارسال کد تایید
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      <div>
        <Label htmlFor="otp">کد تایید</Label>
        <div className="relative mt-2">
          <KeyRound className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            id="otp"
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="pr-10 text-center text-2xl tracking-widest"
            maxLength={6}
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        تایید و ورود
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => setStep('phone')}
      >
        ویرایش شماره
      </Button>
    </form>
  );
}

