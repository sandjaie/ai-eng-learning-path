export function ActionError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="mb-4 rounded-xl border border-line bg-gold-soft px-4 py-3 text-sm font-bold text-ink"
    >
      {message}
    </p>
  );
}
