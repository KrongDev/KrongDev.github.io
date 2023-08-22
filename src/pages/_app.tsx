import {AppProps} from "next/app";
import {Layout} from "@/src/comp";
import '../../public/style/index.scss';

const MyApp = ({ Component, pageProps }: AppProps) => {

    return <Layout>
        <></>

        <Component {...pageProps}/>
        {/* <Script src="https://unpkg.com/react-bootstrap@next/dist/react-bootstrap.min.js" crossOrigin="anonymous" /> */}
        {/* 이렇게 crossOrigin */}
    </Layout>
}
export default MyApp;

