import { generateHubMetadata, HubRoutePage } from "@/components/hub/hub-route";

const params = Promise.resolve({ slug: [] });

export const generateMetadata = () => generateHubMetadata("tools", { params });

export default function Page() {
  return <HubRoutePage section="tools" params={params} />;
}
