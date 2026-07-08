import { CheckoutProgress } from "@/components/checkout/progress";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <CheckoutProgress />
      {children}
    </div>
  );
}
