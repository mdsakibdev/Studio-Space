"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  Loader2,
  Building2,
  IndianRupee,
  Eye,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import AddStudioForm, {
  type ExistingStudio,
} from "@/components/studios/AddStudioForm";

type Studio = ExistingStudio;

export default function MyStudioListings() {
  const { data: session, isPending } = authClient.useSession();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [editingStudio, setEditingStudio] = useState<Studio | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // const email = session?.user?.email;

 // Fetch My Studios
useEffect(() => {
  if (isPending || !session?.user) return;

  const fetchMyStudios = async () => {
    try {
      setLoading(true);

      // Get JWT Token
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication required. Please login again.");
      }

      const response = await fetch(
        "http://localhost:5000/my-studios",
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load studios");
      }

      const data: Studio[] = await response.json();
      setStudios(data);
    } catch (error) {
      console.error(error);
      toast.error("Could not load your studio listings");
    } finally {
      setLoading(false);
    }
  };

  fetchMyStudios();
},  [session, isPending]);

// Category names
const categories = useMemo(
  () => [
    "All",
    ...new Set(studios.map((studio) => studio.category)),
  ],
  [studios]
);

// Filter Studios
const filteredStudios = studios.filter((studio) => {
  const searchText = search.toLowerCase();

  const matchesSearch =
    studio.title?.toLowerCase().includes(searchText) ||
    studio.location?.city?.toLowerCase().includes(searchText) ||
    studio.location?.area?.toLowerCase().includes(searchText);

  const matchesCategory =
    categoryFilter === "All" ||
    studio.category === categoryFilter;

  const matchesStatus =
    statusFilter === "All" ||
    (studio.status || "Active").toLowerCase() ===
      statusFilter.toLowerCase();

  return matchesSearch && matchesCategory && matchesStatus;
});

// Edit Studio
const handleEdit = (studio: Studio) => {
  router.push(`/studios/edit/${studio._id}`);
};

// Update Listing After Successful Edit
const handleUpdateSuccess = (updatedStudio: Studio) => {
  setStudios((previous) =>
    previous.map((studio) =>
      studio._id === updatedStudio._id
        ? updatedStudio
        : studio
    )
  );

  setEditingStudio(null);
};

// Delete Studio
const handleDelete = async (studio: Studio) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${studio.title}"?`
  );

  if (!confirmed) return;

  try {
    setDeletingId(studio._id);

    // Get JWT Token
    const { data: tokenData, error: tokenError } =
      await authClient.token();

    if (tokenError || !tokenData?.token) {
      throw new Error("Authentication required. Please login again.");
    }

    const token = tokenData.token;

    const response = await fetch(
      `http://localhost:5000/studios/${studio._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete studio");
    }

    if (result.deletedCount === 0) {
      throw new Error("Studio not found");
    }

    setStudios((previous) =>
      previous.filter((item) => item._id !== studio._id)
    );

    toast.success("Studio deleted successfully!");
  } catch (error) {
    console.error(error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to delete studio"
    );
  } finally {
    setDeletingId(null);
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

// Login Required
if (!session?.user) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Building2 className="mb-4 h-12 w-12 text-primary" />

      <h2 className="text-2xl font-bold text-foreground">
        Login Required
      </h2>

      <p className="mt-2 text-muted-foreground">
        Please login to manage your studio listings.
      </p>

      <Link
        href="/login"
        className="mt-6 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground"
      >
        Login Now
      </Link>
    </div>
  );
}

const activeStudios = studios.filter(
  (studio) => (studio.status || "Active").toLowerCase() === "active"
).length;

const inactiveStudios = studios.filter(
  (studio) => (studio.status || "Active").toLowerCase() !== "active"
).length;

  return (
    <>
      <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Host Dashboard
            </p>

            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              My Studio Listings
            </h1>

            <p className="mt-2 text-muted-foreground">
              Manage and track all your studio listings.
            </p>
          </div>

          <Link
            href="/studios/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="h-5 w-5" />
            Add New Studio
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Total Studios</p>
            <h3 className="mt-2 text-3xl font-bold text-foreground">
              {studios.length}
            </h3>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Active Studios</p>
            <h3 className="mt-2 text-3xl font-bold text-green-500">
              {activeStudios}
            </h3>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Inactive Studios</p>
            <h3 className="mt-2 text-3xl font-bold text-amber-500">
              {inactiveStudios}
            </h3>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 rounded-xl border border-border bg-card p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search studio or location..."
                className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-foreground outline-none focus:border-primary"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All Categories" : category}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Studio Count */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Your Studios
          </h2>

          <p className="text-sm text-muted-foreground">
            {filteredStudios.length} of {studios.length} studios
          </p>
        </div>

        {/* Studio Cards */}
        {filteredStudios.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-5 py-16 text-center">
            <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />

            <h2 className="text-xl font-semibold text-foreground">
              {studios.length === 0
                ? "No Studios Yet"
                : "No Matching Studios"}
            </h2>

            <p className="mt-2 text-muted-foreground">
              {studios.length === 0
                ? "You have not added any studio yet. Start listing your studio today."
                : "Try changing your search or filters."}
            </p>

            {studios.length === 0 && (
              <Link
                href="/studios/new"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
              >
                <Plus className="h-5 w-5" />
                Add Your First Studio
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredStudios.map((studio) => (
              <div
                key={studio._id}
                className="overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/50"
              >
                {/* Image */}
                <div className="relative h-52 bg-muted">
                  {studio.imageUrl ? (
                    <img
                      src={studio.imageUrl}
                      alt={studio.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Building2 className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}

                  <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                      (studio.status || "Active").toLowerCase() === "active"
                        ? "bg-green-500/90 text-white"
                        : "bg-amber-500/90 text-white"
                    }`}
                  >
                    {studio.status || "Active"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {studio.category}
                  </p>

                  <h3 className="mt-2 line-clamp-1 text-xl font-bold text-foreground">
                    {studio.title}
                  </h3>

                  <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {studio.location?.area}, {studio.location?.city}
                  </p>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {studio.overview}
                  </p>

                  {/* Price and Capacity */}
                  <div className="mt-5 grid grid-cols-2 gap-3 border-y border-border py-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Hourly Rate
                      </p>

                      <p className="mt-1 flex items-center font-bold text-primary">
                        <IndianRupee className="h-4 w-4" />
                        {Number(studio.hourlyRate).toLocaleString()}
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                          /hr
                        </span>
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Max Capacity
                      </p>

                      <p className="mt-1 font-bold text-foreground">
                        {studio.maxCapacity} People
                      </p>
                    </div>
                  </div>

                  {/* View Details */}
                  <Link
                    href={`/studios/${studio._id}`}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:bg-primary/10 hover:text-primary"
                  >
                    <Eye className="h-4 w-4" />
                    View Studio
                  </Link>

                  {/* Edit and Delete */}
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(studio)}
                      className="flex items-center justify-center gap-2 rounded-lg border border-border py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:bg-primary/10 hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(studio)}
                      disabled={deletingId === studio._id}
                      className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === studio._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}

                      {deletingId === studio._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Edit Form Modal */}
      {editingStudio && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-3 sm:p-6">
          <div className="mx-auto my-4 w-full max-w-5xl rounded-2xl border border-border bg-background p-4 shadow-2xl sm:my-8 sm:p-7">
            <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Edit Studio
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Update all your studio information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingStudio(null)}
                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Close edit form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <AddStudioForm
              key={editingStudio._id}
              studio={editingStudio}
              onCancel={() => setEditingStudio(null)}
              onSuccess={handleUpdateSuccess}
            />
          </div>
        </div>
      )}
    </>
  );
}
