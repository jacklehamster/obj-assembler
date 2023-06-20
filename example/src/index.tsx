import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './App'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './NotFound';

const root = createRoot(document.getElementById('root')!);
root.render(<BrowserRouter>
        <Routes>
            {/* Your other routes */}
            <Route path="/" Component={App} />
            {/* Catch-all route */}
            <Route path="*" Component={NotFound} />
        </Routes>
    </BrowserRouter>
);
