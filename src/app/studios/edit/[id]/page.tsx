import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import EditStudioClient from "@/components/studios/EditStudioClient";


type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditStudioPage({ params }: PageProps) {
  const { id } = await params;

  // Private Route: Check logged-in user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/login?callbackURL=/studios/edit/${id}`);
  }

  // Fetch existing studio
 
    const response = await fetch(
      `http://localhost:5000/studios/${id}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      notFound();
    }

    const studio = await response.json();

    // Only the studio owner can edit this listing
    if (studio.host?.email !== session.user.email) {
      redirect("/my-listings");
    }

    return(<EditStudioClient studio={studio}/>);
 
}