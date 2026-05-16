"use client";

import { useState } from "react";
import { X, Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ReportContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const REPORT_REASONS = [
  "Using an AI-generated photo or video",
  "Contains contact information",
  "Inappropriate or obscene content",
  "Photo impersonating another individual",
  "Photo of a child",
  "Other",
];

export function ReportContentModal({ open, onOpenChange }: ReportContentModalProps) {
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0  rounded-none sm:rounded-none border-none max-h-[calc(100vh-10rem)] overflow-auto scrollbar-hide">
        <div className="bg-white p-6 sm:p-10 relative">
          <DialogHeader className="mb-8 items-center">
            <DialogTitle className="text-xl font-bold tracking-tight">
              REPORT THIS PHOTO OR VIDEO
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-base font-bold">Reasons for reporting*</h3>
              <RadioGroup value={reason} onValueChange={setReason} className="space-y-4">
                {REPORT_REASONS.map((r) => (
                  <div key={r} className="flex items-center space-x-3">
                    <RadioGroupItem value={r} id={r} className="size-5" />
                    <Label htmlFor={r} className="text-base font-normal cursor-pointer leading-tight">
                      {r}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold">More details (optional)</h3>
              <div className="relative">
                <Textarea
                  placeholder="Your report is confidential. Please provide more details to help our review."
                  className="min-h-[140px] resize-none border-gray-300 bg-white p-4 text-base focus:border-brand focus:ring-1 focus:ring-brand"
                  maxLength={5000}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
                <div className="mt-1 text-right text-sm text-muted-foreground">
                  {details.length}/5,000
                </div>
              </div>
            </div>

            <div className="space-y-3 pb-4">
              <h3 className="text-base font-bold">Upload evidence (optional)</h3>
              <p className="text-sm text-muted-foreground">
                (Upload up to 4 photos or screenshots to help us better understand the issue.)
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  className="flex size-24 flex-col items-center justify-center gap-2 border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <Camera className="size-6 text-muted-foreground" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    ADD
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
