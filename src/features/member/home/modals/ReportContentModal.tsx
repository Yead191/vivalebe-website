"use client";

import { useState, useRef } from "react";
import { X, Camera, Trash2 } from "lucide-react";
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
import { toast } from "sonner";
import { reportPost } from "../action";

interface ReportContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  reasonsTitle?: string;
  detailsTitle?: string;
  detailsPlaceholder?: string;
  evidenceTitle?: string;
  evidenceNote?: string;
  addLabel?: string;
  postId?: string;
}

const REPORT_REASONS = [
  {
    label: "Using an AI-generated photo or video",
    value: "usingAiGeneratedContent",
  },
  {
    label: "Contains contact information",
    value: "containsContactInformation",
  },
  {
    label: "Inappropriate or obscene content",
    value: "inappropriateOrObsceneContent",
  },
  {
    label: "Photo impersonating another individual",
    value: "photoImpersonatingAnotherIndividual",
  },
  { label: "Photo of a child", value: "photoOfAChild" },
  { label: "Other", value: "other" },
];

export function ReportContentModal({
  open,
  onOpenChange,
  title = "REPORT THIS PHOTO OR VIDEO",
  reasonsTitle = "Reasons for reporting*",
  detailsTitle = "More details (optional)",
  detailsPlaceholder = "Your report is confidential. Please provide more details to help our review.",
  evidenceTitle = "Upload evidence (optional)",
  evidenceNote = "(Upload up to 4 photos or screenshots to help us better understand the issue.)",
  addLabel = "ADD",
  postId,
}: ReportContentModalProps) {
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles].slice(0, 4));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId) {
      toast.error("User or Post ID is missing");
      return;
    }
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("postId", postId);
      formData.append("reason", reason);
      if (details) formData.append("description", details);
      files.forEach((file) => {
        formData.append("image", file);
      });

      const res = await reportPost(formData);
      if (res.success) {
        toast.success(res.message || "Report submitted successfully");
        setReason("");
        setDetails("");
        setFiles([]);
        onOpenChange(false);
      } else {
        toast.error(res.message || "Failed to submit report");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 rounded-none sm:rounded-none border-none max-h-[calc(100vh-10rem)] overflow-auto scrollbar-hide">
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 relative">
          <DialogHeader className="mb-8 items-center">
            <DialogTitle className="text-xl font-bold tracking-tight">
              {title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-base font-bold">{reasonsTitle}</h3>
              <RadioGroup
                value={reason}
                onValueChange={setReason}
                className="space-y-4"
              >
                {REPORT_REASONS.map((r) => (
                  <div key={r.value} className="flex items-center space-x-3">
                    <RadioGroupItem
                      value={r.value}
                      id={r.value}
                      className="size-5"
                    />
                    <Label
                      htmlFor={r.value}
                      className="text-base font-normal cursor-pointer leading-tight"
                    >
                      {r.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold">{detailsTitle}</h3>
              <div className="relative">
                <Textarea
                  placeholder={detailsPlaceholder}
                  className="min-h-35 resize-none border-gray-300 bg-white p-4 text-base focus:border-brand focus:ring-1 focus:ring-brand"
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
              <h3 className="text-base font-bold">{evidenceTitle}</h3>
              <p className="text-sm text-muted-foreground">{evidenceNote}</p>
              <div className="mt-4 flex flex-wrap gap-4">
                {files.map((file, i) => (
                  <div
                    key={i}
                    className="relative size-24 border border-border"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Evidence"
                      className="size-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                ))}
                {files.length < 4 && (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex size-24 flex-col items-center justify-center gap-2 border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <Camera className="size-6 text-muted-foreground" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {addLabel}
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                className="w-full text-base font-bold py-6 bg-brand hover:bg-brand-hover text-white"
                disabled={isSubmitting || !reason}
              >
                {isSubmitting ? "SUBMITTING..." : "SUBMIT REPORT"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
