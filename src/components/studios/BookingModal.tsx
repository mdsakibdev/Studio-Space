
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
  const router = useRouter();

  const { data: session } = authClient.useSession();

  const [shootDate, setShootDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [crewCount, setCrewCount] = useState("4");
  const [gearNotes, setGearNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Today's local date
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

  // Calculate booking price
  const shootingCost = shootHours * studio.hourlyRate;
  const totalCost = shootingCost + studio.securityDeposit;

  // Currency formatter
  const formatPrice = (amount: number) =>
    amount.toLocaleString("en-BD");

  // Handle booking
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
      toast.error(
        `Crew count must be between 1 and ${studio.maxCapacity}.`
      );
      return;
    }

    if (!session?.user) {
      toast.error("Please login to book this studio.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Get JWT token
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error(
          "Authentication required. Please login again."
        );
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
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
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking failed.");
      }

      toast.success("Booking request submitted successfully!");

      onClose();
      router.push("/my-bookings");
      router.refresh();

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-xl">

        {/* Header */}
        <div className="border-b px-5 py-5 sm:px-7">
          <DialogHeader className="space-y-2 pr-6 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
              Reserve Creative Slot
            </p>

            <DialogTitle className="text-xl font-bold sm:text-2xl">
              {studio.title}
            </DialogTitle>

            <DialogDescription className="text-sm text-gray-500">
              Rate: ৳{formatPrice(studio.hourlyRate)}/hr
              {" • "}
              Deposit: ৳{formatPrice(studio.securityDeposit)}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form */}
        <div className="space-y-5 px-5 py-5 sm:px-7">

          {/* Shoot Date */}
          <div className="space-y-2">
            <Label htmlFor="shootDate">
              Shoot Date <span className="text-red-500">*</span>
            </Label>

            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <Input
                id="shootDate"
                type="date"
                min={minDate}
                value={shootDate}
                onChange={(e) => setShootDate(e.target.value)}
                className="h-11 pl-10"
              />
            </div>
          </div>

          {/* Start & End Time */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="space-y-2">
              <Label htmlFor="startTime">
                Start Time <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-11 pr-10"
                />

                <Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">
                End Time <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="h-11 pr-10"
                />

                <Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Crew Count */}
          <div className="space-y-2">
            <Label htmlFor="crewCount">
              Expected Crew / Talent Count
            </Label>

            <div className="relative">
              <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <Input
                id="crewCount"
                type="number"
                min={1}
                max={studio.maxCapacity}
                value={crewCount}
                onChange={(e) => setCrewCount(e.target.value)}
                className="h-11 pl-10"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Maximum capacity: {studio.maxCapacity} people
            </p>
          </div>

          {/* Gear Notes */}
          <div className="space-y-2">
            <Label htmlFor="gearNotes">
              Production Requirements / Gear Notes
              <span className="ml-1 font-normal text-muted-foreground">
                (Optional)
              </span>
            </Label>

            <Textarea
              id="gearNotes"
              rows={3}
              value={gearNotes}
              onChange={(e) => setGearNotes(e.target.value)}
              placeholder="e.g. Bringing high-output lighting, smoke machine, heavy rigging..."
              className="resize-none"
            />
          </div>

          {/* Price Summary */}
          <div className="space-y-3 rounded-xl border bg-muted/40 p-4">

            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">
                Shooting Cost ({shootHours} hours)
              </span>

              <span className="font-medium text-foreground">
                ৳{formatPrice(shootingCost)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">
                Refundable Security Deposit
              </span>

              <span className="font-medium text-foreground">
                ৳{formatPrice(studio.securityDeposit)}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-foreground">
                Total Estimated Cost
              </span>

              <span className="text-lg font-bold text-amber-600">
                ৳{formatPrice(totalCost)}
              </span>
            </div>
          </div>

          {/* Confirm Booking */}
          <Button
            type="button"
            onClick={handleBooking}
            disabled={isSubmitting}
            className="h-12 w-full bg-amber-600 text-sm font-semibold text-white hover:bg-amber-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Your booking request will be sent to the studio host.
          </p>

        </div>
      </DialogContent>
    </Dialog>
  );
}
