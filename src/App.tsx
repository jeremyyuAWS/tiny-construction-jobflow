import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { EmailTriageTab } from '@/components/EmailTriageTab';
import { VoiceCallsTab } from '@/components/VoiceCallsTab';
import { ProjectBinderTab } from '@/components/ProjectBinderTab';
import { NotificationsTab } from '@/components/NotificationsTab';
import { AdminTab } from '@/components/AdminTab';
import { DashboardOverview } from '@/components/DashboardOverview';
import { WelcomeModal } from '@/components/WelcomeModal';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);

  // Show welcome modal on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('jobflow-ai-visited');
    if (!hasVisited) {
      setIsWelcomeOpen(true);
      localStorage.setItem('jobflow-ai-visited', 'true');
    }
  }, []);

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <img 
                  src="/images/tinys-logo-square.png" 
                  alt="JobFlow AI Logo" 
                  className="h-16 w-auto"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold">JobFlow AI</h1>
                <p className="text-sm text-muted-foreground">AI that routes, records, and responds — so your crew doesn't have to.</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsWelcomeOpen(true)}
                className="text-muted-foreground hover:text-primary"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & Features
              </Button>

              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">System Active</span>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium">Tom Richardson</div>
                <div className="text-xs text-muted-foreground">Project Manager</div>
              </div>
              
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium">TR</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Tabs */}
      <main className="container mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-background">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="email-triage" className="data-[state=active]:bg-background">
              Email Triage
            </TabsTrigger>
            <TabsTrigger value="voice-calls" className="data-[state=active]:bg-background">
              Voice Calls
            </TabsTrigger>
            <TabsTrigger value="project-binder" className="data-[state=active]:bg-background">
              Project Binder
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-background">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="admin" className="data-[state=active]:bg-background">
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-0">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                <p className="text-muted-foreground">
                  Real-time insights into your AI workflow automation performance
                </p>
              </div>
              <DashboardOverview />
            </div>
          </TabsContent>

          <TabsContent value="email-triage" className="mt-0">
            <EmailTriageTab />
          </TabsContent>
          
          <TabsContent value="voice-calls" className="mt-0">
            <VoiceCallsTab />
          </TabsContent>
          
          <TabsContent value="project-binder" className="mt-0">
            <ProjectBinderTab />
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-0">
            <NotificationsTab />
          </TabsContent>
          
          <TabsContent value="admin" className="mt-0">
            <AdminTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              © 2025 JobFlow AI Platform. Powered by Lyzr Agents & Advanced ML.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>Last Updated: Jan 15, 2025 4:45 PM</span>
              <span>Status: All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        onTabSelect={handleTabSelect}
      />
    </div>
  );
}

export default App;