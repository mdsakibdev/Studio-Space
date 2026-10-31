
import Link from "next/link";
import {
  Camera,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Creative Spaces",
    description:
      "Discover photography studios, sound stages, podcast rooms and other creative spaces in one place.",
  },
  {
    icon: Users,
    title: "Built for Creators",
    description:
      "We connect photographers, filmmakers, podcasters and creative professionals with the spaces they need.",
  },
  {
    icon: ShieldCheck,
    title: "Simple Booking",
    description:
      "Explore studio details, compare options and manage your booking through one convenient platform.",
  },
];

export default function AboutUs() {
  return (
    <section
      id="about"
      className="scroll-mt-24 bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles size={14} />
              About StudioSpace
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              A Better Space for
              <span className="text-primary"> Every Creative Idea.</span>
            </h2>

            <p className="mt-6 text-sm leading-8 text-muted-foreground sm:text-base">
              StudioSpace is a platform designed to make finding and booking
              creative workspaces easier. Whether you are a photographer,
              filmmaker, musician or content creator, we help you discover
              spaces that fit your creative needs.
            </p>

            <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">
              Our goal is to bring studio owners and creative professionals
              together through a simple and convenient studio discovery and
              booking experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/studios"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Explore Studios
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/#how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
              >
                How It Works
              </Link>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative">
            <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles size={24} />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Why StudioSpace?
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Everything creators need in one place.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div key={feature.title} className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon size={21} />
                      </div>

                      <div>
                        <h4 className="font-semibold text-foreground">
                          {feature.title}
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle2 size={18} />
                  <span className="text-sm font-semibold">
                    Your Creativity, Our Space
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Find the right environment, focus on your ideas and create
                  something extraordinary.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
