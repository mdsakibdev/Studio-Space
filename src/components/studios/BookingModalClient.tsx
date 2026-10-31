"use client";

import { useRouter } from "next/navigation";
import BookingModal from "./BookingModal";

type BookingModalClientProps = {
  studio: React.ComponentProps<typeof BookingModal>["studio"];
};

export default function BookingModalClient({
  studio,
}: BookingModalClientProps) {
  const router = useRouter();

  return (
    <BookingModal
      studio={studio}
      isOpen={true}
      onClose={() => router.back()}
    />
  );
}