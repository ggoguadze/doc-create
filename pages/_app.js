import Layout from '../components/Layout'
import '../styles/globals.css'
import "primereact/resources/themes/saga-blue/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import "../styles/invoice.css";
import { UserProvider } from '@auth0/nextjs-auth0/client';


function MyApp({ Component, pageProps }) {

  return(
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  
  )
}

export default MyApp
