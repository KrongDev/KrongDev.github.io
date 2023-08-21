import {Sidebar} from "@/src/comp";
import {ReactElement} from "react";
import {useLayout} from "@/src/hooks";


type Props = {
    children: ReactElement[]
}

const Layout = ({ children }: Props) => {
    const [ status ] = useLayout();

    return (
        <>
            <Sidebar />
            <div className="inform">
                {...children}
            </div>
        </>
    )
}
export default Layout;
