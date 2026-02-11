import type {ReactNode} from 'react'
import Navbar from './Navbar'

type Props = {
    children: ReactNode
}

export default function AppLayout({ children }: Props) {
    return (
        <>
            <Navbar />
            <main
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '24px'
                }}
            >
                {children}
            </main>
        </>
    )
}
