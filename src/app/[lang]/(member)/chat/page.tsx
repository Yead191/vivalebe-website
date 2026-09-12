import MessagePage from "@/components/shared/message/MessagePage"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
  description:
    "Open your Sigaleve inbox and keep conversations going with people you trust.",
  keywords: ["Sigaleve", "messages", "chat", "inbox"],
  robots: { index: false, follow: false },
};

const page = () => {
  return (
    <MessagePage />
  )
}

export default page