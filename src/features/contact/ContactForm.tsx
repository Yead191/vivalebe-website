"use client";

import { useState } from "react";
import { Loader2, Mail, Phone, User, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitContactAction } from "./action";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ContactForm({ dict }: { dict?: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await submitContactAction(formData);

      if (res.success) {
        toast.success(dict?.contact?.success || "Message sent successfully! We will get back to you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(res.error || res.message || dict?.contact?.error || "Failed to send message.");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || dict?.contact?.error || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
          {dict?.contact?.title || "Get in Touch"}
        </h2>
        <p className="text-neutral-500">
          {dict?.contact?.subtitle || "We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-neutral-700">
              {dict?.contact?.name || "Full Name"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-neutral-400" />
              </div>
              <Input
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="pl-10 h-12 bg-neutral-50/50 border-neutral-200 focus-visible:ring-[#429CA8] rounded-xl transition-all"
              />
            </div>
          </div>
          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-neutral-700">
              {dict?.contact?.email || "Email Address"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-neutral-400" />
              </div>
              <Input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="pl-10 h-12 bg-neutral-50/50 border-neutral-200 focus-visible:ring-[#429CA8] rounded-xl transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-neutral-700">
              {dict?.contact?.phone || "Phone Number"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-neutral-400" />
              </div>
              <Input
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 234 567 890"
                className="pl-10 h-12 bg-neutral-50/50 border-neutral-200 focus-visible:ring-[#429CA8] rounded-xl transition-all"
              />
            </div>
          </div>
          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-neutral-700">
              {dict?.contact?.subject || "Subject"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MessageSquare className="h-5 w-5 text-neutral-400" />
              </div>
              <Input
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                className="pl-10 h-12 bg-neutral-50/50 border-neutral-200 focus-visible:ring-[#429CA8] rounded-xl transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">
            {dict?.contact?.message || "Message"}
          </label>
          <Textarea
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            className="min-h-[150px] resize-y bg-neutral-50/50 border-neutral-200 focus-visible:ring-[#429CA8] rounded-xl transition-all p-4"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 mt-4 bg-[#429CA8] hover:bg-[#357d87] text-white rounded-xl text-base font-semibold shadow-md shadow-[#429CA8]/20 transition-all hover:shadow-lg hover:shadow-[#429CA8]/30 group"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          )}
          {dict?.contact?.submit || "Send Message"}
        </Button>
      </form>
    </div>
  );
}
