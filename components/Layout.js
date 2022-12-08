import Nav from './Nav'
import styles from '../styles/Layout.module.css'
import { useUser } from '@auth0/nextjs-auth0/client';

const layout = ({ children }) => {
    const { user, error, isLoading } = useUser();
    if (isLoading) return (<><Nav /><div>Loading...</div></>);
    if (error) return (<><Nav /><div>{error.message}</div></>);
    return (
        <>
            <Nav />
            {user && (
                <div>
                    <main >
                        {children}
                    </main>
                </div>
            )}
        </>
    )
}

export default layout
