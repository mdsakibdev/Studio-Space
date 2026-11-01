import { notFound } from "next/navigation";
import StudioDetails from "@/components/studios/StudioDetails";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface StudioDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudioDetailsPage({params,}: StudioDetailsPageProps) {
  const { id } = await params;

  const jwtToken = await auth.api.getToken({
    headers: await headers(),
  })
  console.log("JWT Token:", jwtToken?.token);
  const token = jwtToken?.token;

  let studio = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/studios/${id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        }
      },
      
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