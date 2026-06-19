import { generateHubMetadata, HubRoutePage } from "@/components/hub/hub-route";

const params = Promise.resolve({ slug: [] });

export const generateMetadata = () => generateHubMetadata("reviews", { params });

export default function Page() {
  return <HubRoutePage section="reviews" params={params} />;
}
