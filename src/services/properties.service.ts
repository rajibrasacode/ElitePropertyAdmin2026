import {
  PropertiesPayload,
  PropertiesResponse,
  PropertyData,
} from "../types/properties.types";
import { api, privetApi } from "./axios";

// Add Property
export const propertiesService = async (formData: FormData) => {
  try {
    const { data } = await privetApi.post("/properties", formData);
    return data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// GET ALL (WITH PAGINATION + SEARCH)
export const getProperties = async (
  params?: PropertiesPayload,
): Promise<PropertiesResponse> => {
  try {
    const response = await privetApi.get<PropertiesResponse>("/properties", {
      params,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// GET BY ID
export const getPropertyByIdService = async (
  id: number | string,
): Promise<PropertyData | null> => {
  try {
    // console.log(`[Service] Fetching property details for ID: ${id}`);
    const response = await privetApi.get<any>(`/properties/${id}`);
    // console.log("[Service] Raw API Response:", response);

    const rawBody = response.data;

    // Scenario 1: Response has a 'data' field (Standard Wrapper)
    if (rawBody && typeof rawBody === "object" && "data" in rawBody) {
      const innerData = rawBody.data;

      // Case 1a: innerData is an array (e.g. [ { property } ])
      if (Array.isArray(innerData)) {
        return innerData.length > 0 ? innerData[0] : null;
      }

      // Case 1b: innerData is the object itself
      return innerData;
    }

    // Scenario 2: Response IS the array (e.g. [ { property } ])
    if (Array.isArray(rawBody)) {
      return rawBody.length > 0 ? rawBody[0] : null;
    }

    // Scenario 3: Response IS the object directly
    return rawBody as PropertyData;
  } catch (error: any) {
    console.error("[Service Error]", error);
    throw error.response?.data || error;
  }
};

// UPDATE PROPERTY
export const putPropertyByIdService = async (
  id: string | number,
  formData: FormData,
) => {
  try {
    const { data } = await privetApi.put(`/properties/${id}`, formData);
    return data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// DELETE PROPERTY - Fixed to use privetApi consistently
export const deletePropertyByIdService = async (id: string) => {
  try {
    const { data } = await privetApi.delete(`/properties/${id}`);
    return data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// ===============================
// GET MY PENDING PROPERTIES
// GET /properties/my-pending
// ===============================
export const getMyPendingPropertiesService =
  async (): Promise<PropertiesResponse> => {
    try {
      const { data } = await privetApi.get<PropertiesResponse>(
        "/properties/my-pending",
      );
      return data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  };

// GET ALL PENDING PROPERTIES (super_admin only)
// GET /properties/pending
export const getAllPendingPropertiesService =
  async (): Promise<PropertiesResponse> => {
    try {
      const { data } = await privetApi.get<PropertiesResponse>(
        "/properties/pending",
      );
      return data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  };

// GET PENDING PROPERTY BY ID (super_admin only)
// GET /properties/pending/{id}
export const getPendingPropertyByIdService = async (
  id: string | number,
): Promise<PropertyData | null> => {
  try {
    const response = await privetApi.get<any>(`/properties/pending/${id}`);

    const rawBody = response.data;

    if (rawBody && typeof rawBody === "object" && "data" in rawBody) {
      return rawBody.data;
    }

    return rawBody as PropertyData;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// APPROVE PENDING PROPERTY (super_admin only)
export const approvePendingPropertyService = async (id: string | number) => {
  try {
    const { data } = await privetApi.post(`/properties/pending/${id}/approve`);
    return data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// REJECT PENDING PROPERTY (super_admin only)
export const rejectPendingPropertyService = async (id: string | number) => {
  try {
    const { data } = await privetApi.post(`/properties/pending/${id}/reject`);
    return data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
