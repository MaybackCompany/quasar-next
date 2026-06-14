import { generateHubMetadata, generateHubStaticParams, HubRoutePage } from "@/components/hub/hub-route";

const section = "starter-kit";

export const generateStaticParams = () => generateHubStaticParams(section);
export const generateMetadata = (props: { params: Promise<{ slug?: string[] }> }) =>
  generateHubMetadata(section, props);

export default function Page(props: { params: Promise<{ slug?: string[] }> }) {
  return <HubRoutePage section={section} params={props.params} />;
}
