"use client";

import { useState, useTransition } from "react";
import { Check, Copy, Trash2 } from "lucide-react";

import { deleteLinkAction } from "@/app/links/actions";
import { Button } from "@/components/ui/button";

export function LinkRowActions({ id, slug }: { id: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleCopy() {
    await navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDelete() {
    startTransition(() => deleteLinkAction(id));
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button variant="ghost" size="icon-sm" onClick={handleCopy} aria-label="Copy short link">
        {copied ? <Check className="text-green-600" /> : <Copy />}
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleDelete}
        disabled={isPending}
        aria-label="Delete link"
      >
        <Trash2 />
      </Button>
    </div>
  );
}
