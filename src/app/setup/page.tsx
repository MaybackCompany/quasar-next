import { generateHubMetadata, HubRoutePage } from "@/components/hub/hub-route";

const params = Promise.resolve({ slug: [] });

export const generateMetadata = () => generateHubMetadata("setup", { params });

export default function Page() {
  return <HubRoutePage section="setup" params={params} />;
}
