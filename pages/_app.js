import Layout from '../components/Layout.tsx'
import '../styles/globals.css'
import "primereact/resources/themes/saga-blue/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import "../styles/invoice.css";
import "../styles/bill.css";
import "../styles/loadingIndicator.css";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router'


function MyApp({ Component, pageProps }) {

const router = useRouter();
if(router.pathname==="/invoice/[invoiceId]" || router.pathname==="/bill/[billId]"){
  return (
    <Component {...pageProps} />
  )}

  return (
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>

  )
}

export default MyApp
