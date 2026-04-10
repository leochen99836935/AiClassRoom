/** @spec docs/specs/P0.C-1-nextjs-bootstrap.md */

import { Button } from "@aiclassroom/ui";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-foreground text-4xl font-bold tracking-tight">AIClassRoom</h1>
      <p className="text-muted-foreground text-lg">AI-powered interactive classroom</p>
      <Button size="lg">Get Started</Button>
    </main>
  );
}
