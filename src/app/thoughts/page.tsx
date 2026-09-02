import { SectionHeader } from "@/components/SectionHeader";
import { ThoughtsWall } from "@/components/ThoughtsWall";

export const metadata = {
  title: "Thoughts",
  description: "A group-chat guest wall. Visitors leave a thought and Josh replies as himself.",
};

export default function ThoughtsPage() {
  return (
    <div className="section-container">
      <SectionHeader
        label="Community"
        title="Thoughts"
        description="A public wall styled like a group chat. Leave a thought — Josh responds in his own voice, live, powered by the same AI infra as the interview simulator."
      />
      <ThoughtsWall />
    </div>
  );
}
