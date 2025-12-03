import '../styles/Home.css';
import header from '../assets/header-img.jpg';
import sIcon from '../assets/icon-flame.png';
import qIcon from '../assets/ask.png';
import lIcon from '../assets/level.png';

function Home() {
    return (

        <main>
            <section className='header-container'>
                <img className="header-img" src={header} alt="header" />
                <div className='img-overlay'>
                    <h1>Ready to play a game?</h1>
                    <a href='/play' className='hero-btn'> Play Now</a>
                </div>
            </section>

            <section className='about'>
                <h1>What is Code Escape?</h1>
                <p> Code Escape is an interactive online escape room that tests your overall knowledge of 
                basic cybersecurity concepts in three levels that increase in difficulty. With each passing level, 
                users showcase their knowledge of cybersecurity by aceing quizzes and building streaks. 
                Show your knowledge, have fun and escape!!</p>
            </section>

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
        </main>
    );
}

export default Home;