import Link from 'next/link'
import navStyles from '../styles/Nav.module.css'

const Nav = () => {
    return (
        <nav className={navStyles.nav}>
            <ul>
                <li>
                    <Link href='/products'>Produkti</Link>
                </li>
                <li>
                    <Link href='/customer'>Klienti</Link>
                </li>
                <li>
                    <Link href= '/createDoc'>Veidot dokumentu</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Nav
