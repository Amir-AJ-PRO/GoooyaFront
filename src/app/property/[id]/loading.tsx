export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground text-lg">در حال بارگذاری جزئیات ملک...</p>
      </div>
    </div>
  );
}

