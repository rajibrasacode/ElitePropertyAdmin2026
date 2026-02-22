"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PropertyForm from "@/components/common/Propertiesform";
import { createRentalService } from "@/services/rentals.service";
import { getInitialFormData } from "@/utils/propertyFormUtils";
import { mapPropertyFormToRentalPayload } from "@/utils/rentalMapper";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    const msg = (error as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  return fallback;
};

export default function AddRentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const initialData = useMemo(() => ({ ...getInitialFormData(), listing_type: "Rent" as const }), []);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const rentalPayload = mapPropertyFormToRentalPayload(formData);
      const response = await createRentalService(rentalPayload);
      showSuccessToast(response?.message || "Rental created successfully.");
      router.replace("/properties/rent");
    } catch (error: unknown) {
      showErrorToast(getErrorMessage(error, "Failed to create rental."));
    } finally {
      setLoading(false);
    }
  };

  return <PropertyForm mode="add" initialData={initialData} onSubmit={handleSubmit} loading={loading} backUrl="/properties/rent" />;
}
