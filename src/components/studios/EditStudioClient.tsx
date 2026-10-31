"use client";

import { useRouter } from "next/navigation";
import AddStudioForm, {
  type ExistingStudio,
} from "@/components/studios/AddStudioForm";

interface EditStudioClientProps {
  studio: ExistingStudio;
}

export default function EditStudioClient({
  studio,
}: EditStudioClientProps) {
  const router = useRouter();

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <AddStudioForm
        studio={studio}
        onCancel={() => router.back()}
        onSuccess={() => {
          router.replace("/my-listings");
          router.refresh();
        }}
      />
    </main>
  );
}