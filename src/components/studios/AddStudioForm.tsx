"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Camera,
  Check,
  Clock3,
  ImagePlus,
  MapPin,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

const categories = [
  { value: "photo-studios", label: "Photo Studios" },
  { value: "sound-stages", label: "Sound Stages" },
  { value: "podcast-rooms", label: "Podcast Rooms" },
  { value: "music-suites", label: "Music Suites" },
  { value: "art-workshops", label: "Art Workshops" },
];

const amenitiesList = [
  "Air Conditioning",
  "Professional Lighting",
  "High-Speed Wi-Fi",
  "Free Parking",
  "Soundproofing",
  "Makeup Room",
  "Changing Room",
  "Natural Lighting",
  "Waiting Area",
  "Restroom",
];

const equipmentList = [
  "Professional Camera",
  "Tripod",
  "Microphone",
  "Studio Lights",
  "Audio Mixer",
  "Green Screen",
  "Speakers",
  "Projector",
];

const availableDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface StudioFormData {
  title: string;
  category: string;
  overview: string;
  imageUrl: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  minBookingHours: string;
  city: string;
  area: string;
  address: string;
  openingTime: string;
  closingTime: string;
  cancellationPolicy: string;
  studioRules: string;
  spaceHighlights: string;
}

const initialFormData: StudioFormData = {
  title: "",
  category: "",
  overview: "",
  imageUrl: "",
  hourlyRate: "",
  securityDeposit: "0",
  maxCapacity: "",
  minBookingHours: "1",
  city: "",
  area: "",
  address: "",
  openingTime: "09:00",
  closingTime: "18:00",
  cancellationPolicy: "moderate",
  studioRules: "",
  spaceHighlights: "",
};

function SectionHeading({
  number,
  title,
  description,
  icon: Icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d6a75c]/20 bg-[#d6a75c]/10 text-[#d6a75c]">
        <Icon size={20} />
      </div>

      <div>
        <p className="mb-1 text-xs font-semibold tracking-[0.16em] text-[#d6a75c]">
          STEP {number}
        </p>
        <h2 className="text-lg font-bold text-foreground sm:text-xl">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#d6a75c] focus:ring-2 focus:ring-[#d6a75c]/15";

const textareaClass =
  "min-h-32 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#d6a75c] focus:ring-2 focus:ring-[#d6a75c]/15";

const labelClass = "mb-2 block text-sm font-medium text-foreground";

export default function AddStudioForm() {
  const { data: session, isPending } = authClient.useSession();

  const [formData, setFormData] =
    useState<StudioFormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

  const [galleryUrls, setGalleryUrls] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]);
  const [instantBooking, setInstantBooking] = useState(false);

  const user = session?.user;

  const updateField = (
    field: keyof StudioFormData,
    value: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const toggleItem = (
    item: string,
    selectedItems: string[],
    setSelectedItems: (items: string[]) => void
  ) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((value) => value !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

 const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (!user) {
    toast.error("Please login first!");
    return;
  }

  if (amenities.length === 0) {
    toast.error("Please select at least one amenity.");
    return;
  }

  if (selectedDays.length === 0) {
    toast.error("Please select available days.");
    return;
  }

  const data = {
    title: formData.title,
    category: formData.category,
    overview: formData.overview,
    imageUrl: formData.imageUrl,
    galleryImages,

    hourlyRate: Number(formData.hourlyRate),
    securityDeposit: Number(formData.securityDeposit),
    maxCapacity: Number(formData.maxCapacity),
    minBookingHours: Number(formData.minBookingHours),

    location: {
      city: formData.city,
      area: formData.area,
      address: formData.address,
    },

    amenities,
    equipment,

    availability: {
      days: selectedDays,
      openingTime: formData.openingTime,
      closingTime: formData.closingTime,
    },

    cancellationPolicy: formData.cancellationPolicy,
    studioRules: formData.studioRules,

    spaceHighlights: formData.spaceHighlights
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),

    instantBooking,

    host: {
      name: user.name,
      email: user.email,
    },
  };

  try {
    setIsSubmitting(true);

    const response = await fetch("http://localhost:5000/studios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to add studio.");
    }

    toast.success("Studio added successfully!");

    console.log("Saved Studio:", result);

  } catch (error) {
    console.error(error);
    toast.error("Something went wrong!");
  } finally {
    setIsSubmitting(false);
  }
};

  const galleryImages = galleryUrls
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);

  const mainImageIsValid =
    formData.imageUrl.startsWith("https://") ||
    formData.imageUrl.startsWith("http://");

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Page heading */}
      <div className="mb-8">
        <Link
          href="/studios"
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-[#d6a75c]"
        >
          <ArrowLeft size={16} />
          Back to Studios
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d6a75c]/20 bg-[#d6a75c]/10 px-3 py-1.5 text-xs font-semibold text-[#d6a75c]">
              <Sparkles size={14} />
              SHARE YOUR CREATIVE SPACE
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Add a New Studio
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              List your creative space and connect with creators looking
              for the perfect place to bring their ideas to life.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck size={18} className="text-[#d6a75c]" />
            Host Dashboard
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 01 Basic information */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <SectionHeading
            number="01"
            title="Basic Information"
            description="Tell creators what makes your studio special."
            icon={Building2}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>Studio Title *</label>
              <input
                required
                minLength={3}
                maxLength={100}
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. The Creative Photography Studio"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Studio Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => updateField("category", e.target.value)}
                className={inputClass}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Maximum Capacity *</label>
              <input
                required
                type="number"
                min="1"
                value={formData.maxCapacity}
                onChange={(e) =>
                  updateField("maxCapacity", e.target.value)
                }
                placeholder="e.g. 15 people"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Studio Overview *</label>
              <textarea
                required
                minLength={20}
                maxLength={1500}
                value={formData.overview}
                onChange={(e) => updateField("overview", e.target.value)}
                placeholder="Describe your studio, its atmosphere and what creators can do there..."
                className={textareaClass}
              />
              <p className="mt-2 text-right text-xs text-muted-foreground">
                {formData.overview.length}/1500 characters
              </p>
            </div>
          </div>
        </section>

        {/* 02 Images */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <SectionHeading
            number="02"
            title="Studio Images"
            description="Add a cover image and more images to showcase your space."
            icon={Camera}
          />

          <div>
            <label className={labelClass}>Cover Image URL *</label>
            <div className="relative">
              <ImagePlus
                size={18}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                required
                type="url"
                value={formData.imageUrl}
                onChange={(e) => updateField("imageUrl", e.target.value)}
                placeholder="https://example.com/studio-image.jpg"
                className={`${inputClass} pl-11`}
              />
            </div>
          </div>

          {mainImageIsValid && (
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <div
                className="h-52 bg-cover bg-center sm:h-64"
                style={{
                  backgroundImage: `url("${formData.imageUrl}")`,
                }}
              />
              <p className="bg-background px-4 py-2 text-xs text-muted-foreground">
                Cover image preview
              </p>
            </div>
          )}

          <div className="mt-5">
            <label className={labelClass}>
              Additional Gallery Image URLs
            </label>
            <textarea
              value={galleryUrls}
              onChange={(e) => setGalleryUrls(e.target.value)}
              placeholder={"Paste one image URL per line\nhttps://example.com/image-2.jpg\nhttps://example.com/image-3.jpg"}
              className={textareaClass}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Add one image URL per line. You can add multiple images.
            </p>
          </div>

          {galleryImages.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {galleryImages.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="h-28 rounded-xl border border-border bg-cover bg-center"
                  style={{ backgroundImage: `url("${url}")` }}
                />
              ))}
            </div>
          )}
        </section>

        {/* 03 Pricing */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <SectionHeading
            number="03"
            title="Pricing & Booking Duration"
            description="Set your studio rental price and booking requirements."
            icon={Clock3}
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={labelClass}>Hourly Rate ($) *</label>
              <input
                required
                type="number"
                min="1"
                value={formData.hourlyRate}
                onChange={(e) =>
                  updateField("hourlyRate", e.target.value)
                }
                placeholder="e.g. 50"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Security Deposit ($)
              </label>
              <input
                type="number"
                min="0"
                value={formData.securityDeposit}
                onChange={(e) =>
                  updateField("securityDeposit", e.target.value)
                }
                placeholder="e.g. 100"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Minimum Booking (Hours)
              </label>
              <input
                type="number"
                min="1"
                value={formData.minBookingHours}
                onChange={(e) =>
                  updateField("minBookingHours", e.target.value)
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#d6a75c]/20 bg-[#d6a75c]/5 p-4">
            <Sparkles
              size={18}
              className="mt-0.5 shrink-0 text-[#d6a75c]"
            />
            <p className="text-xs leading-6 text-muted-foreground">
              Your hourly rate and security deposit will be clearly
              displayed to creators before they make a booking.
            </p>
          </div>
        </section>

        {/* 04 Location */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <SectionHeading
            number="04"
            title="Location Details"
            description="Help creators find your studio easily."
            icon={MapPin}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>City *</label>
              <input
                required
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="e.g. Dhaka"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Area / Neighborhood *</label>
              <input
                required
                value={formData.area}
                onChange={(e) => updateField("area", e.target.value)}
                placeholder="e.g. Dhanmondi"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Full Address *</label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="Enter the complete studio address..."
                className="min-h-24 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#d6a75c] focus:ring-2 focus:ring-[#d6a75c]/15"
              />
            </div>
          </div>
        </section>

        {/* 05 Amenities */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <SectionHeading
            number="05"
            title="Amenities & Facilities"
            description="Select all facilities available in your studio."
            icon={Sparkles}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {amenitiesList.map((amenity) => {
              const selected = amenities.includes(amenity);

              return (
                <label
                  key={amenity}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-sm transition ${
                    selected
                      ? "border-[#d6a75c]/50 bg-[#d6a75c]/10 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-[#d6a75c]/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() =>
                      toggleItem(amenity, amenities, setAmenities)
                    }
                    className="sr-only"
                  />
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                      selected
                        ? "border-[#d6a75c] bg-[#d6a75c] text-neutral-950"
                        : "border-border"
                    }`}
                  >
                    {selected && <Check size={13} />}
                  </span>
                  {amenity}
                </label>
              );
            })}
          </div>
        </section>

        {/* 06 Equipment */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <SectionHeading
            number="06"
            title="Equipment Included"
            description="Choose the equipment available for creators to use."
            icon={UploadCloud}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {equipmentList.map((item) => {
              const selected = equipment.includes(item);

              return (
                <label
                  key={item}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-sm transition ${
                    selected
                      ? "border-[#d6a75c]/50 bg-[#d6a75c]/10 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-[#d6a75c]/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() =>
                      toggleItem(item, equipment, setEquipment)
                    }
                    className="sr-only"
                  />
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                      selected
                        ? "border-[#d6a75c] bg-[#d6a75c] text-neutral-950"
                        : "border-border"
                    }`}
                  >
                    {selected && <Check size={13} />}
                  </span>
                  {item}
                </label>
              );
            })}
          </div>
        </section>

        {/* 07 Availability and rules */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <SectionHeading
            number="07"
            title="Availability & Studio Rules"
            description="Set your opening hours and booking preferences."
            icon={Clock3}
          />

          <div className="mb-5">
            <label className={labelClass}>Available Days *</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {availableDays.map((day) => {
                const selected = selectedDays.includes(day);

                return (
                  <label
                    key={day}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition ${
                      selected
                        ? "border-[#d6a75c]/50 bg-[#d6a75c]/10 text-foreground"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        toggleItem(day, selectedDays, setSelectedDays)
                      }
                      className="accent-[#d6a75c]"
                    />
                    {day}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Opening Time</label>
              <input
                type="time"
                value={formData.openingTime}
                onChange={(e) =>
                  updateField("openingTime", e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Closing Time</label>
              <input
                type="time"
                value={formData.closingTime}
                onChange={(e) =>
                  updateField("closingTime", e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Cancellation Policy</label>
              <select
                value={formData.cancellationPolicy}
                onChange={(e) =>
                  updateField("cancellationPolicy", e.target.value)
                }
                className={inputClass}
              >
                <option value="flexible">Flexible</option>
                <option value="moderate">Moderate</option>
                <option value="strict">Strict</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Studio Rules</label>
              <textarea
                value={formData.studioRules}
                onChange={(e) =>
                  updateField("studioRules", e.target.value)
                }
                placeholder="Mention any rules creators should know before booking..."
                className={textareaClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Space Highlights</label>
              <input
                value={formData.spaceHighlights}
                onChange={(e) =>
                  updateField("spaceHighlights", e.target.value)
                }
                placeholder="e.g. Natural Lighting, Large Space, City View"
                className={inputClass}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Separate multiple highlights with commas.
              </p>
            </div>
          </div>

          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background p-4">
            <input
              type="checkbox"
              checked={instantBooking}
              onChange={(e) => setInstantBooking(e.target.checked)}
              className="mt-1 accent-[#d6a75c]"
            />
            <span>
              <span className="block text-sm font-semibold text-foreground">
                Enable Instant Booking
              </span>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                Allow creators to book your studio without waiting for
                manual host approval. This preference will be saved with
                your listing.
              </span>
            </span>
          </label>
        </section>

        {/* 08 Host information */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <SectionHeading
            number="08"
            title="Host Information"
            description="Your account information will be attached to this listing."
            icon={ShieldCheck}
          />

          {isPending ? (
            <p className="text-sm text-muted-foreground">
              Loading your account information...
            </p>
          ) : user ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Host Name</label>
                <input
                  readOnly
                  value={user.name || ""}
                  className={`${inputClass} cursor-not-allowed opacity-70`}
                />
              </div>

              <div>
                <label className={labelClass}>Host Email</label>
                <input
                  readOnly
                  value={user.email || ""}
                  className={`${inputClass} cursor-not-allowed opacity-70`}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[#d6a75c]/20 bg-[#d6a75c]/5 p-4">
              <p className="text-sm text-foreground">
                Please log in to add a studio. Your host information
                will be added automatically.
              </p>
              <Link
                href="/login"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#d6a75c] hover:underline"
              >
                Go to Login <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </section>

        {/* Submit area */}
        <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-muted-foreground">
            Fields marked with * are required.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/studios"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border px-6 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isPending || !user || isSubmitting}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#d6a75c] px-7 text-sm font-bold text-neutral-950 transition hover:bg-[#e7bd7b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Saving Studio..." : "Add Studio"}
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}