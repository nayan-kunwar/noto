import { Tabs } from 'expo-router';

export default function TabsLayout(): React.JSX.Element {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Notes' }} />
      <Tabs.Screen name="archive" options={{ title: 'Archive' }} />
      <Tabs.Screen name="labels" options={{ title: 'Labels' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
