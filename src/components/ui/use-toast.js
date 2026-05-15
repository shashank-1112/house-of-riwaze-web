import { toast as sonnerToast } from "sonner";

export function toast({ title, description, variant }) {
  if (variant === "destructive") {
    return sonnerToast.error(title || "Error", {
      description,
    });
  }

  return sonnerToast.success(title || "Success", {
    description,
  });
}

export function useToast() {
  return {
    toast,
  };
}