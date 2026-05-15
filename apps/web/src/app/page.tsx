import { Button } from "@share-clipboard/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@share-clipboard/ui/components/card";
import { GlobeIcon, MousePointerClickIcon, KeyboardIcon } from "lucide-react";

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function KeyboardShortcut({ keys }: { keys: string }) {
  return (
    <kbd className="px-2 py-1 text-xs font-mono rounded border bg-muted">
      {keys}
    </kbd>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <span className="font-semibold text-lg">Share Clipboard</span>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Select Text, Press Shortcut, Done.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A system-level text selection tool. Select text in any application,
            press a global shortcut, and capture instantly.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Download for macOS
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              View Documentation
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Global Shortcut:</span>
            <KeyboardShortcut keys="⌘" />
            <KeyboardShortcut keys="Shift" />
            <KeyboardShortcut keys="C" />
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-12">Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Cross-App Selection"
              description="Select text from any application on your system - browsers, editors, terminals, anywhere."
              icon={<GlobeIcon className="size-5" />}
            />
            <FeatureCard
              title="Floating Ball UI"
              description="A minimal floating ball appears at cursor position for instant interaction and visual feedback."
              icon={<MousePointerClickIcon className="size-5" />}
            />
            <FeatureCard
              title="Keyboard Simulation"
              description="Automatically simulates Cmd/Ctrl+C to capture selected text without manual copying."
              icon={<KeyboardIcon className="size-5" />}
            />
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Download</strong> and
                  install Share Clipboard
                </li>
                <li>
                  <strong className="text-foreground">Grant Accessibility</strong>{" "}
                  permission (macOS only)
                </li>
                <li>
                  <strong className="text-foreground">Select text</strong> in any
                  application
                </li>
                <li>
                  <strong className="text-foreground">Press the shortcut</strong>{" "}
                  to capture
                </li>
              </ol>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built with Electron + React + TypeScript</p>
        </div>
      </footer>
    </div>
  );
}