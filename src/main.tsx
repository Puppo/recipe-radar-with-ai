import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import './services/ai/translatorService';

import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { RecipeDetailPage } from './pages/RecipeDetailPage';
import { SearchPage } from './pages/SearchPage';
import { LanguageDetectionProvider } from './providers/LanguageDetectionProvider';
import { QueryProvider } from './providers/QueryProvider';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'recipes/:id', element: <RecipeDetailPage /> }
    ]
  }], {
  basename: '/recipe-radar-with-ai/',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <LanguageDetectionProvider>
        <RouterProvider router={router} />
      </LanguageDetectionProvider>
    </QueryProvider>
  </StrictMode>,
)
