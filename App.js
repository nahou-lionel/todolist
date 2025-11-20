import {React, useState} from 'react';
import { StatusBar } from 'react-native';
import Navigation from './Navigation/Navigation';
import { TokenContext, UsernameContext, ThemeContext } from './Context/Context';
import { useTheme } from './hooks/useTheme';

function AppContent() {
  const { isDarkMode } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={false}
      />
      <Navigation />
    </>
  );
}

export default function App () {
  const [token, setToken] = useState(null)
  const [username, setUsername] = useState(null)
  // 'auto' | 'light' | 'dark'
  const [themeMode, setThemeMode] = useState('light')

  console.log('token', token)
  return (
    <ThemeContext.Provider value={[themeMode, setThemeMode]}>
      <UsernameContext.Provider value={[username, setUsername]}>
        <TokenContext.Provider value={[token, setToken]}>
          <AppContent />
        </TokenContext.Provider>
      </UsernameContext.Provider>
    </ThemeContext.Provider>
  )
}
