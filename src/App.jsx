import React, { useEffect, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LocaleProvider } from './contexts/LocaleContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { asyncPreloadProcess } from './states/isPreload/action';
import { asyncUnsetAuthUser } from './states/authUser/action';
import useLocale from './hooks/useLocale';
import useTheme from './hooks/useTheme';
import NotFoundPage from './views/pages/base/NotFoundPage';
import LoginPage from './views/pages/base/LoginPage';
import RegisterPage from './views/pages/base/RegisterPage';
import HeaderBar from './views/components/Base/HeaderBar';
import FooterBar from './views/components/Base/FooterBar';
import ScrollToTop from './views/components/Base/ScrollToTop';

function App() {
  const firstRun = useRef(true);
  const authUser = useSelector((states) => states.authUser);
  const isPreload = useSelector((states) => states.isPreload);

  const dispatch = useDispatch();

  const [theme, themeContextValue] = useTheme();
  const [locale, localeContextValue] = useLocale();

  useEffect(() => {
    if (firstRun.current) {
      dispatch(asyncPreloadProcess());
      firstRun.current = false;
    }
  }, [dispatch]);

  const onSignOut = () => {
    dispatch(asyncUnsetAuthUser());
  };

  if (isPreload) {
    return null;
  }
  if (!authUser) {
    return (
      <LocaleProvider value={localeContextValue}>
        <ThemeProvider value={themeContextValue}>
          <div
            className="container unAuth"
            data-theme={theme === 'dark' ? '' : 'light'}
            data-lang={locale === 'EN' ? '' : 'ID'}
          >
            <header>
              <HeaderBar />
            </header>
            <main>
              <ScrollToTop />
              <Routes>
                <Route path="/*" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </main>
            <footer>
              <FooterBar />
            </footer>
          </div>
        </ThemeProvider>
      </LocaleProvider>
    );
  }
  return (
    <LocaleProvider value={localeContextValue}>
      <ThemeProvider value={themeContextValue}>
        <div
          className="container"
          data-theme={theme === 'dark' ? '' : 'light'}
          data-lang={locale === 'EN' ? '' : 'ID'}
        >
          <header>
            <HeaderBar />
            <NavigationBar logout={onSignOut} username={authUser.name} />
          </header>
          <main>
            <ScrollToTop />
            <Routes>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <footer>
            <FooterBar />
          </footer>
        </div>
      </ThemeProvider>
    </LocaleProvider>
  );
}

export default App;
