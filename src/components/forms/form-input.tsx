import { Control, FieldValues, Path } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormInputProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: string;
    control: Control<T>;
}

export function FormInput<T extends FieldValues>({ name, label, placeholder, type = "text", control }: FormInputProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold tracking-wide text-neutral-700 uppercase">{label}</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            type={type}
                            placeholder={placeholder}
                            className="h-11 rounded-xl border-neutral-200 focus-visible:ring-2 focus-visible:ring-[#429CA8]/20 focus-visible:border-[#429CA8] transition-all"
                        />
                    </FormControl>
                    <FormMessage className="text-rose-500 text-xs font-medium" />
                </FormItem>
            )}
        />
    );
}