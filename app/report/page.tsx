import { SwingReport, SwingReportData } from "../../components/SwingReport";

const demoReport: SwingReportData = {
  player: {
    name: "Player",
    hand: "Right",
    eye: "Unknown",
    handicap: "N/A",
  },
  swingSummary:
    "This swing has a smooth tempo and a solid, athletic setup. The ball flight suggests the club is generally on plane, but you’re leaving a bit of speed and compression on the table. The biggest opportunities are syncing the lower body a touch earlier in transition, sharpening hip rotation through the strike, and letting the club exit a little more left so the face doesn’t hang open. Overall, this is a very playable motion that’s one focused 14-day block away from feeling like a weapon off the tee.",
  swingRatings: {
    swing: "A-",
    power: "B+",
    consistency: "A-",
    readiness: "Ready",
  },
  swingPreview: {
    videoUrl: "", // if you ever have a hosted clip, drop the URL here
    checkpoints: [
      {
        label: "P1",
        phase: "Address",
        status: "GREEN",
        short: "Posture is athletic and stable.",
        long: "Neutral spine, slight knee flex, and good balance over the arches of the feet. Hands hang naturally with no tension.",
        youtubeQuery: "golf swing setup posture P1",
      },
      {
        label: "P3",
        phase: "Top of backswing",
        status: "YELLOW",
        short: "Slightly under-rotated chest.",
        long: "Shoulders turn most of the way, but ribcage could finish a touch more behind the ball to load fully without swaying.",
        youtubeQuery: "golf swing full shoulder turn top of backswing",
      },
      {
        label: "P5",
        phase: "Downswing",
        status: "YELLOW",
        short: "Lower body could lead a bit sooner.",
        long: "Hips start to unwind, but arms and hands chase too quickly. This can rob you of ground-up power and shallow delivery.",
        youtubeQuery: "golf downswing sequence lower body leads",
      },
      {
        label: "P7",
        phase: "Impact",
        status: "GREEN",
        short: "Face control is solid.",
        long: "Handle is slightly ahead with reasonable shaft lean. Contact is generally centered with a predictable start line.",
        youtubeQuery: "golf impact position slow motion iron",
      },
    ],
  },
  strengths: [
    "Good rhythm and balance throughout the swing.",
    "Solid posture and setup position.",
    "Maintains connection between arms and body during takeaway.",
  ],
  priorityFixes: [
    "Increase hip rotation speed during the downswing to generate more power.",
    "Improve weight transfer from back foot to front foot for greater momentum.",
    "Sharpen exit path and wrist hinge release to maximize clubhead speed at impact.",
  ],
  powerLeaks: [
    "Limited lower body drive reducing kinetic chain efficiency.",
    "Early casting of the club reduces stored energy for release.",
    "Insufficient follow-through speed indicating constrained acceleration.",
  ],
  checkpoints: [
    {
      label: "P1",
      phase: "Setup Position",
      status: "GREEN",
      short: "Posture and alignment are solid.",
      long: "Balanced posture with neutral spine and stable stance. Ball position and alignment give you a strong starting platform.",
      youtubeQuery: "golf setup position neutral posture",
    },
    {
      label: "P2",
      phase: "Backswing Rotation",
      status: "YELLOW",
      short: "Rotation is adequate but could store more power.",
      long: "Shoulders turn, but trail hip doesn’t fully load, which caps how much energy you can send back down into the ball.",
      youtubeQuery: "golf backswing rotation trail hip load",
    },
    {
      label: "P3",
      phase: "Weight Transfer",
      status: "YELLOW",
      short: "Weight shift is present but not aggressive enough to build speed.",
      long: "Pressure does move forward, but it’s gradual. A crisper shift into lead side before impact would boost ball speed.",
      youtubeQuery: "golf weight transfer drill pressure shift",
    },
    {
      label: "P4",
      phase: "Downswing Sequencing",
      status: "RED",
      short: "Lower body rotation and wrist release could be faster and better timed.",
      long: "Arms and club sometimes outrace the hips, causing a slight stall. Getting the hips turning earlier keeps the club in the slot.",
      youtubeQuery: "golf downswing sequence hips lead arms",
    },
    {
      label: "P5",
      phase: "Follow Through",
      status: "YELLOW",
      short: "Follow-through appears restricted, limiting power output.",
      long: "Finish doesn’t always get fully around onto the lead side. Freeing up the finish will help speed continue through the ball.",
      youtubeQuery: "golf full finish around body",
    },
  ],
  planBlocks: [
    {
      title: "Days 1–2: Setup & Rhythm",
      text: "Lock in a repeatable setup and smooth tempo. Use mirror work or phone video to check posture, ball position, and first move away.",
    },
    {
      title: "Days 3–5: Load & Turn",
      text: "Focus on full shoulder and ribcage rotation while keeping lower body stable. Add slow 9-to-3 swings to blend feel into motion.",
    },
    {
      title: "Days 6–9: Downswing & Speed",
      text: "Drill lower-body-first downswing and snap the club through impact. Use step-through swings and tee-height ladder drills to build speed.",
    },
    {
      title: "Days 10–14: On-Course Transfer",
      text: "Take the new patterns to the course with 50/50 practice: half block practice to confirm feels, half random targets to test under pressure.",
    },
  ],
};

export default function SwingReportPage() {
  return <SwingReport report={demoReport} />;
}
