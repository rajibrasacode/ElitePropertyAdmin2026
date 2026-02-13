import * as yup from "yup";
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/webp"];

// TypeScript type
export type PropertyListingData = yup.InferType<typeof propertyListingSchema>;

// Default Values - listing_date will be set on submit
export const propertyListingDefaultValues: PropertyListingData = {
  listing_date: new Date().toISOString().split("T")[0], // Will be set automatically on submit
  listing_price: 0,
  asking_price: 0,
  street_address: "",
  unit_apt: "",
  city: "",
  state: "",
  zip_code: "",
  county: "",
  property_type: "",
  bedrooms: 0,
  bathrooms: 0,
  square_feet: 0,
  lot_size: "",
  year_built: new Date().getFullYear(),
  garage_spaces: 0,
  parking_spaces: 0,
  roof_age: "",
  roof_status: "",
  interior_condition: "",
  exterior_paint_required: false,
  new_floor_required: false,
  kitchen_renovation_required: false,
  bathroom_renovation_required: false,
  drywall_repair_required: false,
  interior_paint_required: false,
  arv: 0,
  repair_estimate: 0,
  holding_costs: 0,
  transaction_type: "",
  assignment_fee: 0,
  property_description: "",
  seller_notes: "",
  images: [],
};

// Dropdown Options
export const propertyTypeOptions = [
  { value: "Residential", label: "Residential" },
  { value: "Commercial", label: "Commercial" },
  { value: "Industrial", label: "Industrial" },
  { value: "Land", label: "Land" },
  { value: "Multi-Family", label: "Multi-Family" },
  { value: "Single-Family", label: "Single-Family" },
];

export const roofStatusOptions = [
  { value: "Excellent", label: "Excellent" },
  { value: "Good", label: "Good" },
  { value: "Fair", label: "Fair" },
  { value: "Poor", label: "Poor" },
  { value: "Needs Replacement", label: "Needs Replacement" },
];

export const interiorConditionOptions = [
  { value: "Excellent", label: "Excellent" },
  { value: "Good", label: "Good" },
  { value: "Fair", label: "Fair" },
  { value: "Poor", label: "Poor" },
];

export const transactionTypeOptions = [
  { value: "Cash", label: "Cash" },
  { value: "Financing", label: "Financing" },
  { value: "Assignment", label: "Assignment" },
  { value: "Wholesale", label: "Wholesale" },
];
// Property Listing Validation Schema
export const propertyListingSchema = yup.object({
  // Listing Information - Auto-populated
  listing_date: yup.string().required("Listing date is required"),

  // Address Information
  street_address: yup.string().required("Street address is required"),

  unit_apt: yup.string().required("unit_apt is required"),

  city: yup.string().required("City is required"),

  state: yup.string().required("State is required"),

  zip_code: yup
    .string()
    .required("ZIP code is required")
    .matches(/^[A-Za-z0-9\- ]{3,10}$/, "Invalid postal code"),

  county: yup.string().required("county is required"),

  // Property Details
  property_type: yup.string().required("Property type is required"),

  bedrooms: yup
    .number()
    .typeError("Bedrooms must be a number")
    .required("Bedrooms is required")
    .min(1, "Must be 0 or greater"),

  bathrooms: yup
    .number()
    .typeError("Bathrooms must be a number")
    .required("Bathrooms is required")
    .min(1, "Must be 0 or greater"),

  square_feet: yup
    .number()
    .typeError("Square feet must be a number")
    .required("Square feet is required")
    .min(1, "Must be greater than 0"),

  lot_size: yup
    .string()
    .required("lot_size is required")
    .min(1, "Must be greater than 0"),

  year_built: yup
    .number()
    .typeError("Year built must be a number")
    .required("Year built is required")
    // .min(1800, "Year must be 1800 or later")
    .max(new Date().getFullYear(), "Year cannot be in the future"),

  garage_spaces: yup
    .number()
    .typeError("Garage spaces must be a number")
    .min(0, "Must be 0 or greater")
    .required()
    .transform((v, o) => (o === "" ? null : v)),

  parking_spaces: yup
    .number()
    .typeError("Parking spaces must be a number")
    .min(0, "Must be 0 or greater")
    .required()
    .transform((v, o) => (o === "" ? null : v)),

  // Condition Information
  roof_age: yup.string().required("roof_age is required"),

  roof_status: yup.string().required("roof_status is required"),

  interior_condition: yup.string().required("interior_condition is required"),

  exterior_paint_required: yup.boolean().required("exterior_paint is required"),

  new_floor_required: yup.boolean().required("new_floor is required"),

  kitchen_renovation_required: yup
    .boolean()
    .required("kitchen_renovation is required"),

  bathroom_renovation_required: yup
    .boolean()
    .required("bathroom_renovation is required"),

  drywall_repair_required: yup.boolean().required("drywall_repair is required"),

  interior_paint_required: yup.boolean().required("interior_paint is required"),

  // Financial Information
  listing_price: yup
    .number()
    .typeError("Listing price must be a number")
    .required("Listing price is required")
    .min(10000, "Price must be greater 1000"),

  asking_price: yup
    .number()
    .typeError("Asking price must be a number")
    .required("Asking price is required")
    .min(10000, "Price must be greater 1000"),
  arv: yup
    .number()
    .typeError("ARV must be a number")
    .min(0, "ARV must be positive")
    .required("arv is required")
    .min(10000, "Must be 10000 or greater")
    .transform((v, o) => (o === "" ? null : v)),

  repair_estimate: yup
    .number()
    .typeError("Repair estimate must be a number")
    .nullable()
    .min(0, "Repair estimate must be positive")
    .required("Asking price is required")
    .min(100, "Must be 100 or greater")
    .transform((v, o) => (o === "" ? null : v)),

  holding_costs: yup
    .number()
    .typeError("Holding costs must be a number")
    .min(0, "Holding costs must be positive")
    .required("Holding costs is required")
    .min(100, "Must be 100 or greater")
    .transform((v, o) => (o === "" ? null : v)),

  transaction_type: yup.string().required("Transaction type is required"),

  assignment_fee: yup
    .number()
    .typeError("Assignment fee must be a number")
    .min(0, "Assignment fee must be positive")
    .required("Assignment fee is required")
    .min(100, "Must be 100 or greater")
    .transform((v, o) => (o === "" ? null : v)),

  // Additional Information
  property_description: yup.string().nullable().notRequired(),

  seller_notes: yup.string().nullable().notRequired(),

  images: yup
    .array()
    .of(
      yup
        .mixed<File | string>()
        .test(
          "file-or-url",
          "Invalid image",
          (value) => typeof value === "string" || value instanceof File,
        ),
    )
    .min(1, "At least one image is required")
    .required("Images are required"),
});
