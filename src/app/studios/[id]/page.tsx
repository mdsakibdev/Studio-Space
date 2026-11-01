
import { notFound } from "next/navigation";
import StudioDetails from "@/components/studios/StudioDetails";

interface StudioDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudioDetailsPage({
  params,
}: StudioDetailsPageProps) {
  const { id } = await params;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!API_URL) {
    console.error("NEXT_PUBLIC_API_URL is not configured.");
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Configuration Error
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            API URL is not configured. Please check your environment variables.
          </p>
        </div>
      </div>
    );
  }

  let response: Response;

  try {
    const baseUrl = API_URL.replace(/\/+$/, "");

    response = await fetch(
      `${baseUrl}/studios/${encodeURIComponent(id)}`,
      {
        cache: "no-store",
      }
    );
  } catch (error) {
    console.error("Studio API connection error:", error);

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

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    console.error(
      "Studio API failed:",
      response.status,
      response.statusText
    );

    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Unable to Load Studio
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong while loading this studio. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const studio = await response.json();

  if (!studio) {
    notFound();
  }

  return <StudioDetails studio={studio} />;
}
