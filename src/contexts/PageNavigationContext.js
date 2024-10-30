import React, { createContext, useContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage, loadPageContent } from '../features/editorSlice';

const PageNavigationContext = createContext();

export const PageNavigationProvider = ({ children }) => {
  const dispatch = useDispatch();
  const currentProject = useSelector(state => state.w3s.currentProject.data);

  const navigateToPage = useCallback((pageId) => {
    if (!currentProject || !pageId) return;

    const targetPage = currentProject.pages.find(page => page._id === pageId);
    if (targetPage) {
      dispatch(setCurrentPage(targetPage));
      dispatch(loadPageContent(targetPage.content));
      localStorage.setItem('currentPageId', pageId);
    }
  }, [currentProject, dispatch]);

  const value = {
    pages: currentProject?.pages || [],
    navigateToPage,
  };

  return (
    <PageNavigationContext.Provider value={value}>
      {children}
    </PageNavigationContext.Provider>
  );
};

export const usePageNavigation = () => {
  const context = useContext(PageNavigationContext);
  if (!context) {
    throw new Error('usePageNavigation must be used within a PageNavigationProvider');
  }
  return context;
}; 