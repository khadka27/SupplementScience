import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

export const dynamic = "force-dynamic";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
