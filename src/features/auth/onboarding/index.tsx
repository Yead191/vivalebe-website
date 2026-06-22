"use client";

import { useEffect, useMemo, useState } from "react";
import type { ButtonHTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronLeft,
  Heart,
  NotebookText,
  Ruler,
  ShieldCheck,
  Sparkles,
  UserRound,
  Weight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LangSwitcher } from "@/components/shared/LangSwitcher";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createOnboardingSchema } from "@/schemas/auth/onboarding.schema";

const STORAGE_KEY = "vivaleve:onboarding:v1";
const steps = ["preferences", "location", "personal", "display", "physical", "professional", "about"] as const;
type StepKey = (typeof steps)[number];

type OnboardingValues = {
  interestedIn: string;
  lookingFor: string;
  country: string;
  state: string;
  zipCode: string;
  nationality: string;
  dateOfBirth: string;
  livingWith: string;
  displayName: string;
  heightValue: string;
  heightUnit: string;
  weightValue: string;
  weightUnit: string;
  occupation: string;
  educationLevel: string;
  relationshipStatus: string;
  aboutYou: string;
};

const initialValues: OnboardingValues = {
  interestedIn: "woman",
  lookingFor: "man",
  country: "",
  state: "",
  zipCode: "",
  nationality: "",
  dateOfBirth: "",
  livingWith: "other",
  displayName: "",
  heightValue: "",
  heightUnit: "cm",
  weightValue: "",
  weightUnit: "kg",
  occupation: "",
  educationLevel: "college",
  relationshipStatus: "single",
  aboutYou: "",
};

interface Props {
  dict: any;
  lang: string;
}

export default function OnboardingFeature({ dict, lang }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<StepKey>("preferences");
  const [success, setSuccess] = useState(false);
  const schema = useMemo(() => createOnboardingSchema((key) => dict.validation?.[key] || key), [dict]);

  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      form.reset({ ...initialValues, ...JSON.parse(raw) });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [form]);

  useEffect(() => {
    const sub = form.watch((value) => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
    return () => sub.unsubscribe();
  }, [form]);

  const values = form.watch();
  const completion = Math.round((Object.values(values).filter(Boolean).length / Object.keys(initialValues).length) * 100);
  const isLast = step === "about";
  const currentIndex = steps.indexOf(step);

  const goNext = async () => {
    const fieldsByStep: Record<StepKey, string[]> = {
      preferences: ["interestedIn", "lookingFor"],
      location: ["country", "state", "zipCode", "nationality"],
      personal: ["dateOfBirth", "livingWith"],
      display: ["displayName"],
      physical: ["heightValue", "heightUnit", "weightValue", "weightUnit"],
      professional: ["occupation", "educationLevel"],
      about: ["relationshipStatus", "aboutYou"],
    };

    const ok = await form.trigger(fieldsByStep[step] as any);
    if (!ok) return;

    if (!isLast) {
      setStep(steps[currentIndex + 1]);
      return;
    }

    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => router.push(`/${lang}/myHome`), 1800);
    }, 600);
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(66,156,168,0.15),transparent_50%),linear-gradient(180deg,#ffffff,#f6fafb)] p-6">
        <Card className="w-full max-w-xl border-white/60 bg-white/90 p-10 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[#429CA8]/10 text-[#429CA8]">
            <CheckCircle2 className="size-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">{dict.onboarding?.successTitle}</h1>
          <p className="mt-2 text-sm text-neutral-600">{dict.onboarding?.successDescription}</p>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-neutral-400">{dict.onboarding?.redirecting}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(66,156,168,0.18),transparent_35%),linear-gradient(180deg,#fff,#f6fafb)]">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-4 lg:grid-cols-[0.95fr_1.05fr] lg:px-6 lg:py-6">
        <aside className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[#08363b] p-6 text-white shadow-[0_20px_80px_rgba(8,54,59,0.22)] lg:flex lg:flex-col lg:justify-between lg:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(66,156,168,0.4),transparent_35%)]" />
          <div className="relative space-y-6">
            <div className="flex justify-end lg:justify-start">
              <LangSwitcher />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-medium text-white/80">
              <Sparkles className="size-3.5 text-[#8ee0e6]" />
              Vivaleve onboarding
            </div>
            <div className="space-y-3">
              <h1 className="max-w-md text-4xl font-semibold tracking-tight">{dict.onboarding?.brandHeadline}</h1>
              <p className="max-w-sm text-sm leading-6 text-white/72">{dict.onboarding?.brandCopy}</p>
            </div>
            <Card className="border-white/10 bg-white/8 p-4 text-white shadow-none backdrop-blur">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-white/55">
                <span>{dict.onboarding?.progressLabel}</span>
                <span>{completion}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-[#429CA8] transition-all duration-500" style={{ width: `${completion}%` }} />
              </div>
              <p className="mt-3 text-sm text-white/80">{dict.onboarding?.encouragement}</p>
            </Card>
          </div>
          <div className="relative mt-8 hidden rounded-[1.75rem] border border-white/10 bg-white/8 p-4 lg:block">
            <div className="aspect-4/3 rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.03))] p-5">
              <div className="flex h-full items-end justify-between">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">{dict.onboarding?.premiumBadge}</p>
                  <p className="text-2xl font-semibold">{dict.onboarding?.illustrationTitle}</p>
                  <p className="max-w-xs text-sm text-white/70">{dict.onboarding?.illustrationCopy}</p>
                </div>
                <div className="flex size-20 items-center justify-center rounded-3xl bg-white/12">
                  <Heart className="size-9 text-[#8ee0e6]" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="relative flex flex-col">
          <div className="mb-4 flex justify-end lg:hidden">
            <LangSwitcher />
          </div>
          <div className="sticky top-0 z-20 mb-4 rounded-[1.5rem] border border-white/70 bg-white/90 px-4 py-3 shadow-sm backdrop-blur lg:hidden">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
              <span>{dict.onboarding?.progressLabel}</span>
              <span>{completion}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full rounded-full bg-[#429CA8] transition-all duration-500" style={{ width: `${completion}%` }} />
            </div>
          </div>

          <Card className="flex-1 border-white/70 bg-white/90 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:p-8">
            <Form {...form}>
              <form className="flex h-full flex-col gap-6">
                <header className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#429CA8]">
                    {dict.onboarding?.stepLabel} {currentIndex + 1}/{steps.length}
                  </p>
                  <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">{dict.onboarding?.[`${step}Title`]}</h2>
                  <p className="max-w-2xl text-sm leading-6 text-neutral-600">{dict.onboarding?.[`${step}Description`]}</p>
                </header>

                <div className="space-y-5">
                  {step === "preferences" && <PreferencesStep dict={dict} form={form} />}
                  {step === "location" && <LocationStep form={form} />}
                  {step === "personal" && <PersonalStep dict={dict} form={form} />}
                  {step === "display" && <DisplayNameStep dict={dict} form={form} />}
                  {step === "physical" && <PhysicalStep form={form} />}
                  {step === "professional" && <ProfessionalStep form={form} />}
                  {step === "about" && <AboutStep form={form} />}
                </div>

                <div className="mt-auto flex flex-col gap-3 border-t border-neutral-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(steps[Math.max(0, currentIndex - 1)])}
                    disabled={currentIndex === 0}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition",
                      currentIndex === 0 ? "invisible" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    )}
                  >
                    <ChevronLeft className="size-4" />
                    {dict.common?.back || "Back"}
                  </button>
                  <Button type="button" onClick={goNext} className="h-12 rounded-full bg-[#429CA8] px-6 text-white hover:bg-[#2f7e88]">
                    {isLast ? dict.onboarding?.finishButton : dict.onboarding?.nextButton}
                    {!isLast && <ArrowRight className="size-4" />}
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        </section>
      </div>
    </div>
  );
}

function PreferenceCard({ active, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "group flex min-h-20 flex-col justify-between rounded-2xl border p-4 text-left transition-all",
        active ? "border-[#429CA8] bg-[#429CA8]/8 shadow-[0_0_0_1px_rgba(66,156,168,0.2)]" : "border-neutral-200 bg-white hover:border-[#429CA8]/35 hover:bg-[#429CA8]/5"
      )}
    >
      {children}
    </button>
  );
}

function PreferencesStep({ dict, form }: any) {
  const options = ["man", "woman", "couple"];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => (
        <PreferenceCard key={option} active={form.watch("interestedIn") === option} onClick={() => form.setValue("interestedIn", option, { shouldValidate: true })}>
          <span className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
            <Heart className="size-4 text-[#429CA8]" />
            {dict.onboarding?.[option]}
          </span>
          <span className="text-xs text-neutral-500">{dict.onboarding?.[`${option}Hint`]}</span>
        </PreferenceCard>
      ))}
      {options.map((option) => (
        <PreferenceCard key={`looking-${option}`} active={form.watch("lookingFor") === option} onClick={() => form.setValue("lookingFor", option, { shouldValidate: true })}>
          <span className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
            <UserRound className="size-4 text-[#429CA8]" />
            {dict.onboarding?.lookingFor} {dict.onboarding?.[option]}
          </span>
          <span className="text-xs text-neutral-500">{dict.onboarding?.lookingHint}</span>
        </PreferenceCard>
      ))}
    </div>
  );
}

function LocationStep({ form }: any) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {["country", "state", "zipCode", "nationality"].map((name) => (
        <FormField key={name} control={form.control} name={name} render={({ field }: any) => (
          <FormItem className="space-y-2">
            <label className="text-sm font-medium capitalize text-neutral-700">{name === "zipCode" ? "ZIP Code" : name}</label>
            <FormControl><Input {...field} className="h-11 rounded-2xl border-neutral-200 bg-white" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      ))}
    </div>
  );
}

function PersonalStep({ dict, form }: any) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField control={form.control} name="dateOfBirth" render={({ field }: any) => (
        <FormItem>
          <label className="text-sm font-medium text-neutral-700">{dict.onboarding?.dateOfBirth}</label>
          <FormControl><Input {...field} type="date" className="h-11 rounded-2xl border-neutral-200" /></FormControl>
          <p className="text-xs text-neutral-500">{dict.onboarding?.adultNotice}</p>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="livingWith" render={({ field }: any) => (
        <FormItem>
          <label className="text-sm font-medium text-neutral-700">{dict.onboarding?.livingWith}</label>
          <select {...field} className="h-11 w-full rounded-2xl border border-neutral-200 bg-white px-3 text-sm">
            <option value="hsv1">HSV-1</option>
            <option value="hsv2">HSV-2</option>
            <option value="hpv">HPV</option>
            <option value="hiv">HIV</option>
            <option value="other">Other</option>
          </select>
          <p className="text-xs text-neutral-500">{dict.onboarding?.privacyNote}</p>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  );
}

function DisplayNameStep({ dict, form }: any) {
  return (
    <FormField control={form.control} name="displayName" render={({ field }: any) => (
      <FormItem>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <ShieldCheck className="mb-2 size-4" />
          <p>{dict.onboarding?.displayNameNotice}</p>
        </div>
        <FormControl>
          <Input {...field} className="mt-4 h-12 rounded-2xl border-neutral-200" placeholder={dict.onboarding?.displayNamePlaceholder} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  );
}

function PhysicalStep({ form }: any) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField control={form.control} name="heightValue" render={({ field }: any) => (
        <FormItem>
          <label className="text-sm font-medium text-neutral-700"><Ruler className="mr-1 inline size-4" /> Height</label>
          <FormControl><Input {...field} className="h-11 rounded-2xl border-neutral-200" /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="heightUnit" render={({ field }: any) => (
        <FormItem>
          <label className="text-sm font-medium text-neutral-700">Unit</label>
          <select {...field} className="h-11 w-full rounded-2xl border border-neutral-200 bg-white px-3 text-sm">
            <option value="cm">cm</option>
            <option value="ft">ft</option>
          </select>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="weightValue" render={({ field }: any) => (
        <FormItem>
          <label className="text-sm font-medium text-neutral-700"><Weight className="mr-1 inline size-4" /> Weight</label>
          <FormControl><Input {...field} className="h-11 rounded-2xl border-neutral-200" /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="weightUnit" render={({ field }: any) => (
        <FormItem>
          <label className="text-sm font-medium text-neutral-700">Unit</label>
          <select {...field} className="h-11 w-full rounded-2xl border border-neutral-200 bg-white px-3 text-sm">
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  );
}

function ProfessionalStep({ form }: any) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField control={form.control} name="occupation" render={({ field }: any) => (
        <FormItem>
          <label className="text-sm font-medium text-neutral-700"><BriefcaseBusiness className="mr-1 inline size-4" /> Occupation</label>
          <FormControl><Input {...field} className="h-11 rounded-2xl border-neutral-200" /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="educationLevel" render={({ field }: any) => (
        <FormItem>
          <label className="text-sm font-medium text-neutral-700">Education</label>
          <select {...field} className="h-11 w-full rounded-2xl border border-neutral-200 bg-white px-3 text-sm">
            <option value="highSchool">High School</option>
            <option value="college">College</option>
            <option value="graduate">Graduate</option>
            <option value="masters">Masters</option>
            <option value="doctorate">Doctorate</option>
          </select>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  );
}

function AboutStep({ form }: any) {
  const value = form.watch("aboutYou") || "";
  return (
    <div className="space-y-4">
      <FormField control={form.control} name="relationshipStatus" render={({ field }: any) => (
        <FormItem>
          <label className="text-sm font-medium text-neutral-700">Relationship status</label>
          <select {...field} className="h-11 w-full rounded-2xl border border-neutral-200 bg-white px-3 text-sm">
            <option value="single">Single</option>
            <option value="divorced">Divorced</option>
            <option value="married">Married</option>
            <option value="widowed">Widowed</option>
          </select>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="aboutYou" render={({ field }: any) => (
        <FormItem>
          <label className="text-sm font-medium text-neutral-700"><NotebookText className="mr-1 inline size-4" /> About you</label>
          <FormControl>
            <Textarea {...field} rows={7} className="rounded-[1.25rem] border-neutral-200 bg-white p-4" placeholder="What makes you unique? What are you passionate about?" />
          </FormControl>
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Suggested prompts: What makes you unique? What are you passionate about? What are you looking for?</span>
            <span>{value.length}/320</span>
          </div>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  );
}
