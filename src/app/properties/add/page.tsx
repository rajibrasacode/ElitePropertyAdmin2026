"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  MdSave,
  MdLocationOn,
  MdHome,
  MdAttachMoney,
  MdBuild,
  MdCalendarToday,
  MdBathtub,
  MdSquareFoot,
  MdGarage,
  MdDirectionsCar,
  MdAspectRatio,
  MdConstruction,
  MdBrush,
  MdRealEstateAgent,
  MdApartment,
  MdMap,
  MdPlace,
  MdLocalOffer,
  MdMoneyOff,
  MdKingBed,
} from "react-icons/md";
import * as yup from "yup";
import {
  propertyListingSchema,
  propertyListingDefaultValues,
  propertyTypeOptions,
  roofStatusOptions,
  interiorConditionOptions,
  transactionTypeOptions,
  type PropertyListingData,
} from "./utility";
import { PageHeader } from "@/components/common/Pageheader";
import { Button } from "@/components/common/Button";
import { TextArea } from "@/components/common/Textarea";
import { CheckboxButton } from "@/components/common/Checkboxbutton";
import { InputField } from "@/components/common/InputField";
import { TextInput } from "@/components/common/Textinput";
import { SelectInput } from "@/components/common/Selectinput";
import { FileUpload } from "@/components/common/Fileupload";
import { SectionCard } from "@/components/common/Sectioncard";
import {
  propertiesService,
  putPropertyByIdService,
  getPropertyByIdService,
} from "@/services/properties.service";
import { PropertyData } from "@/types/properties.types";

// Error display component
const ErrorMessage = ({ error }: { error?: string }) => {
  if (!error) return null;
  return <p className="mt-1 text-xs text-red-600">{error}</p>;
};

export default function PropertyFormPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id as string | undefined;
  const isEditMode = !!propertyId;

  const [formData, setFormData] = useState({
    street_address: "",
    unit_apt: "",
    city: "",
    state: "",
    zip_code: "",
    county: "",
    property_type: "",
    bedrooms: "",
    bathrooms: "",
    square_feet: "",
    lot_size: "",
    year_built: "",
    garage_spaces: "",
    parking_spaces: "",
    roof_age: "",
    roof_status: "",
    interior_condition: "",
    exterior_paint_required: false,
    new_floor_required: false,
    kitchen_renovation_required: false,
    bathroom_renovation_required: false,
    drywall_repair_required: false,
    interior_paint_required: false,
    listing_price: "",
    asking_price: "",
    arv: "",
    repair_estimate: "",
    holding_costs: "",
    assignment_fee: "",
    transaction_type: "",
    property_description: "",
    seller_notes: "",
    images: [] as File[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch property data if in edit mode
  // useEffect(() => {
  //   if (isEditMode && propertyId) {
  //     fetchPropertyData(propertyId);
  //   }
  // }, [isEditMode, propertyId]);

  // const fetchPropertyData = async (id: string) => {
  //   setIsLoading(true);
  //   try {
  //     const propertyData: PropertyData = await getPropertyByIdService(id);

  //     console.log("Fetched property data:", propertyData); // Debug log

  //     // Populate form with existing data
  //     setFormData({
  //       street_address: propertyData.street_address || "",
  //       unit_apt: propertyData.unit_apt || "",
  //       city: propertyData.city || "",
  //       state: propertyData.state || "",
  //       zip_code: propertyData.zip_code || "",
  //       county: propertyData.county || "",
  //       property_type: propertyData.property_type || "",
  //       bedrooms: String(propertyData.bedrooms || ""),
  //       bathrooms: String(propertyData.bathrooms || ""),
  //       square_feet: String(propertyData.square_feet || ""),
  //       lot_size: propertyData.lot_size || "",
  //       year_built: String(propertyData.year_built || ""),
  //       garage_spaces: String(propertyData.garage_spaces || ""),
  //       parking_spaces: String(propertyData.parking_spaces || ""),
  //       roof_age: propertyData.roof_age || "",
  //       roof_status: propertyData.roof_status || "",
  //       interior_condition: propertyData.interior_condition || "",
  //       exterior_paint_required: propertyData.exterior_paint_required || false,
  //       new_floor_required: propertyData.new_floor_required || false,
  //       kitchen_renovation_required:
  //         propertyData.kitchen_renovation_required || false,
  //       bathroom_renovation_required:
  //         propertyData.bathroom_renovation_required || false,
  //       drywall_repair_required: propertyData.drywall_repair_required || false,
  //       interior_paint_required: propertyData.interior_paint_required || false,
  //       listing_price: String(propertyData.listing_price || ""),
  //       asking_price: String(propertyData.asking_price || ""),
  //       arv: String(propertyData.arv || ""),
  //       repair_estimate: String(propertyData.repair_estimate || ""),
  //       holding_costs: String(propertyData.holding_costs || ""),
  //       assignment_fee: String(propertyData.assignment_fee || ""),
  //       transaction_type: propertyData.transaction_type || "",
  //       property_description: propertyData.property_description || "",
  //       seller_notes: propertyData.seller_notes || "",
  //       images: [], // Keep empty for new images, existing images are already on server
  //     });
  //   } catch (error: any) {
  //     console.error("Error fetching property data:", error);
  //     const errorMessage =
  //       error?.message ||
  //       error?.error ||
  //       "Failed to load property data. Please try again.";
  //     alert(errorMessage);
  //     router.push("/properties");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files)
      setFormData((prev) => ({
        ...prev,
        images: Array.from(e.target.files || []),
      }));
    // Clear error for images field
    if (errors.images) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Prepare data for validation - convert empty strings to appropriate types
      const dataToValidate = {
        ...formData,
        listing_date: new Date().toISOString().split("T")[0],
        bedrooms: formData.bedrooms === "" ? 0 : Number(formData.bedrooms),
        bathrooms: formData.bathrooms === "" ? 0 : Number(formData.bathrooms),
        square_feet:
          formData.square_feet === "" ? 0 : Number(formData.square_feet),
        year_built:
          formData.year_built === ""
            ? new Date().getFullYear()
            : Number(formData.year_built),
        garage_spaces:
          formData.garage_spaces === "" ? 0 : Number(formData.garage_spaces),
        parking_spaces:
          formData.parking_spaces === "" ? 0 : Number(formData.parking_spaces),
        listing_price:
          formData.listing_price === "" ? 0 : Number(formData.listing_price),
        asking_price:
          formData.asking_price === "" ? 0 : Number(formData.asking_price),
        arv: formData.arv === "" ? 0 : Number(formData.arv),
        repair_estimate:
          formData.repair_estimate === ""
            ? 0
            : Number(formData.repair_estimate),
        holding_costs:
          formData.holding_costs === "" ? 0 : Number(formData.holding_costs),
        assignment_fee:
          formData.assignment_fee === "" ? 0 : Number(formData.assignment_fee),
      };

      // Validate against schema
      await propertyListingSchema.validate(dataToValidate, {
        abortEarly: false,
      });

      // Prepare FormData for API submission
      const apiFormData = new FormData();

      // Text fields
      const textFields = [
        "street_address",
        "unit_apt",
        "city",
        "state",
        "zip_code",
        "county",
        "property_type",
        "lot_size",
        "roof_age",
        "roof_status",
        "interior_condition",
        "transaction_type",
        "property_description",
        "seller_notes",
      ];

      textFields.forEach((field) => {
        apiFormData.append(field, (formData as any)[field]);
      });

      // Number fields
      const numberFields = [
        "bedrooms",
        "bathrooms",
        "square_feet",
        "year_built",
        "garage_spaces",
        "parking_spaces",
        "listing_price",
        "asking_price",
        "arv",
        "repair_estimate",
        "holding_costs",
        "assignment_fee",
      ];

      numberFields.forEach((field) => {
        const value = (dataToValidate as any)[field];
        apiFormData.append(field, String(value));
      });

      // Boolean fields
      const booleanFields = [
        "exterior_paint_required",
        "new_floor_required",
        "kitchen_renovation_required",
        "bathroom_renovation_required",
        "drywall_repair_required",
        "interior_paint_required",
      ];

      booleanFields.forEach((field) => {
        apiFormData.append(field, String((formData as any)[field]));
      });

      // Listing date
      apiFormData.append("listing_date", dataToValidate.listing_date);

      // Images
      formData.images.forEach((image) => {
        apiFormData.append("images", image);
      });

      // Submit to API
      if (isEditMode && propertyId) {
        // Update existing property
        await putPropertyByIdService(propertyId, apiFormData);
        alert("Property updated successfully!");
      } else {
        // Create new property
        await propertiesService(apiFormData);
        alert("Property created successfully!");
      }

      // Redirect to properties list
      router.push("/properties");
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        // Collect all validation errors
        const validationErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path] = error.message;
          }
        });
        setErrors(validationErrors);

        // Scroll to first error
        const firstErrorField = Object.keys(validationErrors)[0];
        const errorElement = document.querySelector(
          `[name="${firstErrorField}"]`,
        );
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        alert("Please fix the validation errors before submitting.");
      } else {
        console.error("API error:", err);
        alert(
          `Failed to ${isEditMode ? "update" : "create"} property. Please try again.`,
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const MdPinDropIcon = MdLocationOn;

  // Helper function to get error message for a field
  const getFieldError = (fieldName: string) => errors[fieldName];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading property data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto pb-20 fade-in-up">
      <PageHeader
        backLink="/properties"
        title={isEditMode ? "Edit Property" : "Add New Property"}
        subtitle={
          isEditMode ? "Update property details" : "Create a new listing"
        }
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => router.push("/properties")}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              icon={<MdSave size={18} />}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Saving..."
                : isEditMode
                  ? "Update Property"
                  : "Save Property"}
            </Button>
          </>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ADDRESS & SPECS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <SectionCard stepNumber={1} title="Property Address">
            <div className="grid grid-cols-12 gap-x-4 gap-y-5">
              <div className="col-span-12 lg:col-span-8">
                <InputField
                  label="Street Address"
                  icon={<MdLocationOn />}
                  required
                >
                  <TextInput
                    required
                    name="street_address"
                    placeholder="123 Main St"
                    value={formData.street_address}
                    onChange={handleChange}
                  />
                </InputField>
                <ErrorMessage error={getFieldError("street_address")} />
              </div>
              <div className="col-span-12 lg:col-span-4">
                <InputField label="Unit/Apt" icon={<MdApartment />} required>
                  <TextInput
                    required
                    name="unit_apt"
                    placeholder="Apt 4B"
                    value={formData.unit_apt}
                    onChange={handleChange}
                  />
                </InputField>
                <ErrorMessage error={getFieldError("unit_apt")} />
              </div>

              <div className="col-span-12 sm:col-span-6">
                <InputField label="City" icon={<MdLocationOn />} required>
                  <TextInput
                    required
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </InputField>
                <ErrorMessage error={getFieldError("city")} />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <InputField label="County" icon={<MdMap />} required>
                  <TextInput
                    required
                    name="county"
                    placeholder="County"
                    value={formData.county}
                    onChange={handleChange}
                  />
                </InputField>
                <ErrorMessage error={getFieldError("county")} />
              </div>

              <div className="col-span-6 sm:col-span-6">
                <InputField label="State" icon={<MdPlace />} required>
                  <TextInput
                    required
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </InputField>
                <ErrorMessage error={getFieldError("state")} />
              </div>
              <div className="col-span-6 sm:col-span-6">
                <InputField label="Zip Code" icon={<MdPinDropIcon />} required>
                  <TextInput
                    required
                    name="zip_code"
                    placeholder="Zip"
                    value={formData.zip_code}
                    onChange={handleChange}
                  />
                </InputField>
                <ErrorMessage error={getFieldError("zip_code")} />
              </div>
            </div>
          </SectionCard>

          <SectionCard stepNumber={2} title="Property Specs">
            <div className="grid grid-cols-12 gap-x-4 gap-y-5">
              <div className="col-span-12 sm:col-span-6">
                <InputField label="Property Type" icon={<MdHome />} required>
                  <SelectInput
                    required
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleChange}
                    options={propertyTypeOptions.map((opt) => opt.value)}
                  />
                </InputField>
                <ErrorMessage error={getFieldError("property_type")} />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <InputField
                  label="Year Built"
                  icon={<MdCalendarToday />}
                  required
                >
                  <TextInput
                    required
                    type="number"
                    name="year_built"
                    placeholder="2020"
                    value={formData.year_built}
                    onChange={handleChange}
                  />
                </InputField>
                <ErrorMessage error={getFieldError("year_built")} />
              </div>
              <div className="col-span-12 sm:col-span-4">
                <InputField label="Lot Size" icon={<MdAspectRatio />} required>
                  <TextInput
                    required
                    name="lot_size"
                    placeholder="0.25 acres"
                    value={formData.lot_size}
                    onChange={handleChange}
                  />
                </InputField>
                <ErrorMessage error={getFieldError("lot_size")} />
              </div>

              <div className="col-span-12 sm:col-span-4">
                <InputField label="Bedrooms" icon={<MdKingBed />} required>
                  <TextInput
                    required
                    type="number"
                    name="bedrooms"
                    placeholder="3"
                    value={formData.bedrooms}
                    onChange={handleChange}
                  />
                </InputField>
                <ErrorMessage error={getFieldError("bedrooms")} />
              </div>
              <div className="col-span-12 sm:col-span-4">
                <InputField label="Bathrooms" icon={<MdBathtub />} required>
                  <TextInput
                    required
                    type="number"
                    name="bathrooms"
                    placeholder="2"
                    value={formData.bathrooms}
                    onChange={handleChange}
                  />
                </InputField>
                <ErrorMessage error={getFieldError("bathrooms")} />
              </div>

              <div className="col-span-12 sm:col-span-4">
                <InputField
                  label="Square Feet"
                  icon={<MdSquareFoot />}
                  required
                >
                  <TextInput
                    required
                    type="number"
                    name="square_feet"
                    placeholder="1500"
                    value={formData.square_feet}
                    onChange={handleChange}
                  />
                </InputField>
                <ErrorMessage error={getFieldError("square_feet")} />
              </div>

              <div className="col-span-6 sm:col-span-4">
                <InputField label="Garage" icon={<MdGarage />}>
                  <TextInput
                    required
                    type="number"
                    name="garage_spaces"
                    placeholder="2"
                    value={formData.garage_spaces}
                    onChange={handleChange}
                  />
                </InputField>
                <ErrorMessage error={getFieldError("garage_spaces")} />
              </div>
              <div className="col-span-6 sm:col-span-4">
                <InputField label="Parking" icon={<MdDirectionsCar />}>
                  <TextInput
                    required
                    type="number"
                    name="parking_spaces"
                    placeholder="4"
                    value={formData.parking_spaces}
                    onChange={handleChange}
                  />
                </InputField>
                <ErrorMessage error={getFieldError("parking_spaces")} />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* CONDITION & FINANCIALS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <SectionCard
            stepNumber={3}
            title="Condition"
            bgColor="bg-orange-50"
            textColor="text-orange-600"
          >
            <div className="grid grid-cols-12 gap-x-4 gap-y-5 mb-5">
              <div className="col-span-12 sm:col-span-6">
                <InputField
                  label="Roof Age"
                  required
                  icon={<MdCalendarToday />}
                >
                  <TextInput
                    required
                    name="roof_age"
                    placeholder="Yr"
                    value={formData.roof_age}
                    onChange={handleChange}
                  />
                </InputField>
                <ErrorMessage error={getFieldError("roof_age")} />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <InputField
                  label="Roof Status"
                  required
                  icon={<MdConstruction />}
                >
                  <SelectInput
                    required
                    name="roof_status"
                    value={formData.roof_status}
                    onChange={handleChange}
                    options={roofStatusOptions.map((opt) => opt.value)}
                  />
                </InputField>
                <ErrorMessage error={getFieldError("roof_status")} />
              </div>
              <div className="col-span-12">
                <InputField label="Interior Condition" icon={<MdBrush />}>
                  <SelectInput
                    required
                    name="interior_condition"
                    value={formData.interior_condition}
                    onChange={handleChange}
                    options={interiorConditionOptions.map((opt) => opt.value)}
                  />
                </InputField>
                <ErrorMessage error={getFieldError("interior_condition")} />
              </div>
            </div>

            <div className="flex-1">
              <InputField label="Renovations Required?">
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { name: "exterior_paint_required", label: "Ext. Paint" },
                    { name: "new_floor_required", label: "New Floors" },
                    { name: "kitchen_renovation_required", label: "Kitchen" },
                    {
                      name: "bathroom_renovation_required",
                      label: "Bathrooms",
                    },
                    { name: "drywall_repair_required", label: "Drywall" },
                    { name: "interior_paint_required", label: "Int. Paint" },
                  ].map((item) => (
                    <CheckboxButton
                      key={item.name}
                      name={item.name}
                      label={item.label}
                      checked={(formData as any)[item.name]}
                      onChange={handleCheckboxChange}
                    />
                  ))}
                </div>
              </InputField>
            </div>
          </SectionCard>

          <SectionCard
            stepNumber={4}
            title="Financials"
            bgColor="bg-emerald-50"
            textColor="text-emerald-600"
          >
            <div className="grid grid-cols-12 gap-x-4 gap-y-5">
              <div className="col-span-12 sm:col-span-6">
                <InputField
                  label="Listing Price"
                  icon={<span className="font-bold">$</span>}
                  required
                >
                  <TextInput
                    required
                    type="number"
                    name="listing_price"
                    placeholder="0"
                    value={formData.listing_price}
                    onChange={handleChange}
                    style={{ fontWeight: "bold" }}
                  />
                </InputField>
                <ErrorMessage error={getFieldError("listing_price")} />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <InputField
                  label="Asking Price"
                  icon={<span className="font-bold">$</span>}
                  required
                >
                  <TextInput
                    required
                    type="number"
                    name="asking_price"
                    placeholder="0"
                    value={formData.asking_price}
                    onChange={handleChange}
                    style={{ fontWeight: "bold" }}
                  />
                </InputField>
                <ErrorMessage error={getFieldError("asking_price")} />
              </div>

              <div className="col-span-12">
                <InputField
                  label="Transaction Type"
                  icon={<MdRealEstateAgent />}
                  required
                >
                  <SelectInput
                    required
                    name="transaction_type"
                    value={formData.transaction_type}
                    onChange={handleChange}
                    options={transactionTypeOptions.map((opt) => opt.value)}
                  />
                </InputField>
                <ErrorMessage error={getFieldError("transaction_type")} />
              </div>

              {[
                { n: "arv", l: "ARV", i: <MdLocalOffer /> },
                { n: "repair_estimate", l: "Repair Estimate", i: <MdBuild /> },
                { n: "holding_costs", l: "Holding Costs", i: <MdMoneyOff /> },
                {
                  n: "assignment_fee",
                  l: "Assignment Fee",
                  i: <MdAttachMoney />,
                },
              ].map((f) => (
                <div key={f.n} className="col-span-12 sm:col-span-6">
                  <InputField label={f.l} icon={f.i} required>
                    <TextInput
                      required
                      type="number"
                      name={f.n}
                      placeholder="0"
                      value={(formData as any)[f.n]}
                      onChange={handleChange}
                    />
                  </InputField>
                  <ErrorMessage error={getFieldError(f.n)} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* INFO & IMAGES */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <SectionCard
            stepNumber={5}
            title="Additional Info"
            bgColor="bg-gray-100"
            textColor="text-gray-600"
          >
            <div className="flex flex-col gap-5 flex-1">
              <div className="flex-1">
                <InputField label="Property Description">
                  <TextArea
                    name="property_description"
                    placeholder="Description..."
                    value={formData.property_description}
                    onChange={handleChange}
                    className="h-24"
                  />
                </InputField>
                <ErrorMessage error={getFieldError("property_description")} />
              </div>
              <div className="flex-1">
                <InputField label="Seller Notes (Private)">
                  <TextArea
                    name="seller_notes"
                    placeholder="Notes..."
                    value={formData.seller_notes}
                    onChange={handleChange}
                    className="h-20"
                  />
                </InputField>
                <ErrorMessage error={getFieldError("seller_notes")} />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            stepNumber={6}
            title="Property Images"
            bgColor="bg-indigo-50"
            textColor="text-indigo-600"
          >
            <FileUpload
              id="file-upload-smart"
              onChange={handleFileChange}
              fileCount={formData.images.length}
            />
            {isEditMode && formData.images.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">
                No new images selected. Existing images will be preserved.
              </p>
            )}
            <ErrorMessage error={getFieldError("images")} />
          </SectionCard>
        </div>
      </form>
    </div>
  );
}
