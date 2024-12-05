import { CronJob } from "cron";
import sendMail from "./mailer.js";
import got from "got";

const cronJob = new CronJob(
  // "00 */1 * * * *",
  "00 00 0,6,14,17 * * 0-6",
  async function () {
    await sendMail(
      ["bethrand2019@gmail.com", "igboprecious2@gmail.com"],
      "You will win",
      "<h1> You are the best </h1> <h1> You are more than enough </h1> <h1> You will win in life </h1> <h1> You will be the best in all your endeavours </h1> <h1>Always remember</h1>"
    );
    console.log("Email sent");
  },
  null,
  true,
  "Africa/Lagos"
);

const cronJob2 = new CronJob(
  // "00 00 0,6,14,17 * * 0-6",
  "00 */1 * * * *",
  async function () {
    const url = "https://backend-to-do-3an4.onrender.com/";
    const res = await got(url);
    console.log("Cron Job is running ", res.body);
  },
  null,
  true,
  "Africa/Lagos"
);

export { cronJob, cronJob2 };

// First asterisk is seconds 0-59 secs
// Second asterisk is minutes 0-59 mins
// Third asterisk is hour 0-23 hours
// Fourth asterisk is day of the month 1-31 day
// Fifth asterisk is month 1-12 (or names)
// Sixth asterisk is for day of the week 0-7 (0 or 7 is sunday, or names)
// */1 Every minute
// 0,6 Every 0 & 6 minutes
// 0-6 Every 0 to 6 minutes
