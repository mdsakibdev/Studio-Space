
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Star,
  Users,
} from "lucide-react";

interface Studio {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
  hourlyRate: number;
  maxCapacity: number;
  rating?: number;
  location: {
    city: string;
    area: string;
  };
}

const categoryLabels: Record<string, string> = {
  "photo-studios": "Photo Studio",
  "sound-stages": "Sound Stage",
  "podcast-rooms": "Podcast Room",
  "music-suites": "Music Suite",
  "art-workshops": "Art Workshop",
};

export default function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedStudios = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/studios/featured"
        );

        if (!response.ok) {
          throw new Error("Failed to load featured studios.");
        }

        const data: Studio[] = await response.json();
        setStudios(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load featured studios right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedStudios();
  }, []);

  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Handpicked Spaces
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Featured Studios
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Discover some of the most loved creative spaces for your next
              production.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
          >
            Explore All Studios
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="h-56 bg-muted" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-1/3 rounded bg-muted" />
                  <div className="h-5 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                  <div className="h-10 rounded-lg bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-border bg-card px-5 py-12 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && studios.length === 0 && (
          <div className="rounded-2xl border border-border bg-card px-5 py-12 text-center">
            <h3 className="text-lg font-semibold text-foreground">
              No Featured Studios Yet
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Featured studio spaces will appear here soon.
            </p>
          </div>
        )}

        {/* Featured Studio Cards */}
        {!loading && !error && studios.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <article
                key={studio._id}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Studio Image */}
                <div
                  className="relative h-56 bg-muted bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${studio.imageUrl}")`,
                  }}
                >
                  <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                    {categoryLabels[studio.category] || studio.category}
                  </span>

                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-black/80 px-3 py-2 text-xs font-semibold text-white backdrop-blur">
                    <Star
                      size={14}
                      fill="#FBBF24"
                      className="text-yellow-400"
                    />
                    {(studio.rating || 0).toFixed(1)}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/60 to-transparent" />

                  <div className="absolute bottom-3 left-3 text-lg font-bold text-white">
                    ${studio.hourlyRate.toLocaleString("en-US")}
                    <span className="ml-1 text-xs font-normal text-gray-200">
                      / hr
                    </span>
                  </div>
                </div>

                {/* Studio Information */}
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin size={14} className="shrink-0 text-primary" />
                    <span>
                      {studio.location?.area}, {studio.location?.city}
                    </span>
                  </div>

                  <h3 className="line-clamp-1 text-lg font-bold text-foreground transition group-hover:text-primary">
                    {studio.title}
                  </h3>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users size={15} />
                      Up to {studio.maxCapacity} creators
                    </span>

                    <Link
                      href={`/studios/${studio._id}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
                    >
                      View Details
                      <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
