// @/components/settings/tabs/MyAccountTab.tsx
"use client";

import React, { useState } from "react";
import { Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface AccountField {
    key: string;
    label: string;
    value: string;
    isNotSet?: boolean;
    type: "text" | "email" | "tel" | "password";
}

export default function MyAccountTab({ t }: { t: any }) {
    // State to handle which field is actively being edited
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState<string>("");
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    // State for Account Delete Action
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

    // Dynamic user data values (Connect these to your database or React Query/Context mutations)
    const [userData, setUserData] = useState<Record<string, { value: string; isNotSet?: boolean }>>({
        name: { value: "Micheal" },
        email: { value: "example.email@gmail.com" },
        phone: { value: t.account.notSet, isNotSet: true },
        password: { value: "••••••••••••••••" },
    });

    const fields: AccountField[] = [
        { key: "name", label: t.account.name, value: userData.name.value, type: "text" },
        { key: "email", label: t.account.email, value: userData.email.value, type: "email" },
        { key: "phone", label: t.account.phone, value: userData.phone.value, isNotSet: userData.phone.isNotSet, type: "tel" },
        { key: "password", label: t.account.password, value: userData.password.value, type: "password" },
    ];

    // Starts field editing state
    const startEditing = (key: string, currentVal: string, isNotSet?: boolean) => {
        setEditingKey(key);
        setTempValue(isNotSet ? "" : key === "password" ? "" : currentVal);
    };

    // Persists changes mock-style with local states
    const handleSaveField = async (key: string) => {
        if (!tempValue.trim()) return;
        setIsUpdating(true);

        // Simulate database update API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setUserData((prev) => ({
            ...prev,
            [key]: {
                value: key === "password" ? "••••••••••••••••" : tempValue,
                isNotSet: false,
            },
        }));

        setIsUpdating(false);
        setEditingKey(null);
    };

    // Mock function for permanent account cleanup execution
    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        // Simulate API deletion request 
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);

        // Redirect logic goes here (e.g., router.push("/login"))
        toast.success("Account permanently deleted.");
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-xl font-bold tracking-tight mb-1">{t.tabs.myAccount}</h2>
            </div>

            <div className="divide-y divide-neutral-100  border-y border-neutral-100 ">
                {fields.map((field) => {
                    const isCurrentFieldEditing = editingKey === field.key;

                    return (
                        <div key={field.key} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4 group transition-colors">
                            <div className="space-y-1 flex-1">
                                <span className="text-xs font-semibold text-neutral-400  uppercase tracking-wide">
                                    {field.label}
                                </span>

                                {isCurrentFieldEditing ? (
                                    <div className="flex items-center gap-2 max-w-md mt-1 animate-fade-in">
                                        <Input
                                            type={field.type}
                                            value={tempValue}
                                            onChange={(e) => setTempValue(e.target.value)}
                                            disabled={isUpdating}
                                            placeholder={field.isNotSet ? "" : `Enter new ${field.label.toLowerCase()}`}
                                            className="h-9 focus-visible:ring-[#429CA8] rounded-lg bg-neutral-50/50  border-neutral-200 "
                                            autoFocus
                                        />
                                        <Button
                                            size="icon"
                                            onClick={() => handleSaveField(field.key)}
                                            disabled={isUpdating}
                                            className="bg-[#429CA8] hover:bg-[#357d87] h-9 w-9 shrink-0 text-white rounded-lg"
                                        >
                                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => setEditingKey(null)}
                                            disabled={isUpdating}
                                            className="h-9 w-9 shrink-0 rounded-lg border-neutral-200  text-neutral-500"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <p className={`text-sm font-medium ${field.isNotSet ? "text-neutral-400 italic" : "text-neutral-800 "}`}>
                                        {field.value}
                                    </p>
                                )}
                            </div>

                            {!isCurrentFieldEditing && (
                                <button
                                    onClick={() => startEditing(field.key, field.value, field.isNotSet)}
                                    className="p-2 rounded-lg bg-neutral-50  opacity-60 hover:opacity-100 group-hover:opacity-100 text-neutral-600  transition-all hover:scale-105 self-start sm:self-center"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Premium Styled Danger Zone */}
            <div className="pt-4">
                <div className="p-4 rounded-xl border border-red-100  bg-red-50/30  flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-red-600 ">{t.account.dangerZone}</h4>
                        <p className="text-xs text-neutral-500 ">{t.account.deactivateDesc}</p>
                    </div>

                    {/* Dialog Action Modal Trigger */}
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-xs font-semibold rounded-lg tracking-tight shadow-sm flex items-center gap-2 self-start sm:self-center transition-transform hover:scale-[1.02]"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                {t.account.deactivateBtn}
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-106.25 rounded-2xl p-6 border border-neutral-100  bg-white  shadow-xl">
                            <DialogHeader className="space-y-2">
                                <DialogTitle className="text-lg font-bold text-neutral-900 ">
                                    {t.account.deleteConfirmTitle || "Are you absolutely sure?"}
                                </DialogTitle>
                                <DialogDescription className="text-sm text-neutral-500  leading-relaxed">
                                    {t.account.deleteConfirmDesc || "This action cannot be undone. This will permanently delete your dating profile, preferences, photos, matches, and chat message history."}
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDeleteDialogOpen(false)}
                                    disabled={isDeleting}
                                    className="rounded-xl border-neutral-200   text-neutral-600  font-medium text-sm order-2 sm:order-1"
                                >
                                    {t.common?.cancel || "Cancel"}
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleting}
                                    className="bg-red-600! hover:bg-red-700! text-white rounded-xl font-semibold text-sm order-1 sm:order-2 flex items-center gap-2 shadow-sm"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            {t.account.deletingStatus || "Deleting..."}
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            {t.account.deleteConfirmBtn || "Delete My Account"}
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}