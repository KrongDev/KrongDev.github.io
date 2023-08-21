import {atom, useAtom} from "jotai";


const sidebarStatus = atom(false);

const useLayout = (): [status: boolean, onClickStatus: () => void] => {
    const [status, setSidebarStatus] = useAtom(sidebarStatus);

    const onClickSidebarStatus = () => {
        setSidebarStatus(!status);
    }

    return [status, onClickSidebarStatus];
}
export default useLayout;
