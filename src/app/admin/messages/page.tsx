import { prisma } from "@/lib/prisma";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold mb-8">Messages</h1>

      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`bg-white rounded-lg p-6 shadow-sm ${
              !msg.read ? "border-l-4 border-orange" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-bold">{msg.name}</p>
                <p className="text-sm text-gray-500">{msg.email}</p>
              </div>
              <p className="text-xs text-gray-400">
                {msg.createdAt.toLocaleDateString()}
              </p>
            </div>
            {msg.subject && (
              <p className="font-bold text-sm text-orange mb-1">
                {msg.subject}
              </p>
            )}
            <p className="text-gray-700 text-sm leading-relaxed">
              {msg.message}
            </p>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p>No messages yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
