import Image from "next/image";

/**
 * The broadcast intro: on the first page of a visit, the screen opens like a
 * live match broadcast (logo, ONIBSPORT, a LIVE bug) and the orange wipe
 * reveals the site. It is pure CSS (see .bc-intro in globals.css), lasts
 * about 1.3 seconds, never blocks clicks, and is skipped for the rest of the
 * visit by the small script below, which runs before the page is painted.
 * Off for readers who prefer reduced motion.
 */
const ONCE_PER_VISIT = `try{var k="ob-intro";if(sessionStorage.getItem(k)){document.documentElement.classList.add("intro-seen")}else{sessionStorage.setItem(k,"1")}}catch(e){document.documentElement.classList.add("intro-seen")}`;

export default function BroadcastIntro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: ONCE_PER_VISIT }} />
      <div aria-hidden="true" className="bc-intro">
        <div className="bc-intro-card">
          <span className="bc-intro-logo">
            <Image src="/logo.png" alt="" width={586} height={514} priority className="h-14 w-auto sm:h-20" />
          </span>
          <span className="bc-intro-name font-display">
            ONIB<span>SPORT</span>
          </span>
          <span className="bc-intro-live">
            <span className="bc-intro-dot" />
            LIVE
          </span>
        </div>
        <span className="bc-intro-band" />
      </div>
    </>
  );
}
