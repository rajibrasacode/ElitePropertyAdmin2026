"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PropertyForm from "@/components/common/Propertiesform";
import { getRentalByIdService, updateRentalService } from "@/services/rentals.service";
import { propertyToFormData } from "@/utils/propertyFormUtils";
import { mapPropertyFormToRentalPayload, mapRentalToPropertyData } from "@/utils/rentalMapper";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import { PropertyFormData } from "@/utils/propertyFormUtils";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    const msg = (error as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  return fallback;
};

export default function EditRentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<PropertyFormData | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!id) {
        setError("Rental ID missing.");
        setLoading(false);
        return;
      }
      try {
        const rental = await getRentalByIdService(id);
        if (!rental) {
          setError("Rental not found.");
          return;
        }
        const mapped = mapRentalToPropertyData(rental);
        const formData = propertyToFormData(mapped);
        setInitialData({ ...formData, listing_type: "Rent" });
        setExistingImages(mapped.images || []);
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to load rental."));
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const handleSubmit = async (formData: FormData) => {
    if (!id) return;
    try {
      const rentalPayload = mapPropertyFormToRentalPayload(formData);
      const response = await updateRentalService(id, rentalPayload);
      showSuccessToast(response?.message || "Rental updated successfully.");
      router.replace("/properties/rent");
    } catch (err: unknown) {
      showErrorToast(getErrorMessage(err, "Failed to update rental."));
    }
  };

  if (loading) return <div className="py-20 text-center">Loading rental...</div>;
  if (error) return <div className="py-20 text-center text-red-500">{error}</div>;

  return <PropertyForm mode="edit" initialData={initialData} existingImages={existingImages} onSubmit={handleSubmit} backUrl="/properties/rent" />;
}
