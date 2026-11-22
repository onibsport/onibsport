/**
 * Direction C's intro: on the first page of a visit a matchday ticket drops
 * onto the screen and tears along its perforation, revealing the programme.
 * Pure CSS (see .ticket-intro in globals.css), about 1.5 seconds, never blocks
 * clicks, once per visit (the script runs before the page is painted), off
 * with reduced motion.
 */
const ONCE_PER_VISIT = `try{var k="ob-intro-c";if(sessionStorage.getItem(k)){document.documentElement.classList.add("intro-seen")}else{sessionStorage.setItem(k,"1")}}catch(e){document.documentElement.classList.add("intro-seen")}`;

export default function TicketIntro({ dateLabel }: { dateLabel: string }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: ONCE_PER_VISIT }} />
      <div aria-hidden="true" className="ticket-intro">
        <div className="ticket">
          <div className="ticket-main">
            <span className="ticket-kicker">Matchday edition</span>
            <span className="ticket-name font-display">
              ONIB<span>SPORT</span>
            </span>
            <span className="ticket-date">{dateLabel}</span>
          </div>
          <div className="ticket-stub">
            <span className="font-display">ADMIT</span>
            <span className="font-display">ONE</span>
          </div>
        </div>
      </div>
    </>
  );
}
