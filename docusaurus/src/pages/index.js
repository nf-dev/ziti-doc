import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import OpenZitiLayout from "../components/OpenZitiLayout";
import {WhatIsOpenZiti} from "../components/SharedComponents";
import Link from '@docusaurus/Link';
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from "./index.module.css"
import OpenZitiHorizontalSection from "../components/OpenZitiHorizontalSection";

export function Highlight(props) {
    const { children } = props;
    return (
        <span style={{color: "var(--ifm-color-primary)", fontWeight: "bold"}}> {children}</span>
    );
}
export function H1(props) {
    const {children, id} = props;
    return (
        <p id={id} className={styles.h1}>{children}</p>
    );
}
export function H2(props) {
    const {children} = props;
    return (
        <p className={styles.h2}>{children}</p>
    );
}
export function H3(props) {
    const {children,style} = props;
    return (
        <h3 className={styles.h3} style={style}>{children}</h3>
    );
}

export default function Home() {
    const {siteConfig} = useDocusaurusContext();
    const exampleStyle = {
        color: "white",
        backgroundColor: "DodgerBlue",
        padding: "20px",
        fontFamily: "Arial"
    };

    return (
        <OpenZitiLayout>
            <OpenZitiHorizontalSection style={{padding: "40px"}}>
                <div className={styles.getStartedRow}>

                    <div className={styles.getStartedBlurb}>
                        <H2>Secure by design networking, anywhere, as <Highlight>software</Highlight></H2>

                        <p>&nbsp;</p>
                        <ul>
                            <li><Link to="/docs/learn/introduction/">Learn the Basics</Link></li>
                            <li><Link to="/docs/reference/developer/">Developer Resources</Link></li>
                            <li><Link to="/docs/guides/">Practical Recipes</Link></li>
                            <li><Link to="/docs/reference/glossary/">Define Terms</Link></li>
                        </ul>
                    </div>

                    <div className={styles.getStartedBoxes}>

                        <div className={styles.installChoice} style={{backgroundColor: "var(--openziti-callout-color)"}}>
                            <H3>OpenZiti</H3>
                            <p><b></b></p>
                            <ul>
                                <li>Open Source - Apache v2</li>
                                <li>Self-hosted network</li>
                                <li>Free forever</li>
                            </ul>
                            <div className={styles.installChoiceBtn} >
                                <div style={{display: "flex", alignItems: "flex-start", justifyContent: "space-around"}}>
                                    <div className={styles.indexCtas}>
                                        <Link className="button button--primary" to="#build-a-network">
                                            <p>Get OpenZiti</p>
                                        </Link>
                                    </div>
                                    <ThemedImage
                                        alt="Docusaurus themed image"
                                        sources={{
                                            light: useBaseUrl('/img/github.svg'),
                                            dark: useBaseUrl('/img/github-white.svg'),
                                        }}
                                        style={{display:"flex", alignItems:"center", height: "60px"}}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.installChoice} style={{backgroundColor: "var(--zeds-callout-color)"}}>
                            <H3>Ziti Edge Developer Sandbox</H3>
                            <p><b></b></p>
                            <ul>
                                <li>For SDK-only development</li>
                                <li>Prebuilt network</li>
                                <li>Free forever for development & non-production use</li>
                            </ul>
                            <div className={styles.installChoiceBtn} >
                                <div style={{display: "flex", alignItems: "flex-start", justifyContent: "space-around"}}>
                                    <div className={styles.indexCtas}>
                                        <Link className="button button--primary" to="https://zeds.openziti.org/">
                                            <p>Try ZEDS</p>
                                        </Link>
                                    </div>
                                    <img src={"/img/zeds.png"} style={{display:"flex", alignItems:"center", height: "60px"}}/>
                                </div>
                            </div>
                        </div>

                        <div className={styles.installChoice} style={{backgroundColor: "var(--cloudziti-callout-color)"}}>
                            <H3>CloudZiti Teams</H3>
                            <p><b></b></p>
                            <ul>
                                <li>Easy to get started, fully customizable</li>
                                <li>NetFoundry hosted network</li>
                                <li>Free for up to 10 endpoints</li>
                            </ul>
                            <div className={styles.installChoiceBtn} >
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <div className={styles.indexCtas}>
                                        <Link className="button button--primary" to="https://netfoundry.io/products/netfoundry-platform/netfoundry-cloud-for-openziti/">
                                            <p>Try CloudZiti</p>
                                        </Link>
                                    </div>
                                    <img src={"/img/nf.svg"} style={{display:"flex", alignItems:"center", width: "60px"}}/>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </OpenZitiHorizontalSection>

            <OpenZitiHorizontalSection style={{backgroundColor: "var(--landing-banner-1)"}}>
                <H1>What is OpenZiti?</H1>
                <p>
                    <WhatIsOpenZiti/>

                    <ul style={{margin: "var(--ifm-list-margin)"}}>
                        <li><a href="/docs/reference/glossary#network-overlay-overlay">The fully open source zero trust network overlay</a></li>
                        <li><a href="/docs/reference/tunnelers/">Tunneling Applications for all operating systems</a></li>
                        <li><a href="/docs/reference/developer/sdk/">Numerous SDKs making it easy to add Zero Trust concepts directly into your application</a></li>
                    </ul>

                    OpenZiti makes it easy to embed Zero Trust, programmable networking directly into your app.
                    With OpenZiti you can have Zero Trust, high performance networking on any internet connection, without VPNs
                    and ultimately without any open, inbound ports needed for your application.
                </p>
            </OpenZitiHorizontalSection>

            <OpenZitiHorizontalSection>
                <div style={{display:"flex", flexWrap: "wrap", justifyContent:"center", flexDirection: "column"}}>
                    <H1>OpenZiti Components</H1>
                    <ul style={{maxWidth: "800px"}}>
                        <li className={styles.cardz}>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <H3 style={{minWidth: "250px", margin: "0px"}}>
                                    <Link to="/docs/learn/introduction/openziti-is-software#fabric">The OpenZiti Fabric</Link>
                                </H3>
                            </div>
                            <p>a scalable, pluggable, overlay networking mesh with built-in smart routing</p>
                        </li>
                        <li className={styles.cardz}>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <H3 style={{minWidth: "250px", margin: "0px"}}>
                                    <Link to="/docs/learn/introduction/openziti-is-software#edge">The OpenZiti Edge</Link>
                                </H3>
                            </div>
                            <p>the components providing secure, zero trust entry points into the overlay network</p>
                        </li>
                        <li className={styles.cardz}>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <H3 style={{minWidth: "250px", margin: "0px"}}>
                                    <Link to="/docs/learn/introduction/openziti-is-software#sdks">The OpenZiti SDKs</Link>
                                </H3>
                            </div>
                            <p>allows developers to embed zero trust principles directly into applications</p>
                        </li>
                        <li className={styles.cardz}>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <H3 style={{minWidth: "250px", margin: "0px"}}>
                                    <Link to="/docs/reference/tunnelers/">OpenZiti Tunneling Applications</Link>
                                </H3>
                            </div>
                            <p>not all apps can be recompiled with zero trust principles built in. For those situations, these components provide the bridge from classic underlay networks to the overlay</p>
                        </li>
                    </ul>
                </div>

            </OpenZitiHorizontalSection>
            <OpenZitiHorizontalSection style={{backgroundColor: "var(--background-color-1)"}}>
                <H1 id="build-a-network">Get Started - Build a Network</H1>
                <p>Ziti make zero trust easy but you'll need an overlay network in order to start on your zero trust
                    journey. We recommend you start with a simple network. Once you understand the basic concepts it can make
                    more sense to move on to more complex network topologies. Choose what sort of network you want to build.
                </p>
                <div style={{display:"flex", flexWrap: "wrap", alignItems:"center", alignContent: "center", alignSelf:"center"}}>
                    <a className="btn-hover sdkbutton-button"
                       href={useBaseUrl("docs/learn/quickstarts/network/local-no-docker")}>
                        <div className="sdkbutton-text">Everything Local<br/>(Not Docker)</div>
                    </a>
                    <a className="btn-hover sdkbutton-button"
                       href={useBaseUrl("docs/learn/quickstarts/network/local-with-docker")}>
                        <div className="sdkbutton-text">Everything Local<br/>(I love Docker)</div>
                    </a>
                    <a className="btn-hover sdkbutton-button"
                       href={useBaseUrl("docs/learn/quickstarts/network/local-docker-compose")}>
                        <div className="sdkbutton-text">Everything Local<br/>(Docker Compose)</div>
                    </a>
                    <a className="btn-hover sdkbutton-button"
                       href={useBaseUrl("docs/learn/quickstarts/network/hosted")}>
                        <div className="sdkbutton-text">Host It Anywhere<br/>(I have a server)</div>
                    </a>
                </div>
            </OpenZitiHorizontalSection>
            <OpenZitiHorizontalSection>
                <H1>I Have a Network, What's Next?</H1>
                <p>
                    Now that you have a <Link to="/docs/learn/introduction/">OpenZiti Network</Link> all
                    setup and ready to go, the next step is learning about all of the pieces which go into it. There's a lot to learn and
                    <Link to={"/docs/learn/introduction/"}> our docs</Link> are there to help you understand any extra details you need help
                    ironing out. If the docs aren't complete or aren't helpful, we love seeing issues filed for how to improve.
                    Or, if you're feeling up for it, we'd love to see any PRs to make the docs better you wish to
                    contribute. You'll find a more extensive list of the <Link to={"/docs/learn/quickstarts/"}> quickstarts
                    we have here.</Link>
                </p>
            </OpenZitiHorizontalSection>
            <OpenZitiHorizontalSection>
                <H1>Get Started With an SDK</H1>
                <p>The OpenZiti project offers numerous SDKs to start with. Pick your favorite language and follow
                    along with a simple tutorial. If your favorite language is not shown, perhaps you can use the C SDK and
                    integrate via <a href="https://en.wikipedia.org/wiki/Foreign_function_interface">Foreign Function Interface</a> (FFI).</p>
                <div className="col-lg-12">
                    <div className="centerrow buttonrow">
                        <a className="sdkbutton-button"
                           href="https://github.com/openziti/ziti-sdk-c/tree/main/programs">
                            <img src={useBaseUrl("img/clang-logo.svg")} className="sdkbutton-image"/>
                            <div className="sdkbutton-text">C Lang</div>
                        </a>
                        <a className="sdkbutton-button"
                           href="https://github.com/openziti/sdk-golang/tree/main/example">
                            <img src={useBaseUrl("img/golang-logo.svg")} className="sdkbutton-image"/>
                            <div className="sdkbutton-text">Go</div>
                        </a>
                        <a className="sdkbutton-button"
                           href="https://github.com/openziti/ziti-sdk-py/tree/main/sample">
                            <img src={useBaseUrl("img/python-logo.svg")} className="sdkbutton-image"/>
                            <div className="sdkbutton-text">Python</div>
                        </a>
                        <a className="sdkbutton-button"
                           href="https://github.com/openziti/ziti-sdk-swift">
                            <img src={useBaseUrl("img/swift-logo.svg")} className="sdkbutton-image"/>
                            <div className="sdkbutton-text">Swift</div>
                        </a>
                        <a className="sdkbutton-button"
                           href="https://github.com/openziti/ziti-sdk-jvm/tree/main/samples">
                            <img src={useBaseUrl("img/kotlin-logo.svg")} className="sdkbutton-image"/>
                            <div className="sdkbutton-text">Android</div>
                        </a>
                        <a className="sdkbutton-button"
                           href="https://github.com/openziti/ziti-sdk-jvm/tree/main/samples">
                            <img src={useBaseUrl("img/java-logo.svg")} className="sdkbutton-image"/>
                            <div className="sdkbutton-text">Java</div>
                        </a>
                        <a className="sdkbutton-button"
                           href="https://github.com/openziti/ziti-sdk-nodejs">
                            <img src={useBaseUrl("img/nodejs.svg")} className="sdkbutton-image"/>
                            <div className="sdkbutton-text">NodeJS</div>
                        </a>
                        <a className="sdkbutton-button"
                           href="https://github.com/openziti/ziti-sdk-csharp">
                            <img src={useBaseUrl("img/csharp-logo.svg")} className="sdkbutton-image"/>
                            <div className="sdkbutton-text">C# (.NET)</div>
                        </a>
                    </div>
                </div>
            </OpenZitiHorizontalSection>
            <OpenZitiHorizontalSection>
                <H1>Not Ready to Go Fully App-Embedded?</H1>
                <p>
                    That's ok - zero trust adoption is a journey. Get started with a couple of very simple examples which
                    will get you familiar with the technology overall. These samples will leverage one of the
                    <Link to="/docs/learn/core-concepts/clients/choose"> tunneling apps</Link>.
                </p>
                <div className="col-lg-12">
                    <div className="centerrow buttonrow sdkbuttons">
                        <a className="sdkbutton-button"
                           href={useBaseUrl("docs/quickstarts/services/ztha")}>
                            <img src="/img/codealt.png"
                                 className="sdkbutton-image"/>
                            <div className="sdkbutton-text">Simple Webapp</div>
                        </a>
                    </div>
                </div>
            </OpenZitiHorizontalSection>
        </OpenZitiLayout>
    );
}
