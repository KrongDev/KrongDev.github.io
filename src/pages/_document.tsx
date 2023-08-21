import {Html, Head, Main, NextScript} from "next/document";


const Document = () => {
    return (
        <Html>
            <Head>
                <title>이건의 개발 블로그</title>
                <meta charSet={'utf-8'} />
                <meta name='viewport' content='initial-scale=1.0, width=device-width' />
            </Head>
            <body>
                <Main/>
                <NextScript/>
            </body>
        </Html>
    )
}
export default Document;
