export default function ErrorAlert({ message }) {
  if (!message) return null;
  return (
    <p className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
      {message}
    </p>
  );
}
