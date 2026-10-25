import ProviderEntryContent from "@/components/provider/ProviderEntryContent";
import ProviderWorkspaceContent from "@/components/provider/ProviderWorkspaceContent";
import { getCurrentAccount } from "@/lib/data/account";
import { getCurrentProvider } from "@/lib/data/providers";

interface ListPropertyContentProps {
  searchParams: Promise<{
    message?: string;
  }>;
}

export default async function ListPropertyContent({
  searchParams,
}: ListPropertyContentProps) {
  const [{ user, profile }, { provider }] = await Promise.all([
    getCurrentAccount(),
    getCurrentProvider(),
  ]);

  if (!user) {
    return <ProviderEntryContent variant="guest" />;
  }

  if (!provider) {
    if (profile?.role === "admin") {
      return <ProviderEntryContent variant="admin" />;
    }

    return <ProviderEntryContent variant="student" />;
  }

  return <ProviderWorkspaceContent searchParams={searchParams} />;
}
