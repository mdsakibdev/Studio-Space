"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Users,
  Heart,
  ArrowRight,
  RotateCcw,
  Star,
} from "lucide-react";

interface Studio {
  _id: string;
  title: string;
  category: string;
  overview: string;
  imageUrl: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: {
    city: string;
    area: string;
    address: string;
  };
  equipment?: string[];
  rating?: number;
  createdAt?: string;
}

const categories = [
  { label: "All", value: "all" },
  { label: "Photo Studio", value: "photo-studios" },
  { label: "Film Stage", value: "sound-stages" },
  { label: "Podcast Room", value: "podcast-rooms" },
  { label: "Music Suite", value: "music-suites" },
  { label: "Art Workshop", value: "art-workshops" },
];

export default function ExploreStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedMin, setAppliedMin] = useState("");
  const [appliedMax, setAppliedMax] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [favorites, setFavorites] = useState<string[]>([]);

  // MongoDB থেকে সব Studio নিয়ে আসা
  useEffect(() => {
    const fetchStudios = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/studios");

        if (!response.ok) {
          throw new Error("Failed to load studios.");
        }

        const data = await response.json();
        setStudios(data);
      } catch (err) {
        console.error(err);
        setError("Could not load studios. Please check your backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudios();
  }, []);

  // Search, Filter এবং Sorting
  const filteredStudios = useMemo(() => {
    let result = [...studios];

    // Search filter
    if (search.trim()) {
      const searchText = search.toLowerCase();

      result = result.filter((studio) => {
        const searchableText = [
          studio.title,
          studio.overview,
          studio.location?.city,
          studio.location?.area,
          ...(studio.equipment || []),
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchText);
      });
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (studio) => studio.category === selectedCategory
      );
    }

    // Minimum price filter
    if (appliedMin !== "") {
      result = result.filter(
        (studio) => studio.hourlyRate >= Number(appliedMin)
      );
    }

    // Maximum price filter
    if (appliedMax !== "") {
      result = result.filter(
        (studio) => studio.hourlyRate <= Number(appliedMax)
      );
    }

    // Sorting
    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    } else if (sortBy === "price-low") {
      result.sort((a, b) => a.hourlyRate - b.hourlyRate);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.hourlyRate - a.hourlyRate);
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [
    studios,
    search,
    selectedCategory,
    appliedMin,
    appliedMax,
    sortBy,
  ]);

  // Wishlist toggle
  const toggleFavorite = (id: string) => {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setAppliedMin("");
    setAppliedMax("");
    setSortBy("newest");
  };

  return (
    <section className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Page Heading */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              ✨ Full Marketplace Catalog
            </span>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Explore Creative Studios
            </h1>

            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Discover sound stages, photography studios, podcast rooms and
              creative spaces.
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filteredStudios.length}
            </span>{" "}
            of {studios.length} creative spaces
          </p>
        </div>

        {/* Search and Filter Panel */}
        <div className="mb-7 rounded-2xl border border-border bg-card p-4 shadow-sm">

          {/* Search and Sorting */}
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search studios by title, equipment, city..."
                className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-primary"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="newest">Newest Listings</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Category and Price Filters */}
          <div className="mt-5 flex flex-col gap-5 border-t border-border pt-4 xl:flex-row xl:items-center xl:justify-between">

            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <SlidersHorizontal size={14} />
                Category:
              </span>

              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    selectedCategory === category.value
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-foreground hover:bg-primary/10"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Price:</span>

              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min ৳"
                className="h-9 w-20 rounded-lg border border-border bg-background px-2 text-sm text-foreground outline-none focus:border-primary"
              />

              <span className="text-muted-foreground">-</span>

              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max ৳"
                className="h-9 w-20 rounded-lg border border-border bg-background px-2 text-sm text-foreground outline-none focus:border-primary"
              />

              <button
                onClick={() => {
                  setAppliedMin(minPrice);
                  setAppliedMax(maxPrice);
                }}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Apply
              </button>

              <button
                onClick={resetFilters}
                title="Reset filters"
                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>
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
                <div className="space-y-3 p-4">
                  <div className="h-4 w-1/3 rounded bg-muted" />
                  <div className="h-5 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-10 rounded-lg bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <p className="font-medium text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Studio Cards */}
        {!loading && !error && filteredStudios.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStudios.map((studio) => (
              <article
                key={studio._id}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Studio Image */}
                <div
                  className="relative h-56 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${studio.imageUrl}")`,
                  }}
                >
                  <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground">
                    {categories.find((item) => item.value === studio.category)
                      ?.label || studio.category}
                  </span>

                  <button
                    onClick={() => toggleFavorite(studio._id)}
                    aria-label="Add to wishlist"
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
                  >
                    <Heart
                      size={18}
                      fill={
                        favorites.includes(studio._id)
                          ? "currentColor"
                          : "none"
                      }
                      className={
                        favorites.includes(studio._id) ? "text-red-400" : ""
                      }
                    />
                  </button>

                  <div className="absolute bottom-3 left-3 rounded-lg bg-black/80 px-3 py-2 text-sm font-bold text-white">
                    ৳{studio.hourlyRate.toLocaleString("en-BD")}
                    <span className="text-xs font-normal text-gray-300">
                      {" "}
                      / hr
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg bg-black/80 px-2 py-2 text-xs font-semibold text-white">
                    <Star size={13} fill="#FBBF24" className="text-yellow-400" />
                    {(studio.rating || 0).toFixed(1)}
                  </div>
                </div>

                {/* Studio Information */}
                <div className="p-4">
                  <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin size={14} className="shrink-0 text-primary" />
                    <span>
                      {studio.location?.area}, {studio.location?.city}
                    </span>
                  </div>

                  <h2 className="mb-2 line-clamp-1 text-lg font-bold text-foreground transition group-hover:text-primary">
                    {studio.title}
                  </h2>

                  <p className="mb-4 line-clamp-2 min-h-10 text-sm leading-relaxed text-muted-foreground">
                    {studio.overview}
                  </p>

                  <div className="mb-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users size={14} />
                      Up to {studio.maxCapacity} creators
                    </span>

                    <span>
                      Deposit: ৳
                      {studio.securityDeposit.toLocaleString("en-BD")}
                    </span>
                  </div>

                  <Link
                    href={`/studios/${studio._id}`}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-black text-sm font-semibold text-background transition hover:bg-primary hover:text-primary-foreground"
                  >
                    View Details
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredStudios.length === 0 && (
          <div className="rounded-2xl border border-border bg-card px-5 py-16 text-center">
            <Search size={35} className="mx-auto text-muted-foreground" />

            <h3 className="mt-4 text-xl font-bold text-foreground">
              No Studios Found
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Try changing your search or filter options.
            </p>

            <button
              onClick={resetFilters}
              className="mt-5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}