import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen" suppressHydrationWarning>
      <Navbar />
      <main className="grow pt-24" suppressHydrationWarning>
        {children}
      </main>
      <Footer />
    </div>
  );
}
