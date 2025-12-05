import '../styles/Home.css';
import header from '../assets/header-img.jpg';
import sIcon from '../assets/icon-flame.png';
import qIcon from '../assets/ask.png';
import lIcon from '../assets/level.png';
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
function Home() {
    const ref = useRef(null);
    const controls = useAnimation();
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView]);

    const ref2 = useRef(null)
    const isInView2 = useInView(ref2, { once: true });
    useEffect(() => {
        if (isInView2) {
            controls.start("visible2")
        }
    })

    const [animateHeader, setAnimateHeader] = useState(false)

    useEffect(() => {
        setAnimateHeader(true)
    }, [])

    return (

        <main>
            <section className='header-container'>
                <img className="header-img" src={header} alt="header" />
                <div className='img-overlay'>
                    <h1 className={`fly-header ${animateHeader ? "visible" : ""}`}>Ready to play a game?</h1>
                    <a className={`hero-btn fly-header ${animateHeader ? "visible" : ""}`} href='/play'> Play Now</a>
                </div>
            </section>
            <section className='spacer'>

            </section>
            <motion.div
                ref={ref}
                variants={{
                    hidden: { opacity: 0, x: -200 },
                    visible: { opacity: 1, x: 0 },
                }}
                initial="hidden"
                animate={controls}
                transition={{ duration: 2.5, ease: "easeOut" }}
                className='about'
            >

                <h1>What is Code Escape?</h1>
                <p> Code Escape is an interactive online escape room that tests your overall knowledge of
                    basic cybersecurity concepts in three levels that increase in difficulty. With each passing level,
                    users showcase their knowledge of cybersecurity by aceing quizzes and building streaks.
                    Show your knowledge, have fun and escape!!</p>

            </motion.div>

            <motion.div
                ref={ref2}
                variants={{
                    hidden2: { opacity: 0, x: -200 },
                    visible2: { opacity: 1, x: 0 },
                }}
                initial="hidden2"
                animate={controls}
                transition={{ duration: 2.5, ease: "easeOut" }}
                className='pts'
            >
                <section className='pts'>
                    <div className='info-sec'>
                        <img className="icons" src={sIcon} alt="Streak" />
                        <h1>Streaks</h1>
                        <p>Answer correctly to achieve a streak</p>
                    </div>

                    <div className='info-sec'>
                        <img className="icons" src={lIcon} alt="Level" />
                        <h1>Level Up</h1>
                        <p> Level up as you go through different challenges </p>
                    </div>

                    <div className='info-sec'>
                        <img className="icons" src={qIcon} alt="Quiz" />
                        <h1>Quizzes</h1>
                        <p>Test your overall knowledge of these concepts</p>
                    </div>
                </section>
            </motion.div>
        </main >
    );
}

export default Home;