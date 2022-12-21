import Link from "next/link";
import navStyles from "../styles/Nav.module.css";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useRouter } from "next/router";

import { useUser } from "@auth0/nextjs-auth0/client";
const Nav = () => {
    const router = useRouter();
    const { user } = useUser();
    console.log(user);
    return (
        <>
            <ConfirmDialog />
            <nav className={navStyles.nav}>
                {user ? (
                    <ul>
                        <li>
                            <Link href="/products">Produkti</Link>
                        </li>
                        <li>
                            <Link href="/customer">Klienti</Link>
                        </li>
                        <li>
                            <Link href="/transport">Transports</Link>
                        </li>
                        <li>
                            <Link href="/driver">Vadītāji</Link>
                        </li>
                        <li>
                            <Link href="/createInvoice">Veidot pavadzīmi</Link>
                        </li>
                        <li>
                            <Link href="/createBill">Veidot rēķinu</Link>
                        </li>
                        <li>
                            <a
                                onClick={(e) => {
                                    e.preventDefault();
                                    confirmDialog({
                                        message: "Vai tiešām vēlaties izlogoties?",
                                        icon: "pi pi-exclamation-triangle",
                                        acceptLabel: "Jā",
                                        rejectLabel: "Nē",
                                        accept: () => {
                                            router.push("/api/auth/logout");
                                        }
                                    });
                                }}
                                className="logoutButton"
                                href="/api/auth/logout"
                            >
                                Izlogoties
                            </a>
                        </li>
                    </ul>
                ) : (
                    <ul>
                        <li>
                            <a className="loginButton" href="/api/auth/login">
                                Ielogoties
                            </a>
                        </li>
                    </ul>
                )}
            </nav>
        </>
    );
};

export default Nav;
