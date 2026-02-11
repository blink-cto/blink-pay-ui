import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import AuthLayout from './layout/AuthLayout'

import HomePage from './routes/HomePage'
import AboutPage from './routes/AboutPage'
import ContactPage from './routes/ContactPage'
import LoginPage from './routes/LoginPage'
import SignupPage from './routes/SignupPage.tsx'
import DashboardPage from './routes/DashboardPage'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public pages */}
                <Route
                    path="/"
                    element={
                        <AppLayout>
                            <HomePage />
                        </AppLayout>
                    }
                />
                <Route
                    path="/about"
                    element={
                        <AppLayout>
                            <AboutPage />
                        </AppLayout>
                    }
                />
                <Route
                    path="/contact"
                    element={
                        <AppLayout>
                            <ContactPage />
                        </AppLayout>
                    }
                />

                {/* Dashboard after logging in*/}
                <Route
                    path="/dashboard"
                    element={
                    <AppLayout>
                        <DashboardPage />
                    </AppLayout>
                }
                />

                {/* Auth pages */}
                <Route
                    path="/login"
                    element={
                        <AuthLayout>
                            <LoginPage />
                        </AuthLayout>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <AuthLayout>
                            <SignupPage />
                        </AuthLayout>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}
