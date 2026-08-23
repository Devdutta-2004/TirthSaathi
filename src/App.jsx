import React from 'react';
import { YatraProvider, useYatra } from './context/YatraContext';
import { AppLayout } from './components/layout/AppLayout';

// Dedicated App Screens
import { HomeScreen } from './screens/HomeScreen';
import { FinderScreen } from './screens/FinderScreen';
import { PunarMilanAIScreen } from './screens/PunarMilanAIScreen';
import { CrowdFlowScreen } from './screens/CrowdFlowScreen';
import { AuthorityScreen } from './screens/AuthorityScreen';
import { NearbyScreen } from './screens/NearbyScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { EventsScreen } from './screens/EventsScreen';
import { AIAssistantScreen } from './screens/AIAssistantScreen';
import { EmergencyScreen } from './screens/EmergencyScreen';
import { ProfileScreen } from './screens/ProfileScreen';

// Global Overlays & Modals
import { SOSModal } from './components/Modals/SOSModal';
import { ReportMissingModal } from './components/Modals/ReportMissingModal';
import { ReportSightingModal } from './components/Modals/ReportSightingModal';
import { DigitalIdModal } from './components/Modals/DigitalIdModal';
import { FamilyGroupModal } from './components/Modals/FamilyGroupModal';
import { DestinationModal } from './components/Modals/DestinationModal';
import { ToastNotification } from './components/ToastNotification';

function ScreenRenderer() {
  const { currentScreen } = useYatra();

  switch (currentScreen) {
    case 'home':
      return <HomeScreen />;
    case 'punarmilan':
      return <PunarMilanAIScreen />;
    case 'finder':
      return <FinderScreen />;
    case 'crowd':
      return <CrowdFlowScreen />;
    case 'authority':
      return <AuthorityScreen />;
    case 'nearby':
      return <NearbyScreen />;
    case 'explore':
      return <ExploreScreen />;
    case 'events':
      return <EventsScreen />;
    case 'ai':
      return <AIAssistantScreen />;
    case 'emergency':
      return <EmergencyScreen />;
    case 'profile':
      return <ProfileScreen />;
    default:
      return <HomeScreen />;
  }
}

export function App() {
  return (
    <YatraProvider>
      <AppLayout>
        {/* Render Active App Screen Module */}
        <ScreenRenderer />

        {/* Global Modals & Notifications */}
        <SOSModal />
        <ReportMissingModal />
        <ReportSightingModal />
        <DigitalIdModal />
        <FamilyGroupModal />
        <DestinationModal />
        <ToastNotification />
      </AppLayout>
    </YatraProvider>
  );
}

export default App;
