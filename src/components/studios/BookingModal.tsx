
"use client";

import {  useState } from "react";
import { X, Clock } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface Studio {
  _id: string;
  title: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
}

interface BookingModalProps {
  studio: Studio;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({
  studio,
  isOpen,
  onClose,
}: BookingModalProps) {
  const [shootDate, setShootDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [crewCount, setCrewCount] = useState("4");
  const [gearNotes, setGearNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  

  const { data: session } = authClient.useSession();

  // Get today's local date
const [minDate] = useState(() => {
  const today = new Date();

  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
});

  // Calculate shooting hours
  const getShootHours = () => {
    if (!startTime || !endTime) return 0;

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    if (end <= start) return 0;

    return (end - start) / 60;
  };

  const shootHours = getShootHours();

  // Calculate price
  const shootingCost = shootHours * studio.hourlyRate;
  const totalCost = shootingCost + studio.securityDeposit;

  // Handle Booking
  const handleBooking = async () => {
    if (!shootDate || !startTime || !endTime) {
      toast.error("Please complete all required booking fields.");
      return;
    }

    if (shootDate < minDate) {
      toast.error("Please select today or a future date.");
      return;
    }

    if (shootHours <= 0) {
      toast.error("End time must be later than start time.");
      return;
    }

    if (
      Number(crewCount) < 1 ||
      Number(crewCount) > studio.maxCapacity
    ) {
      toast.error(`Crew count must be between 1 and ${studio.maxCapacity}.`);
      return;
    }

    if (!session?.user) {
      toast.error("Please login to book this studio.");
      return;
    }

    try {
  setIsSubmitting(true);

  // Get JWT Token
  const { data: tokenData, error: tokenError } =
    await authClient.token();

  if (tokenError || !tokenData?.token) {
    throw new Error("Authentication required. Please login again.");
  }

  const token = tokenData.token;

  const response = await fetch("http://localhost:5000/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      studioId: studio._id,
      user: {
        name: session.user.name,
        email: session.user.email,
      },
      shootDate,
      startTime,
      endTime,
      shootHours,
      crewCount: Number(crewCount),
      gearNotes,
      hourlyRate: studio.hourlyRate,
      shootingCost,
      securityDeposit: studio.securityDeposit,
      totalCost,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Booking failed.");
  }

  toast.success("Booking request submitted successfully!");

  console.log("Booking Result:", result);

  router.push("/my-bookings");

} catch (error) {
  console.error("Booking Error:", error);

  toast.error(
    error instanceof Error
      ? error.message
      : "Failed to submit booking. Please try again."
  );
} finally {
  setIsSubmitting(false);
}
  };

  // Close modal if not open
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-800"
          aria-label="Close booking modal"
        >
          <X size={20} />
        </button>

        {/* Heading */}
        <div className="mb-5 pr-7">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-amber-600">
            Reserve Creative Slot
          </p>

          <h2 className="text-xl font-bold leading-tight text-gray-900 sm:text-2xl">
            {studio.title}
          </h2>

          <p className="mt-2 text-xs text-gray-500">
            Rate: ৳{studio.hourlyRate.toLocaleString("en-BD")}/hr
            {" • "}
            Deposit: ৳
            {studio.securityDeposit.toLocaleString("en-BD")}
          </p>
        </div>

        {/* Booking Form */}
        <div className="space-y-4">

          {/* Shoot Date */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">
              Shoot Date
            </label>

            <input
              type="date"
              value={shootDate}
              min={minDate || undefined}
              onChange={(e) => setShootDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          {/* Start and End Time */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            {/* Start Time */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Start Time
              </label>

              <div className="relative">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 pr-10 text-sm text-gray-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />

                <Clock
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>

            {/* End Time */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                End Time
              </label>

              <div className="relative">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 pr-10 text-sm text-gray-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />

                <Clock
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Crew Count */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">
              Expected Crew / Talent Count (Max {studio.maxCapacity})
            </label>

            <input
              type="number"
              min={1}
              max={studio.maxCapacity}
              value={crewCount}
              onChange={(e) => setCrewCount(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          {/* Gear Notes */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-700">
              Production Requirements / Gear Notes
              <span className="text-gray-400"> (Optional)</span>
            </label>

            <textarea
              rows={3}
              value={gearNotes}
              onChange={(e) => setGearNotes(e.target.value)}
              placeholder="e.g. Bringing high-output lighting, smoke machine, heavy rigging..."
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          {/* Price Summary */}
          <div className="space-y-3 rounded-xl bg-gray-100 p-4">

            <div className="flex justify-between text-xs text-gray-600">
              <span>
                ৳{studio.hourlyRate.toLocaleString("en-BD")} ×{" "}
                {shootHours} shoot hours
              </span>

              <span>
                ৳{shootingCost.toLocaleString("en-BD")}
              </span>
            </div>

            <div className="flex justify-between text-xs text-gray-600">
              <span>Refundable Security Deposit</span>

              <span>
                ৳{studio.securityDeposit.toLocaleString("en-BD")}
              </span>
            </div>

            <div className="flex justify-between border-t border-gray-300 pt-3">
              <span className="text-sm font-bold text-gray-900">
                Total Estimated Cost
              </span>

              <span className="text-base font-bold text-amber-600">
                ৳{totalCost.toLocaleString("en-BD")}
              </span>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={handleBooking}
            disabled={isSubmitting}
            className="w-full rounded-xl bg-amber-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Confirm Booking"}
          </button>

          <p className="text-center text-[11px] text-gray-400">
            Your booking request will be sent to the studio host.
          </p>
        </div>
      </div>
    </div>
  );
}
