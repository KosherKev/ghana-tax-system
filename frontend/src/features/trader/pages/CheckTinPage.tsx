import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, Input, Button, Alert, Badge } from "@/components/ui";
import { useRegistration } from "../hooks/useRegistration";

const ghanaPhoneRegex = /^(\+233|0|233)[2-9][0-9]{8}$/;

const schema = z.object({
  phone_number: z
    .string()
    .regex(ghanaPhoneRegex, "Enter a valid Ghana phone number (e.g. 0244123456)"),
});

type FormValues = z.infer<typeof schema>;

export default function CheckTinPage() {
  const { lookupTin, tinLookupResult, isLoading, error, reset } = useRegistration();
  const [searched, setSearched] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onTouched" });

  const onSubmit = async (values: FormValues) => {
    setSearched(false);
    reset();
    await lookupTin(values.phone_number);
    setSearched(true);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      {/* Page header */}
      <div className="mb-8 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cu-red/10 mb-3">
          <svg
            className="h-6 w-6 text-cu-red"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-cu-text">Check My TIN</h1>
        <p className="text-cu-muted text-sm mt-1">
          Enter the phone number you used during registration to retrieve your TIN
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">
            <Input
              label="Phone Number"
              placeholder="e.g. 0244123456 or +233244123456"
              type="tel"
              required
              error={errors.phone_number?.message}
              {...register("phone_number")}
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Find My TIN
            </Button>
          </div>
        </form>
      </Card>

      {/* Results */}
      {searched && (
        <div className="mt-6">
          {tinLookupResult ? (
            <div className="rounded-xl border-2 border-green-300 bg-green-50 p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-green-800">Registration Found</span>
              </div>
              <p className="text-xs text-green-700 mb-1 uppercase tracking-wider font-medium">
                Tax Identification Number
              </p>
              <p className="text-3xl font-bold text-cu-red font-mono tracking-widest my-2">
                {tinLookupResult.tin_number}
              </p>
              <div className="flex items-center justify-center gap-3 mt-3 text-sm text-green-800">
                <span>Registered as: <strong>{tinLookupResult.name_masked}</strong></span>
                <Badge variant={tinLookupResult.status === "active" ? "active" : "pending"}>
                  {tinLookupResult.status}
                </Badge>
              </div>
            </div>
          ) : error ? (
            <Alert
              variant={error.includes("Too many") ? "warning" : "error"}
              title={error.includes("Too many") ? "Rate Limited" : "Not Found"}
            >
              {error}
            </Alert>
          ) : null}
        </div>
      )}

      <p className="text-center text-xs text-cu-muted mt-8">
        Not registered yet?{" "}
        <a href="/register" className="text-cu-red hover:underline font-medium">
          Register your business
        </a>
      </p>
    </div>
  );
}
