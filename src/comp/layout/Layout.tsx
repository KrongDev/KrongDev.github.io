import {Sidebar} from "@/src/comp";
import {ReactElement} from "react";


type Props = {
    children: ReactElement[]
}

const Layout = ({ children }: Props) => {

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
