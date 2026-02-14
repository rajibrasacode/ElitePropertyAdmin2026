"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PropertyForm from "@/components/common/Propertiesform";
import { propertiesService } from "@/services/properties.service";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
export default function AddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true);

      formData.append("listing_date", new Date().toISOString().split("T")[0]);

      const response = await propertiesService(formData);

      showSuccessToast(response.message);
      router.replace("/properties");
    } catch (error: any) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PropertyForm
      mode="add"
      onSubmit={handleSubmit}
      loading={loading}
      backUrl="/properties"
    />
  );
}
