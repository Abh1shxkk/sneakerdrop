"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const MESSAGES: Record<string, string> = {
  created: "Sneaker added. It's live on the site.",
  updated: "Changes saved and published.",
};

/** Shows a toast after a redirect from the product form, then cleans the URL. */
export function SavedNotice({ saved }: { saved?: string }) {
  const router = useRouter();
  useEffect(() => {
    if (saved && MESSAGES[saved]) {
      toast.success(MESSAGES[saved]);
      router.replace("/admin", { scroll: false });
    }
  }, [saved, router]);
  return null;
}
