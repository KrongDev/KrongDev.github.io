import {AppProps} from "next/app";
import '../styles/index.scss';
const MyApp = ({ Component, pageProps }: AppProps) => {
    return <>

        <Component {...pageProps}/>
        {/* <Script src="https://unpkg.com/react-bootstrap@next/dist/react-bootstrap.min.js" crossOrigin="anonymous" /> */}
        {/* 이렇게 crossOrigin */}
    </>
}
export default MyApp;

