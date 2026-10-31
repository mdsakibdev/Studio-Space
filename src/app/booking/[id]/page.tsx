import { notFound } from "next/navigation";
import BookingModalClient from "@/components/studios/BookingModalClient";

interface BookingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BookingPage({
  params,
}: BookingPageProps) {
  const { id } = await params;

  let studio = null;

  try {
    const response = await fetch(
      `http://localhost:5000/studios/${id}`,
      {
        cache: "no-store",
      }
    );

    if (response.status === 404) {
      notFound();
    }

    if (!response.ok) {
      throw new Error("Failed to fetch studio");
    }

    studio = await response.json();
  } catch (error) {
    console.error("Studio fetch error:", error);

    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <p className="text-muted-foreground">
          Unable to load studio. Please try again.
        </p>
      </div>
    );
  }

  if (!studio) {
    notFound();
  }

  return <BookingModalClient studio={studio} />;
}