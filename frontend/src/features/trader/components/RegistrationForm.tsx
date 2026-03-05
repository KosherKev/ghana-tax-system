import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Select, Alert } from "@/components/ui";
import type { RegistrationPayload } from "../hooks/useRegistration";

// ── Zod schema ────────────────────────────────────────────────────────────────
const ghanaPhoneRegex = /^(\+233|0|233)[2-9][0-9]{8}$/;

const schema = z.object({
  name: z.string().min(3, "Full name must be at least 3 characters").max(80, "Name too long"),
  phone_number: z
    .string()
    .regex(ghanaPhoneRegex, "Enter a valid Ghana phone number (e.g. 0244123456)"),
  business_type: z.string().min(1, "Select a business type"),
  region: z.string().min(1, "Select a region"),
  district: z.string().min(2, "Enter your district").max(80, "District name too long"),
  market_name: z.string().min(2, "Enter market or community name").max(80, "Name too long"),
});

type FormValues = z.infer<typeof schema>;

const BUSINESS_TYPES = [
  { value: "food_vendor", label: "Food Vendor" },
  { value: "clothing", label: "Clothing" },
  { value: "electronics", label: "Electronics" },
  { value: "services", label: "Services" },
  { value: "agriculture", label: "Agriculture" },
  { value: "wholesale", label: "Wholesale" },
  { value: "retail", label: "Retail" },
  { value: "artisan", label: "Artisan" },
  { value: "other", label: "Other" },
];

const REGIONS = [
  { value: "Greater Accra", label: "Greater Accra" },
  { value: "Ashanti", label: "Ashanti" },
  { value: "Western", label: "Western" },
  { value: "Northern", label: "Northern" },
  { value: "Eastern", label: "Eastern" },
  { value: "Volta", label: "Volta" },
  { value: "Other", label: "Other" },
];

// ── Step indicator ────────────────────────────────────────────────────────────
function StepIndicator({ step }: { step: 1 | 2 }) {
  const steps = ["Personal Info", "Business Info"];
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((label, i) => {
        const num = i + 1;
        const isActive = num === step;
        const isDone = num < step;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  isActive
                    ? "bg-cu-red border-cu-red text-white"
                    : isDone
                    ? "bg-cu-red border-cu-red text-white"
                    : "bg-white border-cu-border text-cu-muted"
                }`}
              >
                {isDone ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  num
                )}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${isActive ? "text-cu-red" : "text-cu-muted"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 ${isDone ? "bg-cu-red" : "bg-cu-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface RegistrationFormProps {
  onSuccess: (payload: RegistrationPayload) => void;
  isLoading: boolean;
  serverError: string | null;
}

export default function RegistrationForm({
  onSuccess,
  isLoading,
  serverError,
}: RegistrationFormProps) {
  const [step, setStep] = useState<1 | 2>(1);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const handleNext = async () => {
    const valid = await trigger(["name", "phone_number"]);
    if (valid) setStep(2);
  };

  const onSubmit = (values: FormValues) => {
    onSuccess({
      name: values.name,
      phone_number: values.phone_number,
      business_type: values.business_type,
      location: {
        region: values.region,
        district: values.district,
        market_name: values.market_name,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepIndicator step={step} />

      {serverError && (
        <Alert variant="error" className="mb-6">
          {serverError}
        </Alert>
      )}

      {/* ── Step 1: Personal Info ── */}
      {step === 1 && (
        <div className="space-y-5">
          <Input
            label="Full Name"
            placeholder="e.g. Kofi Mensah"
            required
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Phone Number"
            placeholder="e.g. 0244123456 or +233244123456"
            type="tel"
            required
            helperText="Ghana phone number — used to retrieve your TIN later"
            error={errors.phone_number?.message}
            {...register("phone_number")}
          />
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleNext}
          >
            Next: Business Info →
          </Button>
        </div>
      )}

      {/* ── Step 2: Business Info ── */}
      {step === 2 && (
        <div className="space-y-5">
          <Select
            label="Business Type"
            required
            placeholder="Select business type"
            options={BUSINESS_TYPES}
            error={errors.business_type?.message}
            {...register("business_type")}
          />
          <Select
            label="Region"
            required
            placeholder="Select region"
            options={REGIONS}
            error={errors.region?.message}
            {...register("region")}
          />
          <Input
            label="District"
            placeholder="e.g. Accra Metropolitan"
            required
            error={errors.district?.message}
            {...register("district")}
          />
          <Input
            label="Market / Community Name"
            placeholder="e.g. Makola Market"
            required
            error={errors.market_name?.message}
            {...register("market_name")}
          />
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => setStep(1)}
              disabled={isLoading}
            >
              ← Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="flex-1"
              isLoading={isLoading}
            >
              Register Business
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
