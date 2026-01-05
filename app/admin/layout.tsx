import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
