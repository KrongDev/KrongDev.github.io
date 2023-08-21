import {useLayout} from "@/src/hooks";
import classNames from "classnames";


const Sidebar = () => {
    const [ status, onClickStatus ] = useLayout();
    return (
        <nav className={classNames({'nav-open': status})}>
            <div className="menu-btn" onClick={onClickStatus}>
                <div className={`line line--1 ${classNames({'line-cross': status})}`}></div>
                <div className={`line line--2 ${classNames({'line-fade-out': status})}`}></div>
                <div className={`line line--3 ${classNames({'line-cross': status})}`}></div>
            </div>

            <div className={`nav-links ${classNames({'fade-in': status})}`}>
                <a href="" className="link">Home</a>
                <a href="" className="link">Contact</a>
                <a href="" className="link">Profile</a>
                <a href="" className="link">About</a>
            </div>
        </nav>
    )
}
export default Sidebar;
