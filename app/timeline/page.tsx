import DynamicTimeline from '@/components/DynamicTimeline';

export default function TimelinePage() {
  // For now, using a hardcoded user ID. In production, this would come from auth
  const userId = 'demo-user';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto py-8">
        <DynamicTimeline userId={userId} />
      </div>
    </div>
  );
}