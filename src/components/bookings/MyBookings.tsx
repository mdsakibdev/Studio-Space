"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Users,
  Banknote,
  XCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

// shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// বুকিং ডেটার টাইপ ডেফিনিশন
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

// ফিল্টার অপশনসমূহ
const filters = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

export default function MyBookings() {
  const { data: session, isPending } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  // ১. বুকিং ডেটা লোড করার ইফেক্ট
  useEffect(() => {
    if (isPending || !session?.user) return;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const { data: tokenData, error: tokenError } = await authClient.token();

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
        console.error("Fetch bookings error:", error);
        toast.error("Could not load your bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [session, isPending]);

  // ২. বুকিং ক্যানসেল করার ফাংশন
  const handleCancelBooking = async (bookingId: string) => {
    const isSure = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!isSure) return;

    try {
      setCancellingId(bookingId);
      const { data: tokenData, error: tokenError } = await authClient.token();

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

      // ক্যানসেল সফল হলে স্টেট আপডেট করা
      setBookings((prev) =>
        prev.map((item) =>
          item._id === bookingId ? { ...item, status: "Cancelled" } : item
        )
      );

      toast.success("Booking cancelled successfully!");
    } catch (error) {
      console.error("Cancel booking error:", error);
      const message =
        error instanceof Error ? error.message : "Could not cancel booking";
      toast.error(message);
    } finally {
      setCancellingId(null);
    }
  };

  // ৩. সিলেক্ট করা ফিল্টার অনুযায়ী ডেটা ফিল্টারিং
  const filteredBookings = bookings.filter((booking) => {
    if (activeFilter === "All") return true;
    return booking.status?.toLowerCase() === activeFilter.toLowerCase();
  });

  // ৪. স্ট্যাটাস অনুযায়ী shadcn Badge-এর স্টাইল দেওয়া
  const getBadgeVariant = (status: string) => {
    const current = status?.toLowerCase();
    if (current === "confirmed") return "default";
    if (current === "completed") return "secondary";
    if (current === "cancelled") return "destructive";
    return "outline";
  };

  // ৫. লোডার স্টেট
  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ৬. আন-অথেন্টিকেটেড স্টেট
  if (!session?.user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <CalendarDays className="mb-4 h-12 w-12 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Login Required</h2>
        <p className="mt-2 text-muted-foreground">
          Please login to see your bookings.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
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

      {/* Summary Cards with shadcn Card */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { title: "Total Bookings", count: bookings.length },
          {
            title: "Pending",
            count: bookings.filter((b) => b.status === "Pending").length,
          },
          {
            title: "Confirmed",
            count: bookings.filter((b) => b.status === "Confirmed").length,
          },
          {
            title: "Cancelled",
            count: bookings.filter((b) => b.status === "Cancelled").length,
          },
        ].map((stat, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Buttons using shadcn Button */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter)}
            className="rounded-full"
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Booking List */}
      {filteredBookings.length === 0 ? (
        <Card className="px-5 py-16 text-center">
          <CardContent className="flex flex-col items-center">
            <CalendarDays className="mb-4 h-12 w-12 text-muted-foreground" />
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
              className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Explore Studios
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {filteredBookings.map((booking) => (
            <Card key={booking._id} className="overflow-hidden">
              <CardContent className="p-5 sm:p-6">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Booking ID: {booking._id}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-foreground">
                      {booking.studioTitle || "Studio Booking"}
                    </h2>
                  </div>
                  <Badge variant={getBadgeVariant(booking.status)}>
                    {booking.status || "Pending"}
                  </Badge>
                </div>

                {/* Info Grid */}
                <div className="my-5 grid grid-cols-1 gap-4 border-y border-border py-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Shoot Date</p>
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
                      <p className="text-xs text-muted-foreground">Time</p>
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
                    <Banknote className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Total Cost</p>
                      <p className="font-bold text-primary">
                        ৳{Number(booking.totalCost || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gear Notes */}
                {booking.gearNotes && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Gear Notes
                    </p>
                    <p className="mt-1 text-sm text-foreground">
                      {booking.gearNotes}
                    </p>
                  </div>
                )}

                {/* Footer Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <Link
                    href={`/studios/${booking.studioId}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    View Studio
                    <ExternalLink className="h-4 w-4" />
                  </Link>

                  {(booking.status === "Pending" ||
                    booking.status === "Confirmed") && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                      >
                        {cancellingId === booking._id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Booking
                          </>
                        )}
                      </Button>
                    )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}