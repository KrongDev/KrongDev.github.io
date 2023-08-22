import {Head, Html, Main, NextScript} from "next/document";

const Document = () => {

    return (
        <Html>
            <header>
                <meta name='viewport' content='initial-scale=1.0, width=device-width'/>
                <title>이건 개발 블로그</title>
            </header>
            <Head>
                <meta charSet={'utf-8'}/>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
                    integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
                    crossOrigin="anonymous"
                />
                <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.1/TweenMax.min.js'></script>
            </Head>
            <body>
                <div id="button"/>
                <p id="circle-content"/>
                <div id="cursor" className="Cursor"/>
                <Main/>
                <NextScript/>
                <script src={'/script/mouse-effect-script.js'}/>
            </body>
        </Html>
    )
}
export default Document;
