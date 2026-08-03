// @/components/settings/tabs/MyAccountTab.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Check, X, Loader2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  changePasswordAction,
  getProfileAction,
  updateProfileAction,
  verifyProfileAction,
} from "../action";
import { avatarUrl } from "@/lib/image";

interface AccountField {
  key: string;
  label: string;
  value: string;
  isNotSet?: boolean;
  type: "text" | "email" | "tel" | "password";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MyAccountTab({ t }: { t: any }) {
  // State to handle which field is actively being edited
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // State for Account Delete Action
  // const [isDeleting, setIsDeleting] = useState<boolean>(false);
  // const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  // State for Password Change
  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState<boolean>(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  // State for Verify Profile
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
  const [verifyForm, setVerifyForm] = useState({
    type: "",
    image: null as File | null,
    imagePreview: "",
    ownPicture: null as File | null,
    ownPicturePreview: "",
  });
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isAdminVerified, setIsAdminVerified] = useState<boolean>(false);
  const [verifiedStatus, setVerifiedStatus] = useState<string>("");

  const [userData, setUserData] = useState<
    Record<string, { value: string; isNotSet?: boolean }>
  >({
    name: { value: "", isNotSet: true },
    email: { value: "", isNotSet: true },
    phone: { value: t.account?.notSet, isNotSet: true },
    password: { value: "••••••••••••••••" },
    image: { value: "", isNotSet: true },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileAction();
        if (res.success && res.data) {
          setIsAdminVerified(res.data.isAdminVerified || false);
          setVerifiedStatus(res.data.verifiedStatus || "");
          setUserData((prev) => ({
            ...prev,
            name: {
              value: res.data.name || res.data.displayName || prev.name.value,
              isNotSet: !res.data.name && !res.data.displayName,
            },
            email: {
              value: res.data.email || prev.email.value,
              isNotSet: !res.data.email,
            },
            phone: {
              value: res.data.phone || t.account?.notSet,
              isNotSet: !res.data.phone,
            },
            image: {
              value:
                res.data.profile ||
                res.data.image ||
                res.data.profileImage ||
                res.data.avatarSeed ||
                "default",
              isNotSet: false,
            },
          }));
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    fetchProfile();
  }, [t.account?.notSet]);

  const fields: AccountField[] = [
    {
      key: "name",
      label: t.account.name,
      value: userData.name.value,
      type: "text",
    },
    {
      key: "email",
      label: t.account.email,
      value: userData.email.value,
      type: "email",
    },
    {
      key: "phone",
      label: t.account.phone,
      value: userData.phone.value,
      isNotSet: userData.phone.isNotSet,
      type: "tel",
    },
    {
      key: "password",
      label: t.account.password,
      value: userData.password.value,
      type: "password",
    },
  ];

  const startEditing = (
    key: string,
    currentVal: string,
    isNotSet?: boolean,
  ) => {
    if (key === "password") {
      setIsPasswordModalOpen(true);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      return;
    }
    setEditingKey(key);
    setTempValue(isNotSet ? "" : currentVal);
  };

  // Persists changes using the actual API
  const handleSaveField = async (key: string) => {
    if (!tempValue.trim()) return;
    setIsUpdating(true);

    try {
      const formData = new FormData();
      formData.append(key, tempValue);
      const res = await updateProfileAction(formData);

      if (res.success) {
        setUserData((prev) => ({
          ...prev,
          [key]: {
            value: key === "password" ? "••••••••••••••••" : tempValue,
            isNotSet: false,
          },
        }));
        toast.success(res.message || `${key} updated successfully`);
      } else {
        toast.error(res.error || res.message || `Failed to update ${key}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsUpdating(false);
      setEditingKey(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setUserData((prev) => ({
      ...prev,
      image: { value: objectUrl, isNotSet: false },
    }));

    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await updateProfileAction(formData);

      if (res.success) {
        toast.success("Profile photo updated");
        // If API returns the uploaded image URL, we can set it here
        if (res.data?.image) {
          setUserData((prev) => ({
            ...prev,
            image: { value: res.data.image, isNotSet: false },
          }));
        }
      } else {
        toast.error(res.error || res.message || "Failed to upload photo");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || "Error uploading photo");
    }
  };

  // Mock function for permanent account cleanup execution
  // const handleDeleteAccount = async () => {
  //   setIsDeleting(true);
  //   // Simulate API deletion request
  //   await new Promise((resolve) => setTimeout(resolve, 2000));
  //   setIsDeleting(false);
  //   setIsDeleteDialogOpen(false);

  //   // Redirect logic goes here (e.g., router.push("/login"))
  //   toast.success("Account permanently deleted.");
  // };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setIsChangingPassword(true);
    try {
      const res = await changePasswordAction(passwordForm);
      if (res.success) {
        toast.success(res.message || "Password changed successfully");
        setIsPasswordModalOpen(false);
      } else {
        toast.error(res.error || res.message || "Failed to change password");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleVerifyImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVerifyForm((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleOwnPictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVerifyForm((prev) => ({
        ...prev,
        ownPicture: file,
        ownPicturePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyForm.type) {
      toast.error("Document type is required.");
      return;
    }
    if (!verifyForm.image) {
      toast.error("Document image is required.");
      return;
    }
    if (!verifyForm.ownPicture) {
      toast.error("Selfie is required.");
      return;
    }
    setIsVerifying(true);
    try {
      const formData = new FormData();
      formData.append("documentType", verifyForm.type);
      formData.append("documentVerified", verifyForm.image);
      formData.append("verifyOwnPicture", verifyForm.ownPicture);

      const res = await verifyProfileAction(formData);

      if (res.success) {
        toast.success(
          res.message || "Verification documents submitted successfully!",
        );
        setIsVerifyModalOpen(false);
        setVerifyForm({
          type: "",
          image: null,
          imagePreview: "",
          ownPicture: null,
          ownPicturePreview: "",
        });
        setVerifiedStatus("pending");
      } else {
        toast.error(
          res.error ||
            res.message ||
            "Failed to submit verification documents.",
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-neutral-200 overflow-hidden border-4 border-white shadow-sm flex items-center justify-center">
            {userData.image?.value ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl(userData.image.value, 256)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl text-neutral-400 font-bold">
                {userData.name.value.charAt(0).toUpperCase() || "U"}
              </span>
            )}
          </div>
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera className="w-6 h-6" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight mb-1">
            {t.tabs?.myAccount || "My Account"}
          </h2>
          <p className="text-sm text-neutral-500">
            Update your profile details and photo.
          </p>
        </div>
      </div>

      <div className="divide-y divide-neutral-100  border-y border-neutral-100 ">
        {fields.map((field) => {
          const isCurrentFieldEditing = editingKey === field.key;

          return (
            <div
              key={field.key}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4 group transition-colors"
            >
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
                      placeholder={
                        field.isNotSet
                          ? ""
                          : `Enter new ${field.label.toLowerCase()}`
                      }
                      className="h-9 focus-visible:ring-[#429CA8] rounded-lg bg-neutral-50/50  border-neutral-200 "
                      autoFocus
                    />
                    <Button
                      size="icon"
                      onClick={() => handleSaveField(field.key)}
                      disabled={isUpdating}
                      className="cursor-pointer bg-[#429CA8] hover:bg-[#357d87] h-9 w-9 shrink-0 text-white rounded-lg"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setEditingKey(null)}
                      disabled={isUpdating}
                      className="cursor-pointer h-9 w-9 shrink-0 rounded-lg border-neutral-200  text-neutral-500"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <p
                    className={`text-sm font-medium ${field.isNotSet ? "text-neutral-400 italic" : "text-neutral-800 "}`}
                  >
                    {field.value}
                  </p>
                )}
              </div>

              {!isCurrentFieldEditing && (
                <button
                  onClick={() =>
                    startEditing(field.key, field.value, field.isNotSet)
                  }
                  className="cursor-pointer p-2 rounded-lg bg-neutral-50  opacity-60 hover:opacity-100 group-hover:opacity-100 text-neutral-600  transition-all hover:scale-105 self-start sm:self-center"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
        {/* Verify Profile Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4 group transition-colors">
          <div className="space-y-1 flex-1">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
              {t.account?.verifyProfile || "Verify Profile"}
            </span>
            <p
              className={`text-sm font-medium ${
                isAdminVerified || verifiedStatus?.toLowerCase() === "verified"
                  ? "text-green-600"
                  : verifiedStatus?.toLowerCase() === "pending"
                    ? "text-yellow-600"
                    : verifiedStatus?.toLowerCase() === "rejected"
                      ? "text-red-600"
                      : "text-neutral-400 italic"
              }`}
            >
              {isAdminVerified || verifiedStatus?.toLowerCase() === "verified"
                ? "Verified"
                : verifiedStatus?.toLowerCase() === "pending"
                  ? "Pending Approval"
                  : verifiedStatus?.toLowerCase() === "rejected"
                    ? "Verification Rejected"
                    : t.account?.notVerified || "Not Verified"}
            </p>
          </div>
          {isAdminVerified || verifiedStatus?.toLowerCase() === "verified" ? (
            <div className="flex items-center text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 self-start sm:self-center">
              <Check className="w-4 h-4 mr-1.5" />
              <span className="text-sm font-medium">Verified</span>
            </div>
          ) : verifiedStatus?.toLowerCase() === "pending" ? (
            <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100 self-start sm:self-center">
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              <span className="text-sm font-medium">Pending</span>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsVerifyModalOpen(true)}
              className="cursor-pointer rounded-lg border-neutral-200 text-neutral-600 font-medium text-sm self-start sm:self-center"
            >
              {verifiedStatus?.toLowerCase() === "rejected"
                ? "Retry Verification"
                : t.account?.verifyNow || "Verify Now"}
            </Button>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {t.account?.changePasswordTitle || "Change Password"}
            </DialogTitle>
            <DialogDescription>
              {t.account?.changePasswordDesc ||
                "Enter your current password and a new password."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t.account?.currentPassword || "Current Password"}
              </label>
              <Input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t.account?.newPassword || "New Password"}
              </label>
              <Input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t.account?.confirmNewPassword || "Confirm New Password"}
              </label>
              <Input
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordModalOpen(false)}
                disabled={isChangingPassword}
                className="cursor-pointer"
              >
                {t.common?.cancel || "Cancel"}
              </Button>
              <Button
                type="submit"
                disabled={isChangingPassword}
                className="cursor-pointer bg-[#429CA8] hover:bg-[#357d87] text-white"
              >
                {isChangingPassword && (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                )}
                {t.common?.save || "Save Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Verify Profile Modal */}
      <Dialog open={isVerifyModalOpen} onOpenChange={setIsVerifyModalOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Verify Profile</DialogTitle>
            <DialogDescription>
              Please upload a valid document to verify your profile.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleVerifySubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Document Type <span className="text-red-500">*</span>
              </label>
              <Select
                value={verifyForm.type || undefined}
                onValueChange={(value) =>
                  setVerifyForm((prev) => ({ ...prev, type: value }))
                }
                required
              >
                <SelectTrigger aria-required="true" className="cursor-pointer">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="National ID" className="cursor-pointer">
                    National ID
                  </SelectItem>
                  <SelectItem value="Passport" className="cursor-pointer">
                    Passport
                  </SelectItem>
                  <SelectItem
                    value="Driving License"
                    className="cursor-pointer"
                  >
                    Driving License
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Upload Document <span className="text-red-500">*</span>
              </label>
              <label
                htmlFor="dropzone-file"
                className="relative flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 transition-colors hover:bg-neutral-100"
              >
                {verifyForm.imagePreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={verifyForm.imagePreview}
                      alt="Document preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity hover:opacity-100">
                      <span className="text-sm font-semibold text-white">
                        Change image
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 px-4 text-center">
                    <Camera className="size-8 text-neutral-400" />
                    <p className="text-sm font-semibold text-neutral-500">
                      Click to upload
                    </p>
                  </div>
                )}
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  required
                  onChange={handleVerifyImageChange}
                />
              </label>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Upload Selfie <span className="text-red-500">*</span>
              </label>
              <label
                htmlFor="own-picture-file"
                className="relative flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 transition-colors hover:bg-neutral-100"
              >
                {verifyForm.ownPicturePreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={verifyForm.ownPicturePreview}
                      alt="Selfie preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity hover:opacity-100">
                      <span className="text-sm font-semibold text-white">
                        Change image
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 px-4 text-center">
                    <Camera className="size-8 text-neutral-400" />
                    <p className="text-sm font-semibold text-neutral-500">
                      Click to upload selfie
                    </p>
                  </div>
                )}
                <input
                  id="own-picture-file"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  required
                  onChange={handleOwnPictureChange}
                />
              </label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsVerifyModalOpen(false)}
                disabled={isVerifying}
                className="cursor-pointer"
              >
                {t.common?.cancel || "Cancel"}
              </Button>
              <Button
                type="submit"
                disabled={
                  isVerifying ||
                  !verifyForm.type ||
                  !verifyForm.image ||
                  !verifyForm.ownPicture
                }
                className="cursor-pointer bg-[#429CA8] hover:bg-[#357d87] text-white"
              >
                {isVerifying && (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                )}
                {t.common?.save || "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Premium Styled Danger Zone */}
      {/* <div className="pt-4">
        <div className="p-4 rounded-xl border border-red-100  bg-red-50/30  flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-red-600 ">
              {t.account.dangerZone}
            </h4>
            <p className="text-xs text-neutral-500 ">
              {t.account.deactivateDesc}
            </p>
          </div>

          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
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
                  {t.account.deleteConfirmDesc ||
                    "This action cannot be undone. This will permanently delete your dating profile, preferences, photos, matches, and chat message history."}
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
      </div> */}
    </div>
  );
}
