"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Zap } from "lucide-react";

import { createLinkAction } from "@/app/links/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function LinkForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCustomCode, setShowCustomCode] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createLinkAction(formData);
      setError(result.error);
      if (!result.error) {
        formRef.current?.reset();
        setShowCustomCode(false);
        router.refresh();
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3">
      <div className="relative">
        <Input
          id="url"
          name="url"
          type="url"
          placeholder="Paste your long link here"
          required
          onChange={(e) => setShowCustomCode(e.target.value.trim().length > 0)}
          className="h-12 w-full pl-5 pr-12 text-sm"
        />
        <Button
          type="submit"
          size="icon-xs"
          disabled={isPending}
          aria-label="Shorten link"
          className="absolute top-1/2 right-2 size-8 -translate-y-1/2 rounded-full bg-orange-500 text-white hover:bg-orange-500/90 cursor-pointer shadow-2xl"
        >
          {isPending ? (
            <Loader2 className="size-[50%] animate-spin" />
          ) : (
            <Zap fill="currentColor" />
          )}
        </Button>
      </div>
      {error && <p className="px-1 text-sm text-destructive">{error}</p>}
      {showCustomCode && (
        <div className="animate-in fade-in slide-in-from-top-1 flex flex-col gap-3 duration-200">
          <Separator />
          <Input
            id="customSlug"
            name="customSlug"
            placeholder="Custom code (optional)"
            className="h-9 pl-5 text-xs"
          />
        </div>
      )}
    </form>
  );
}
