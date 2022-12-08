import { prisma } from "../prisma";


export interface IOtherData {
    name: string;
    number: String;
}

export const getServerSideProps = async () => {
    const driver = await prisma.driver.findMany();
    const transport = await prisma.transport.findMany();
    return { props: { driver, transport } };
};
function otherData() {
    return <div>Other Data</div>;
}

export default otherData;