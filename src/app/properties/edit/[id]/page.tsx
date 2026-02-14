"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PropertyForm from "@/components/common/Propertiesform";
import {
  getPropertyByIdService,
  putPropertyByIdService,
} from "@/services/properties.service";
import { propertyToFormData } from "@/utils/propertyFormUtils";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch property data on mount
  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        setError("Property ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const property = await getPropertyByIdService(propertyId);

        if (property) {
          // Convert property data to form data format
          const formData = propertyToFormData(property);
          setInitialData(formData);

          // Store existing images separately
          if (property.images && Array.isArray(property.images)) {
            setExistingImages(property.images);
          }
        } else {
          setError("Property not found");
        }
      } catch (err: any) {
        console.error("Error fetching property:", err);
        setError(err.message || "Failed to load property data");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleSubmit = async (formData: FormData) => {
    if (!propertyId) {
      showErrorToast("Property ID is missing");
      return;
    }

    try {
      const response = await putPropertyByIdService(propertyId, formData);

      showSuccessToast(response.message || "Property updated successfully");
      router.replace("/properties");
    } catch (error: any) {
      console.error("Error updating property:", error);
      showErrorToast(error.message || "Failed to update property");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push("/properties")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <PropertyForm
      mode="edit"
      initialData={initialData}
      existingImages={existingImages}
      onSubmit={handleSubmit}
      backUrl="/properties"
    />
  );
}
