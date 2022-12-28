
import { useRouter } from 'next/router'
import { GetServerSideProps } from "next";
import { prisma } from "../prisma";


export const getServerSideProps: GetServerSideProps = async () => {

   const bill = await prisma.bill.findFirst({ where: { status: "SIGNING" } });
   if (bill) {
      await prisma.bill.update({ where: { id: bill.id }, data: { status: "SIGNED" } })
      return {
         redirect: { destination: '/createBillProd', permanent: false }
      }
   }
   return { props: { bill } };
};
function postSign() {
   const router = useRouter();
   const { error } = router.query;
   if (error) {
      return (<div> Parakstīšana neveiksmīga: {error}</div>)

   } else {
      return (<div> Parakstīšana veiksmīga </div>)
   }
}

export default postSign;
