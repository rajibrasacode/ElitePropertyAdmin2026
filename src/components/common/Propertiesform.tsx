"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  MdLocalOffer,
  MdMoneyOff,
  MdApartment,
  MdMap,
  MdPlace,
  MdKingBed,
} from "react-icons/md";
import {
  propertyTypeOptions,
  roofStatusOptions,
  interiorConditionOptions,
  transactionTypeOptions,
  PropertyFormData,
  getInitialFormData,
} from "@/utils/propertyFormUtils";
import { PageHeader } from "@/components/common/Pageheader";
import { SectionCard } from "@/components/common/Sectioncard";
import { InputField } from "@/components/common/InputField";
import { TextInput } from "@/components/common/Textinput";
import { SelectInput } from "@/components/common/Selectinput";
import { TextArea } from "@/components/common/Textarea";
import { CheckboxButton } from "@/components/common/Checkboxbutton";
import { FileUpload } from "@/components/common/Fileupload";
import { Button } from "@/components/common/Button";
import { ErrorMessage } from "./ErrorMessage";

const MdPinDropIcon = MdLocationOn;

interface PropertyFormProps {
  mode: "add" | "edit";
  initialData?: any;
  existingImages?: string[];
  onSubmit: (formData: FormData) => Promise<void>;
  loading?: boolean;
  backUrl?: string;
}

export default function PropertyForm({
  mode,
  initialData,
  existingImages: initialExistingImages = [],
  onSubmit,
  loading = false,
  backUrl = "/properties",
}: PropertyFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState<PropertyFormData>(
    initialData ? initialData : getInitialFormData(),
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
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
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({ ...prev, images: files }));
      // Clear error when files are selected
      if (errors.images) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.images;
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setErrors({});

      // Create FormData for submission
      const submitFormData = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (key !== "images") {
          const value = formData[key as keyof PropertyFormData];
          if (value !== null && value !== undefined && value !== "") {
            submitFormData.append(key, value.toString());
          }
        }
      });

      // Add images
      if (formData.images && Array.isArray(formData.images)) {
        (formData.images as File[]).forEach((file) => {
          submitFormData.append("images", file);
        });
      }

      // Call the onSubmit callback
      await onSubmit(submitFormData);
    } catch (error: any) {
      console.error("Form submission error:", error);

      // Handle validation errors
      if (error.errors) {
        setErrors(error.errors);
      } else {
        alert(error.message || "Failed to submit form. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return errors[fieldName];
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-20 fade-in-up">
      <PageHeader
        backLink={backUrl}
        title={isEditMode ? "Edit Property" : "Add New Property"}
        subtitle={
          isEditMode ? "Update property details" : "Create a new listing"
        }
        actions={
          <>
            <Button variant="secondary" onClick={() => router.push(backUrl)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              icon={<MdSave size={18} />}
              disabled={isSubmitting || loading}
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
              fileCount={
                formData.images && Array.isArray(formData.images)
                  ? formData.images.length
                  : 0
              }
            />
            {isEditMode &&
              (!formData.images || formData.images.length === 0) && (
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
