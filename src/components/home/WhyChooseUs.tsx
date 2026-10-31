
import {
  Search,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  Clock3,
  Headphones,
} from "lucide-react";

const benefits = [
  {
    icon: Search,
    number: "01",
    title: "Easy Studio Discovery",
    description:
      "Find the perfect creative space with convenient search and category filters. Explore studios that match your project requirements.",
  },
  {
    icon: CalendarCheck,
    number: "02",
    title: "Simple Booking Process",
    description:
      "Choose your preferred studio, select a date and time, and submit your booking request through a simple process.",
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "Transparent Information",
    description:
      "Check studio details, equipment, pricing, location and booking policies before making your decision.",
  },
  {
    icon: Clock3,
    number: "04",
    title: "Flexible Studio Options",
    description:
      "Discover different creative spaces and find options that fit your schedule, team size and production needs.",
  },
  {
    icon: Sparkles,
    number: "05",
    title: "Made for Creators",
    description:
      "Whether you are a photographer, filmmaker, musician or podcaster, discover spaces built around your creativity.",
  },
  {
    icon: Headphones,
    number: "06",
    title: "Convenient Experience",
    description:
      "Explore available studios and manage your bookings from one convenient platform.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-card px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles size={14} />
            The StudioSpace Advantage
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Why Choose <span className="text-primary">StudioSpace?</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            Everything you need to discover creative spaces and plan your next
            production, all in one place.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.number}
                className="group relative overflow-hidden rounded-2xl border border-border bg-background p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 sm:p-7"
              >
                {/* Background Decoration */}
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/5 blur-2xl transition group-hover:bg-primary/15" />

                <div className="relative">
                  <div className="mb-7 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon size={25} />
                    </div>

                    <span className="text-3xl font-bold tracking-tight text-muted-foreground/20">
                      {benefit.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground transition group-hover:text-primary">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Message */}
        <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-8 text-center sm:px-10">
          <h3 className="text-xl font-bold text-foreground sm:text-2xl">
            Your Creative Journey Starts with the Right Space.
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            Spend less time searching and more time creating. Discover a space
            that brings your next big idea to life.
          </p>
        </div>
      </div>
    </section>
  );
}
