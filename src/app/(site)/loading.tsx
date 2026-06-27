export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-[#E0E0E0]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#1055CB]/20 border-t-[#1055CB]" />
        <p className="text-base text-[#374151]">در حال بارگذاری...</p>
      </div>
    </div>
  );
}
