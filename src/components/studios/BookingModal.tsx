"use client";


import { useEffect, useState } from "react";
import { X, Sparkles, Clock } from "lucide-react";
import { toast } from "sonner";

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

  if (!isOpen) return null;

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

  // Calculate total price
  const shootingCost = shootHours * studio.hourlyRate;

  const totalCost = shootingCost + studio.securityDeposit;

  // Local date
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const today = new Date();

    const formattedDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    setMinDate(formattedDate);
  }, []);

  // Handle Booking
  const handleBooking = () => {
    if (!shootDate || !startTime || !endTime) {
      toast.error("Please complete all required booking fields.");
      return;
    }

    if (shootDate < minDate) {
      toast.error("Please select a valid booking date.");
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
      toast.error(
        `Crew count must be between 1 and ${studio.maxCapacity}.`
      );
      return;
    }

    toast.success("Booking details are ready!");

    console.log({
      studioId: studio._id,
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
    });

    // Booking API will be connected later.
  };

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

            <div className="relative">
              <input
                type="date"
                min={minDate}
                value={shootDate}
                onChange={(e) => setShootDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </div>
          </div>

          {/* Start and End Time */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Start Time
              </label>

              <div className="relative">
                <Clock
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                End Time
              </label>

              <div className="relative">
                <Clock
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
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
            onClick={handleBooking}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3.5 text-sm font-bold text-gray-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-600 active:scale-[0.99]"
          >
            <Sparkles size={17} />
            Confirm & Send Booking Request
          </button>

          <p className="text-center text-[11px] text-gray-400">
            Your booking request will be sent to the studio host.
          </p>
        </div>
      </div>
    </div>
  );
}