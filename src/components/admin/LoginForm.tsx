"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { signIn, type LoginState } from "@/actions/auth";
import { Field, inputClasses } from "@/components/admin/Field";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, null);

  return (
    <form action={action} className="mt-8 space-y-5">
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="Email" htmlFor="email">
        <input id="email" name="email" type="email" autoComplete="email" required className={inputClasses()} />
      </Field>
      <Field label="Password" htmlFor="password">
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClasses()} />
      </Field>
      <div aria-live="polite">
        {state?.error && <p className="text-sm font-medium text-danger">{state.error}</p>}
      </div>
      <button type="submit" disabled={pending} className={cn(buttonClasses("cocoa"), "w-full")}>
        {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
