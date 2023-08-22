import {useLayout} from "@/src/hooks";
import classNames from "classnames";
import {useRouter} from "next/router";


const Sidebar = () => {
    const [ status, onClickStatus ] = useLayout();
    const router = useRouter();

    const onClickRoute = (path: string) => () => {
        router.push(path, undefined, { shallow: true });
    }

    return (
        <nav className={classNames({'nav-open': status})} style={status ? { zIndex: 100 } : undefined}>
            <div className="menu-btn" onClick={onClickStatus}>
                <div className={`line line--1 ${classNames({'line-cross': status})}`}></div>
                <div className={`line line--2 ${classNames({'line-fade-out': status})}`}></div>
                <div className={`line line--3 ${classNames({'line-cross': status})}`}></div>
            </div>

            <div className={`nav-links ${classNames({'fade-in': status})}`}>
                <a onClick={onClickRoute('/')} className="link">Home</a>
                <a onClick={onClickRoute('/test')} className="link">test페이지</a>
            </div>
        </nav>
    )
}
export default Sidebar;
