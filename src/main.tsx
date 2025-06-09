import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'

import { MainLayout } from './layouts/MainLayout'
import { HomePage } from './pages/HomePage'
import { RecipeDetailPage } from './pages/RecipeDetailPage'
import { SearchPage } from './pages/SearchPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'recipes/:id', element: <RecipeDetailPage /> }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
