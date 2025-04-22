import { Navbar } from "@/components/navbar";
import { PrivacyProvider } from "@/context/privacy-context";
import { Toaster } from "@/components/ui/toaster";

export default function ConnectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <PrivacyProvider>
        {children}
        <Toaster />
      </PrivacyProvider>
    </>
  );
}