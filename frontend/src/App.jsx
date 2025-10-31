
import { useState } from 'react';

import Login from './Login';
import Home from './Home';
import Layout from './Layout';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Layout>
      {loggedIn ? <Home /> : <Login onLogin={() => setLoggedIn(true)} />}
    </Layout>
  );
}

export default App;
