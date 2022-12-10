import Link from 'next/link'
import navStyles from '../styles/Nav.module.css'

import { useUser } from '@auth0/nextjs-auth0/client';
const Nav = () => {
    const { user } = useUser();
    console.log(user)
    return (
        <nav className={navStyles.nav}>
            {user ? (<ul>
                <li>
                    <Link href='/products'>Produkti</Link>
                </li>
                <li>
                    <Link href='/customer'>Klienti</Link>
                </li>
                <li>
                    <Link href='/otherData'>Citi dati</Link>
                </li>
                <li>
                    <Link href='/createDocument'>Veidot dokumentu</Link>
                </li>
                <li>
                    <a className='logoutButton' href="/api/auth/logout">Izlogoties</a>
                </li>
            </ul>) : (<ul><li><a className='loginButton' href="/api/auth/login">Ielogoties</a></li></ul>)}
        </nav>
    )
}

export default Nav
