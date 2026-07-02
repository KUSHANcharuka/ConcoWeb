import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Concolabs | Prelim, Task & Productivity Management",
  description:
    "Run your QS team from one platform: tasks, time, attendance, team chat and productivity benchmarking.",
};

export default function PrelimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
