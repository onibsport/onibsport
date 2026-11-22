/**
 * Direction B's intro: on the first page of a visit the site opens on a dark
 * stadium, the floodlights flicker on one by one, ONIBSPORT lights up, and the
 * night lifts to reveal the page. Pure CSS (see .lights-intro in globals.css),
 * about 1.6 seconds, never blocks clicks, once per visit (the script runs
 * before the page is painted), off with reduced motion.
 */
const ONCE_PER_VISIT = `try{var k="ob-intro-b";if(sessionStorage.getItem(k)){document.documentElement.classList.add("intro-seen")}else{sessionStorage.setItem(k,"1")}}catch(e){document.documentElement.classList.add("intro-seen")}`;

export default function LightsOnIntro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: ONCE_PER_VISIT }} />
      <div aria-hidden="true" className="lights-intro">
        <span className="lights-intro-beam l1" />
        <span className="lights-intro-beam l2" />
        <span className="lights-intro-beam r1" />
        <span className="lights-intro-beam r2" />
        <span className="lights-intro-pitch" />
        <span className="lights-intro-name font-display">
          ONIB<span>SPORT</span>
        </span>
      </div>
    </>
  );
}
