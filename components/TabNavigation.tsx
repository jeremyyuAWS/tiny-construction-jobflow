import React from 'react';
import { Mail, Phone, FolderOpen, Bell, Settings } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
  count?: number;
}

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs: Tab[];
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, tabs }) => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export const defaultTabs: Tab[] = [
  { id: 'email-triage', label: 'Email Triage', icon: Mail, count: 1 },
  { id: 'voice-calls', label: 'Voice Calls', icon: Phone, count: 0 },
  { id: 'project-binder', label: 'Project Binder', icon: FolderOpen },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'admin', label: 'Admin', icon: Settings }
];