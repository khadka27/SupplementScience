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
      {/* Each page/section handles its own top-spacing to accommodate
          the announcement strip (24px) + navbar (56px) = 80px offset */}
      <main className="grow" suppressHydrationWarning>
        {children}
      </main>
      <Footer />
    </div>
  );
}


