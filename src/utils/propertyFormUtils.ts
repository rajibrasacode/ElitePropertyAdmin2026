import * as yup from "yup";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/webp"];

// TypeScript type for form data
export interface PropertyFormData {
  listing_date?: string;
  listing_price: string | number;
  asking_price: string | number;
  street_address: string;
  unit_apt: string;
  city: string;
  state: string;
  zip_code: string;
  county: string;
  property_type: string;
  bedrooms: string | number;
  bathrooms: string | number;
  square_feet: string | number;
  lot_size: string;
  year_built: string | number;
  garage_spaces: string | number;
  parking_spaces: string | number;
  roof_age: string;
  roof_status: string;
  interior_condition: string;
  exterior_paint_required: boolean;
  new_floor_required: boolean;
  kitchen_renovation_required: boolean;
  bathroom_renovation_required: boolean;
  drywall_repair_required: boolean;
  interior_paint_required: boolean;
  arv: string | number;
  repair_estimate: string | number;
  holding_costs: string | number;
  transaction_type: string;
  assignment_fee: string | number;
  property_description: string;
  seller_notes: string;
  images?: (File | string)[];
}

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

// Function to get initial form data
export const getInitialFormData = (): PropertyFormData => ({
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
  images: [],
});

// Function to convert API property data to form data
export const propertyToFormData = (property: any): PropertyFormData => ({
  street_address: property.street_address || "",
  unit_apt: property.unit_apt || "",
  city: property.city || "",
  state: property.state || "",
  zip_code: property.zip_code || "",
  county: property.county || "",
  property_type: property.property_type || "",
  bedrooms: property.bedrooms?.toString() || "",
  bathrooms: property.bathrooms?.toString() || "",
  square_feet: property.square_feet?.toString() || "",
  lot_size: property.lot_size || "",
  year_built: property.year_built?.toString() || "",
  garage_spaces: property.garage_spaces?.toString() || "",
  parking_spaces: property.parking_spaces?.toString() || "",
  roof_age: property.roof_age || "",
  roof_status: property.roof_status || "",
  interior_condition: property.interior_condition || "",
  exterior_paint_required: property.exterior_paint_required || false,
  new_floor_required: property.new_floor_required || false,
  kitchen_renovation_required: property.kitchen_renovation_required || false,
  bathroom_renovation_required: property.bathroom_renovation_required || false,
  drywall_repair_required: property.drywall_repair_required || false,
  interior_paint_required: property.interior_paint_required || false,
  listing_price: property.listing_price?.toString() || "",
  asking_price: property.asking_price?.toString() || "",
  arv: property.arv?.toString() || "",
  repair_estimate: property.repair_estimate?.toString() || "",
  holding_costs: property.holding_costs?.toString() || "",
  assignment_fee: property.assignment_fee?.toString() || "",
  transaction_type: property.transaction_type || "",
  property_description: property.property_description || "",
  seller_notes: property.seller_notes || "",
  images: [],
});

// Property Listing Validation Schema (if you want to use yup validation)
export const propertyListingSchema = yup.object({
  // Listing Information
  listing_date: yup.string().optional(),

  // Address Information
  street_address: yup.string().required("Street address is required"),
  unit_apt: yup.string().required("Unit/Apt is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  zip_code: yup
    .string()
    .required("ZIP code is required")
    .matches(/^[A-Za-z0-9\- ]{3,10}$/, "Invalid postal code"),
  county: yup.string().required("County is required"),

  // Property Details
  property_type: yup.string().required("Property type is required"),
  bedrooms: yup
    .number()
    .typeError("Bedrooms must be a number")
    .required("Bedrooms is required")
    .min(0, "Must be 0 or greater"),
  bathrooms: yup
    .number()
    .typeError("Bathrooms must be a number")
    .required("Bathrooms is required")
    .min(0, "Must be 0 or greater"),
  square_feet: yup
    .number()
    .typeError("Square feet must be a number")
    .required("Square feet is required")
    .min(1, "Must be greater than 0"),
  lot_size: yup.string().required("Lot size is required"),
  year_built: yup
    .number()
    .typeError("Year built must be a number")
    .required("Year built is required")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  garage_spaces: yup
    .number()
    .typeError("Garage spaces must be a number")
    .min(0, "Must be 0 or greater")
    .required("Garage spaces is required")
    .transform((v, o) => (o === "" ? null : v)),
  parking_spaces: yup
    .number()
    .typeError("Parking spaces must be a number")
    .min(0, "Must be 0 or greater")
    .required("Parking spaces is required")
    .transform((v, o) => (o === "" ? null : v)),

  // Condition Information
  roof_age: yup.string().required("Roof age is required"),
  roof_status: yup.string().required("Roof status is required"),
  interior_condition: yup.string().required("Interior condition is required"),
  exterior_paint_required: yup.boolean().required("Exterior paint is required"),
  new_floor_required: yup.boolean().required("New floor is required"),
  kitchen_renovation_required: yup
    .boolean()
    .required("Kitchen renovation is required"),
  bathroom_renovation_required: yup
    .boolean()
    .required("Bathroom renovation is required"),
  drywall_repair_required: yup.boolean().required("Drywall repair is required"),
  interior_paint_required: yup.boolean().required("Interior paint is required"),

  // Financial Information
  listing_price: yup
    .number()
    .typeError("Listing price must be a number")
    .required("Listing price is required")
    .min(10000, "Price must be greater than 10000"),
  asking_price: yup
    .number()
    .typeError("Asking price must be a number")
    .required("Asking price is required")
    .min(10000, "Price must be greater than 10000"),
  arv: yup
    .number()
    .typeError("ARV must be a number")
    .required("ARV is required")
    .min(10000, "Must be 10000 or greater")
    .transform((v, o) => (o === "" ? null : v)),
  repair_estimate: yup
    .number()
    .typeError("Repair estimate must be a number")
    .required("Repair estimate is required")
    .min(100, "Must be 100 or greater")
    .transform((v, o) => (o === "" ? null : v)),
  holding_costs: yup
    .number()
    .typeError("Holding costs must be a number")
    .required("Holding costs is required")
    .min(100, "Must be 100 or greater")
    .transform((v, o) => (o === "" ? null : v)),
  transaction_type: yup.string().required("Transaction type is required"),
  assignment_fee: yup
    .number()
    .typeError("Assignment fee must be a number")
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
