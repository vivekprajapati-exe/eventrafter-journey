
const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 glass-card max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 text-cream">Welcome to Your Event Manager</h1>
        <p className="text-xl text-foreground mb-8">A beautiful dark-themed application to organize your events</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-navy rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Create Events</h3>
            <p className="text-sm">Easily create and manage your upcoming events</p>
          </div>
          <div className="p-4 bg-blue rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Track Tasks</h3>
            <p className="text-sm">Keep track of tasks for each of your events</p>
          </div>
          <div className="p-4 bg-maroon rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
            <p className="text-sm">View all your events in a calendar format</p>
          </div>
        </div>
        
        <a href="/dashboard" className="btn-primary px-6 py-3 rounded-md inline-block">
          Get Started
        </a>
      </div>
    </div>
  );
};

export default Index;
