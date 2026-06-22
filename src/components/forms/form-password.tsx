"use client";

import { useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormPasswordProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    placeholder?: string;
    control: Control<T>;
}

export function FormPassword<T extends FieldValues>({ name, label, placeholder, control }: FormPasswordProps<T>) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold tracking-wide text-neutral-700 uppercase">{label}</FormLabel>
                    <div className="relative">
                        <FormControl>
                            <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder={placeholder}
                                className="h-11 rounded-xl border-neutral-200 pr-10 focus-visible:ring-2 focus-visible:ring-[#429CA8]/20 focus-visible:border-[#429CA8] transition-all"
                            />
                        </FormControl>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                        >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                    <FormMessage className="text-rose-500 text-xs font-medium" />
                </FormItem>
            )}
        />
    );
}