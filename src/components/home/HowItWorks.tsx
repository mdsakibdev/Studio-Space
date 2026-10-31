
import Link from "next/link";
import {
  Search,
  CalendarCheck,
  CreditCard,
  Camera,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Explore Studios",
    description:
      "Browse a wide range of creative spaces and find the perfect studio for your project.",
    icon: Search,
  },
  {
    number: "02",
    title: "Choose Your Space",
    description:
      "Compare studio details, equipment, pricing, location and availability before deciding.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Book Your Session",
    description:
      "Select your preferred date, time and crew size to submit your booking request.",
    icon: CreditCard,
  },
  {
    number: "04",
    title: "Create Something Great",
    description:
      "Show up at your selected studio and bring your creative ideas to life.",
    icon: Camera,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-card px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <CheckCircle2 size={14} />
            Simple Process
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            How StudioSpace Works
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            From discovering your ideal creative space to starting your next
            project, booking a studio is simple with StudioSpace.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-border bg-background p-6 transition duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="mb-7 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon size={26} />
                  </div>

                  <span className="text-3xl font-bold tracking-tight text-muted-foreground/20">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground transition group-hover:text-primary">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:flex-row sm:p-8">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Ready to find your creative space?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore studios and start planning your next project.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Explore Studios
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
