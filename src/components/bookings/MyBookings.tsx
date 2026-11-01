"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Users,
  MapPin,
  XCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface Booking {
  _id: string;
  studioId: string;
  studioTitle?: string;
  shootDate: string;
  startTime: string;
  endTime: string;
  shootHours: number;
  crewCount: number;
  gearNotes?: string;
  totalCost: number;
  status: string;
}

const filters = [
  "All",
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

export default function MyBookings() {
  const { data: session, isPending } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");



  // Get user's bookings
  // Fetch My Bookings
useEffect(() => {
  if (isPending || !session?.user) return;

  const fetchBookings = async () => {
    try {
      setLoading(true);

      // Get JWT Token
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication required. Please login again.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load bookings");
      }

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error(error);
      toast.error("Could not load your bookings");
    } finally {
      setLoading(false);
    }
  };

  fetchBookings();
}, [session, isPending]);

// Cancel Booking
const handleCancelBooking = async (bookingId: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this booking?"
  );

  if (!confirmed) return;

  try {
    setCancellingId(bookingId);

    // Get JWT Token
    const { data: tokenData, error: tokenError } =
      await authClient.token();

    if (tokenError || !tokenData?.token) {
      throw new Error("Authentication required. Please login again.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/cancel`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to cancel booking");
    }

    // Update booking status immediately
    setBookings((previousBookings) =>
      previousBookings.map((booking) =>
        booking._id === bookingId
          ? { ...booking, status: "Cancelled" }
          : booking
      )
    );

    toast.success("Booking cancelled successfully!");
  } catch (error) {
    console.error(error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Could not cancel booking"
    );
  } finally {
    setCancellingId(null);
  }
};

  // Filter bookings
  const filteredBookings =
    activeFilter === "All"
      ? bookings
      : bookings.filter(
          (booking) =>
            booking.status?.toLowerCase() === activeFilter.toLowerCase()
        );

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-500/10 text-green-500";
      case "completed":
        return "bg-blue-500/10 text-blue-500";
      case "cancelled":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-amber-500/10 text-amber-500";
    }
  };

  // Loading
  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Login required
  if (!session?.user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <CalendarDays className="mb-4 h-12 w-12 text-primary" />

        <h2 className="text-2xl font-bold text-foreground">
          Login Required
        </h2>

        <p className="mt-2 text-muted-foreground">
          Please login to see your bookings.
        </p>

        <Link
          href="/login"
          className="mt-6 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
          Your Activities
        </p>

        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          My Bookings
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage and track all your studio bookings.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Total Bookings",
            value: bookings.length,
          },
          {
            label: "Pending",
            value: bookings.filter((b) => b.status === "Pending").length,
          },
          {
            label: "Confirmed",
            value: bookings.filter((b) => b.status === "Confirmed").length,
          },
          {
            label: "Cancelled",
            value: bookings.filter((b) => b.status === "Cancelled").length,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border bg-card p-4 sm:p-5"
          >
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <h3 className="mt-2 text-2xl font-bold text-foreground">
              {item.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeFilter === filter
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Booking List */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card px-5 py-16 text-center">
          <CalendarDays className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />

          <h2 className="text-xl font-semibold text-foreground">
            No Bookings Found
          </h2>

          <p className="mt-2 text-muted-foreground">
            {activeFilter === "All"
              ? "You have not booked any studio yet."
              : `You do not have any ${activeFilter.toLowerCase()} bookings.`}
          </p>

          <Link
            href="/studios"
            className="mt-6 inline-flex rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Explore Studios
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="flex flex-col gap-4 p-5 sm:p-6">
                {/* Booking Header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Booking ID: {booking._id}
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-foreground">
                      {booking.studioTitle || "Studio Booking"}
                    </h2>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                      booking.status
                    )}`}
                  >
                    {booking.status || "Pending"}
                  </span>
                </div>

                {/* Booking Information */}
                <div className="grid grid-cols-1 gap-4 border-y border-border py-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Shoot Date
                      </p>
                      <p className="font-medium text-foreground">
                        {new Date(
                          booking.shootDate + "T00:00:00"
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Time
                      </p>
                      <p className="font-medium text-foreground">
                        {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Crew & Duration
                      </p>
                      <p className="font-medium text-foreground">
                        {booking.crewCount} People · {booking.shootHours} Hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Total Cost
                      </p>
                      <p className="font-bold text-primary">
                        ৳{Number(booking.totalCost || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gear Notes */}
                {booking.gearNotes && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      Gear Notes
                    </p>
                    <p className="mt-1 text-sm text-foreground">
                      {booking.gearNotes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href={`/studios/${booking.studioId}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    View Studio
                    <ExternalLink className="h-4 w-4" />
                  </Link>

                  {(booking.status === "Pending" ||
                    booking.status === "Confirmed") && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {cancellingId === booking._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}

                      {cancellingId === booking._id
                        ? "Cancelling..."
                        : "Cancel Booking"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}