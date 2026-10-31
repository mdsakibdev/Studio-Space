import { notFound } from "next/navigation";
import StudioDetails from "@/components/studios/StudioDetails";

interface StudioDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudioDetailsPage({
  params,
}: StudioDetailsPageProps) {
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
    console.error("Studio details error:", error);

    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Unable to Load Studio
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please make sure the backend server is running and try again.
          </p>
        </div>
      </div>
    );
  }

  if (!studio) {
    notFound();
  }

  return <StudioDetails studio={studio} />;
}