export default function Card({ children }) {
  return (
    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg w-full">
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
}
