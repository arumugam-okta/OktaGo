"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Trash2 } from "lucide-react";

import { deleteLinkAction } from "@/app/links/actions";
import { Button } from "@/components/ui/button";

export function LinkRowActions({ id, slug }: { id: string; slug: string }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleCopy() {
    await navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteLinkAction(id);
      router.refresh();
    });
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleCopy} className="rounded-full">
        {copied ? <Check className="text-primary" /> : <Copy />}
        {copied ? "Copied" : "Copy link"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
        className="rounded-full"
      >
        <Trash2 />
        Delete
      </Button>
    </div>
  );
}
