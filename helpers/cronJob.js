import { CronJob } from "cron";
import sendMail from "./mailer.js";
import got from "got";

const cronJob = new CronJob(
  // "00 */1 * * * *",
  "00 00 0,6,14,17 * * 0-6",
  async function () {
    await sendMail(
      "igboprecious2@gmail.com",
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
  // "00 */1 * * * *",
  "00 00 0,6,12,18 * * 0-6",
  async function () {
    await sendMail(
      "bethrand2019@gmail.com",
      "You will win",
      "<h1> You are the best </h1> <h1> You are the best backend developer out there</h1> <h1> You are more than enough </h1> <h1> You will win in life and also build great projects with BE </h1> <h1> You're already the best in every project you work on</h1> <h1>Always remember</h1>"
    );
    console.log("Email sent");
  },
  null,
  true,
  "Africa/Lagos"
);

const cronJob3 = new CronJob(
  // "00 00 0,6,14,17 * * 0-6",
  "00 */20 * * * *",
  async function () {
    const urls = [
      "https://backend-to-do-3an4.onrender.com/",
      "https://raha-voucha-api.onrender.com/",
      "https://farm-connect-c2ut.onrender.com/"
    ];

    try {
      const res = await Promise.all(
        urls.map((url) => {
          return got(url);
        })
      );
      res.forEach((res, index) => {
        console.log(`Responses from ${urls[index]} : `, res.body);
      });
    } catch (error) {
      console.error("Error fetching URLs : ", error);
    }
  },
  null,
  true,
  "Africa/Lagos"
);

export { cronJob, cronJob2, cronJob3 };

// First asterisk is seconds 0-59 secs
// Second asterisk is minutes 0-59 mins
// Third asterisk is hour 0-23 hours
// Fourth asterisk is day of the month 1-31 day
// Fifth asterisk is month 1-12 (or names)
// Sixth asterisk is for day of the week 0-7 (0 or 7 is sunday, or names)
// */1 Every minute
// 0,6 Every 0 & 6 minutes
// 0-6 Every 0 to 6 minutes
