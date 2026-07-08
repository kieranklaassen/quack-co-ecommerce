import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(3, "ZIP / postal code is required"),
  country: z.string().min(2, "Country is required"),
});

export const shippingSchema = addressSchema;

const billingFieldsSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  fullName: z.string().optional(),
  email: z.string().optional(),
});

export const paymentSchema = z
  .object({
    cardholderName: z.string().min(2, "Name on card is required"),
    cardNumber: z
      .string()
      .transform((v) => v.replace(/\s+/g, ""))
      .refine((v) => /^\d{13,19}$/.test(v), "Enter a valid card number"),
    expiry: z
      .string()
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format")
      .refine((value) => {
        const [mm, yy] = value.split("/");
        const month = Number(mm);
        const year = 2000 + Number(yy);
        const now = new Date();
        const exp = new Date(year, month, 0, 23, 59, 59);
        return exp >= now;
      }, "Card is expired"),
    cvv: z.string().regex(/^\d{3,4}$/, "Enter a valid CVV"),
    sameAsShipping: z.boolean(),
    billing: billingFieldsSchema,
  })
  .superRefine((data, ctx) => {
    if (data.sameAsShipping) return;
    const billingCheck = z
      .object({
        street: z.string().min(3, "Street address is required"),
        city: z.string().min(2, "City is required"),
        state: z.string().min(2, "State is required"),
        zip: z.string().min(3, "ZIP / postal code is required"),
        country: z.string().min(2, "Country is required"),
      })
      .safeParse(data.billing);
    if (!billingCheck.success) {
      for (const issue of billingCheck.error.issues) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: issue.message,
          path: ["billing", ...issue.path],
        });
      }
    }
  });

export type ShippingFormValues = z.infer<typeof shippingSchema>;
export type PaymentFormValues = z.infer<typeof paymentSchema>;

export function detectCardBrand(digits: string): string {
  if (/^4/.test(digits)) return "Visa";
  if (/^5[1-5]/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  return "Card";
}
