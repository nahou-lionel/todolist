import { React, useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import Navigation from './Navigation/Navigation';
import { TokenContext, UsernameContext } from './Context/Context';
import { AlertProvider } from './Context/AlertContext';
import { signIn } from './api/apiService';

function AppContent() {
  return (
    <>
      <StatusBar
        barStyle='dark-content'
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

  useEffect(() => {
    signIn('demo', 'demo123')
      .then((t) => {
        setToken(t)
        setUsername('demo')
      })
      .catch(() => {})
  }, [])

  return (
    <UsernameContext.Provider value={[username, setUsername]}>
      <TokenContext.Provider value={[token, setToken]}>
        <AlertProvider>
          <AppContent />
        </AlertProvider>
      </TokenContext.Provider>
    </UsernameContext.Provider>
  )
}
