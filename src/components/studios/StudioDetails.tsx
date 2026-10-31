"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  MapPin,
  Star,
  Users,
  Clock,
  ShieldCheck,
  CalendarDays,
  CheckCircle2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
//   Camera,
  Wifi,
//   Car,
//   Music,
  Info,
} from "lucide-react";

interface Studio {
  _id: string;
  title: string;
  category: string;
  overview: string;
  imageUrl: string;
  galleryImages?: string[];
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  minBookingHours: number;
  location: {
    city: string;
    area: string;
    address: string;
  };
  amenities?: string[];
  equipment?: string[];
  availability?: {
    days?: string[];
    openingTime?: string;
    closingTime?: string;
  };
  cancellationPolicy?: string;
  studioRules?: string;
  spaceHighlights?: string[];
  instantBooking?: boolean;
  host?: {
    name?: string;
    email?: string;
  };
  rating?: number;
}

interface StudioDetailsProps {
  studio: Studio;
}

export default function StudioDetails({ studio }: StudioDetailsProps) {
  const images = [
    studio.imageUrl,
    ...(studio.galleryImages || []),
  ].filter(Boolean);

  const [activeImage, setActiveImage] = useState(0);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(
    studio.minBookingHours || 1
  );
  const [wishlist, setWishlist] = useState(false);

  const totalPrice = duration * studio.hourlyRate;

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setActiveImage(
      (prev) => (prev - 1 + images.length) % images.length
    );
  };

  const handleBooking = () => {
    if (!bookingDate || !startTime) {
      toast.error("Please select your booking date and start time.");
      return;
    }

    toast.info("Booking functionality will be available soon.");
  };

  const formatCategory = (category: string) =>
    category
      ?.split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <Link
            href="/studios"
            className="flex items-center gap-2 text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft size={16} />
            Explore Studios
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="truncate text-foreground">
            {studio.title}
          </span>
        </div>

        {/* Studio Heading */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {formatCategory(studio.category)}
            </span>

            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {studio.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin size={16} className="text-primary" />
                {studio.location?.area}, {studio.location?.city}
              </span>

              <span className="flex items-center gap-1.5">
                <Star
                  size={16}
                  className="fill-amber-400 text-amber-400"
                />
                {studio.rating || "New"} Rating
              </span>
            </div>
          </div>

          <button
            onClick={() => setWishlist(!wishlist)}
            className="flex w-fit items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            <Heart
              size={18}
              className={
                wishlist
                  ? "fill-red-500 text-red-500"
                  : ""
              }
            />
            {wishlist ? "Saved" : "Save Studio"}
          </button>
        </div>

        {/* Image Gallery */}
        <section className="mb-10">
          <div className="grid gap-3 lg:grid-cols-4">
            <div className="relative h-[280px] overflow-hidden rounded-2xl bg-muted sm:h-[400px] lg:col-span-3">
              {images.length > 0 && (
                <>
                  <Image
                    src={images[activeImage]}
                    alt={studio.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 75vw"
                    className="object-cover"
                  />

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={previousImage}
                        aria-label="Previous image"
                        className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
                      >
                        <ChevronLeft size={22} />
                      </button>

                      <button
                        onClick={nextImage}
                        aria-label="Next image"
                        className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
                      >
                        <ChevronRight size={22} />
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
              {images.slice(0, 3).map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setActiveImage(index)}
                  className={`relative h-24 overflow-hidden rounded-xl bg-muted sm:h-32 lg:h-[126px] ${
                    activeImage === index
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : ""
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${studio.title} ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition duration-300 hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </div>

          {images.length > 1 && (
            <p className="mt-3 text-right text-xs text-muted-foreground">
              {activeImage + 1} / {images.length} Photos
            </p>
          )}
        </section>

        {/* Main Content */}
        <div className="grid items-start gap-8 lg:grid-cols-3">

          {/* Left Content */}
          <div className="space-y-8 lg:col-span-2">

            {/* Overview */}
            <section>
              <h2 className="mb-4 text-xl font-bold text-foreground">
                About This Studio
              </h2>

              <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {studio.overview}
              </p>

              {studio.location?.address && (
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                  <MapPin className="mt-0.5 text-primary" size={20} />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Studio Location
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {studio.location.address},{" "}
                      {studio.location.area},{" "}
                      {studio.location.city}
                    </p>
                  </div>
                </div>
              )}
            </section>

            <div className="border-t border-border" />

            {/* Studio Highlights */}
            {studio.spaceHighlights &&
              studio.spaceHighlights.length > 0 && (
                <section>
                  <h2 className="mb-4 text-xl font-bold text-foreground">
                    Studio Highlights
                  </h2>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {studio.spaceHighlights.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                      >
                        <CheckCircle2
                          size={19}
                          className="shrink-0 text-primary"
                        />
                        <span className="text-sm text-foreground">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            {/* Amenities */}
            {studio.amenities && studio.amenities.length > 0 && (
              <>
                <div className="border-t border-border" />

                <section>
                  <h2 className="mb-4 text-xl font-bold text-foreground">
                    Amenities & Facilities
                  </h2>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {studio.amenities.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                      >
                        <Wifi size={18} className="shrink-0 text-primary" />
                        <span className="text-sm text-foreground">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Equipment */}
            {studio.equipment && studio.equipment.length > 0 && (
              <>
                <div className="border-t border-border" />

                <section>
                  <h2 className="mb-4 text-xl font-bold text-foreground">
                    Available Equipment
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {studio.equipment.map((item, index) => (
                      <span
                        key={index}
                        className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </section>
              </>
            )}

            <div className="border-t border-border" />

            {/* Availability */}
            <section>
              <h2 className="mb-4 text-xl font-bold text-foreground">
                Availability
              </h2>

              <div className="rounded-xl border border-border bg-card p-5">
                <div className="mb-4 flex items-center gap-3">
                  <CalendarDays className="text-primary" size={21} />
                  <span className="font-semibold text-foreground">
                    Available Days
                  </span>
                </div>

                <div className="mb-5 flex flex-wrap gap-2">
                  {studio.availability?.days?.map((day) => (
                    <span
                      key={day}
                      className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
                    >
                      {day}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <Clock className="text-primary" size={21} />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Opening Hours
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {studio.availability?.openingTime || "Not specified"}
                      {" – "}
                      {studio.availability?.closingTime || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Studio Rules */}
            {(studio.studioRules || studio.cancellationPolicy) && (
              <>
                <div className="border-t border-border" />

                <section>
                  <h2 className="mb-4 text-xl font-bold text-foreground">
                    Rules & Policies
                  </h2>

                  <div className="space-y-4">
                    {studio.studioRules && (
                      <div className="rounded-xl border border-border bg-card p-5">
                        <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                          <ShieldCheck size={19} className="text-primary" />
                          Studio Rules
                        </h3>
                        <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
                          {studio.studioRules}
                        </p>
                      </div>
                    )}

                    {studio.cancellationPolicy && (
                      <div className="rounded-xl border border-border bg-card p-5">
                        <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                          <Info size={19} className="text-primary" />
                          Cancellation Policy
                        </h3>
                        <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
                          {studio.cancellationPolicy}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}

            {/* Host Information */}
            <div className="border-t border-border" />

            <section>
              <h2 className="mb-4 text-xl font-bold text-foreground">
                Hosted By
              </h2>

              <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-primary">
                  {studio.host?.name?.charAt(0)?.toUpperCase() || "H"}
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">
                    {studio.host?.name || "Studio Host"}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Studio Host
                  </p>
                  {studio.host?.email && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {studio.host.email}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Booking Card */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">

              <div className="mb-5 flex items-end justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Starting from
                  </p>
                  <h2 className="mt-1 text-3xl font-bold text-foreground">
                    ৳{studio.hourlyRate?.toLocaleString("en-BD")}
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}/ hour
                    </span>
                  </h2>
                </div>

                {studio.instantBooking && (
                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-600">
                    Instant Booking
                  </span>
                )}
              </div>

              <div className="space-y-4">

                {/* Date */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Booking Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>

                {/* Start Time */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Booking Duration (Hours)
                  </label>
                  <input
                    type="number"
                    min={studio.minBookingHours || 1}
                    value={duration}
                    onChange={(e) =>
                      setDuration(
                        Math.max(
                          studio.minBookingHours || 1,
                          Number(e.target.value)
                        )
                      )
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-primary"
                  />

                  <p className="mt-1 text-xs text-muted-foreground">
                    Minimum {studio.minBookingHours || 1} hour(s)
                  </p>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      ৳{studio.hourlyRate?.toLocaleString("en-BD")} × {duration} hours
                    </span>
                    <span className="font-medium text-foreground">
                      ৳{totalPrice.toLocaleString("en-BD")}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Security Deposit
                    </span>
                    <span className="font-medium text-foreground">
                      ৳{studio.securityDeposit?.toLocaleString("en-BD")}
                    </span>
                  </div>

                  <div className="mt-4 flex justify-between border-t border-border pt-4">
                    <span className="font-semibold text-foreground">
                      Estimated Total
                    </span>
                    <span className="text-xl font-bold text-primary">
                      ৳{(totalPrice + studio.securityDeposit).toLocaleString("en-BD")}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Includes the security deposit. Final charges may vary.
                  </p>
                </div>

                <button
                  onClick={handleBooking}
                  className="w-full rounded-xl bg-primary px-5 py-3.5 font-semibold text-white transition hover:opacity-90"
                >
                  Request Booking
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  You wont be charged at this stage.
                </p>
              </div>

              {/* Quick Information */}
              <div className="mt-6 space-y-4 border-t border-border pt-5">
                <div className="flex items-center gap-3">
                  <Users size={19} className="text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Maximum {studio.maxCapacity} people
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <ShieldCheck size={19} className="text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Security deposit ৳
                    {studio.securityDeposit?.toLocaleString("en-BD")}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={19} className="text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Minimum {studio.minBookingHours || 1} hour booking
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}