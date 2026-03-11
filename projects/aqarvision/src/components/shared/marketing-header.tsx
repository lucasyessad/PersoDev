import Link from "next/link";
import { Building2, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-bleu-nuit rounded-lg flex items-center justify-center">
            <Building2 className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">
            Aqar<span className="text-or">Vision</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/#fonctionnalites"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Fonctionnalités
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Tarifs
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/espace">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Visiteur</span>
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              size="sm"
              className="gap-2 bg-bleu-nuit hover:bg-bleu-nuit/90 shadow-soft hover:shadow-card transition-all duration-200"
            >
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Espace Pro</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
