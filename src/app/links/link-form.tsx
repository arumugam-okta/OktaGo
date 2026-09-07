"use client";

import { useRef, useState, useTransition } from "react";

import { createLinkAction } from "@/app/links/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LinkForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createLinkAction(formData);
      setError(result.error);
      if (!result.error) formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="url">Destination URL</Label>
          <Input
            id="url"
            name="url"
            type="url"
            placeholder="https://example.com/very/long/path"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:w-48">
          <Label htmlFor="customSlug">Custom code (optional)</Label>
          <Input id="customSlug" name="customSlug" placeholder="my-link" />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Shorten"}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}
