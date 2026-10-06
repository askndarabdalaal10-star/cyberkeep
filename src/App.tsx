import { Suspense, lazy } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Shell } from './components/Layout';

const Home = lazy(() => import('./pages/Home'));
const Library = lazy(() => import('./pages/Library'));
const ToolDetail = lazy(() => import('./pages/ToolDetail'));
const Labs = lazy(() => import('./pages/Labs'));
const Utility = lazy(() => import('./pages/Utility'));
const Settings = lazy(() => import('./pages/Settings'));
const Auth = lazy(() => import('./pages/Auth'));
const System = lazy(() => import('./pages/System'));

function Fallback() {
  return (
    <div className="space-y-4 p-2">
      <div className="skeleton h-10 w-1/3" />
      <div className="skeleton h-48 w-full" />
      <div className="grid md:grid-cols-3 gap-4"><div className="skeleton h-32" /><div className="skeleton h-32" /><div className="skeleton h-32" /></div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<div className="min-h-screen p-8 max-w-[1400px] mx-auto"><Fallback /></div>}>
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<Home />} />
            <Route path="commands" element={<Library mode="commands" />} />
            <Route path="tools" element={<Library mode="tools" />} />
            <Route path="tools/:id" element={<ToolDetail />} />
            <Route path="labs" element={<Labs />} />
            <Route path="bookmarks" element={<Utility page="bookmarks" />} />
            <Route path="profile" element={<Utility page="profile" />} />
            <Route path="about" element={<Utility page="about" />} />
            <Route path="settings" element={<Settings />} />
            <Route path="login" element={<Auth page="login" />} />
            <Route path="register" element={<Auth page="register" />} />
            <Route path="forgot-password" element={<Auth page="forgot" />} />
            <Route path="reset-password" element={<Auth page="reset" />} />
            <Route path="verify-email" element={<Auth page="verify" />} />
            <Route path="two-factor" element={<Auth page="twofactor" />} />
            <Route path="404" element={<System page="404" />} />
            <Route path="500" element={<System page="500" />} />
            <Route path="error" element={<System page="error" />} />
            <Route path="loading" element={<System page="loading" />} />
            <Route path="*" element={<System page="404" />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
