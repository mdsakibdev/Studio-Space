
import Link from "next/link";
import {
  Camera,
  Clapperboard,
  Mic2,
  Music2,
  Palette,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    title: "Photo Studios",
    description: "Capture your creative vision",
    value: "photo-studios",
    icon: Camera,
    number: "01",
  },
  {
    title: "Sound Stages",
    description: "Spaces for cinematic production",
    value: "sound-stages",
    icon: Clapperboard,
    number: "02",
  },
  {
    title: "Podcast Rooms",
    description: "Create your next conversation",
    value: "podcast-rooms",
    icon: Mic2,
    number: "03",
  },
  {
    title: "Music Suites",
    description: "Make your sound come alive",
    value: "music-suites",
    icon: Music2,
    number: "04",
  },
  {
    title: "Art Workshops",
    description: "Room to create and explore",
    value: "art-workshops",
    icon: Palette,
    number: "05",
  },
];

export default function BrowseCategories() {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Find Your Creative Space
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Browse by Studio Categories
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Explore unique creative spaces designed to bring your ideas
              and productions to life.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
          >
            Explore All Studios
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.value}
                href={`/studios?category=${category.value}`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Decorative Background */}
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/5 transition duration-500 group-hover:scale-150 group-hover:bg-primary/10" />

                <div className="relative">
                  <div className="mb-8 flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon size={27} strokeWidth={1.7} />
                    </div>

                    <span className="text-xs font-medium tracking-wider text-muted-foreground/60">
                      {category.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground transition group-hover:text-primary">
                    {category.title}
                  </h3>

                  <p className="mt-2 min-h-10 text-sm leading-5 text-muted-foreground">
                    {category.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs font-semibold text-muted-foreground transition group-hover:text-primary">
                      Explore Category
                    </span>

                    <ArrowUpRight
                      size={17}
                      className="text-muted-foreground transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
