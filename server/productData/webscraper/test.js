const puppeteer = require("puppeteer"); //feel free to use puppeteer-extra/stealth-plugin

(async () => {
  const browser = await puppeteer.launch({ headless: "new" }); //change "new" to false to see scraper in action

  const page = await browser.newPage();

  //url
  await page.goto("https://www.premierleague.com/tables", {
    waitUntil: "networkidle2", //dont worry about this - will work without it too
  });

  // Extracting the data (using evaluate here)
  const data = await page.evaluate(() => {
    // Selecting only the relevant rows from the table
    const rows = Array.from(
      document.querySelectorAll(".table tbody tr:not(.expandable)")
    ).slice(0, 20); //slicing first 20 because it was giving me other table data

    return rows.map((row) => {
      // Extracting data from each cell of the row
      const cells = Array.from(row.querySelectorAll("td"));

      // Removing the abbreviation from the team name using reg-ex
      const teamName = cells[1].textContent.trim();
      const teamNameWithoutAbbreviation = teamName.replace(/\s[A-Z]{3}$/, "");

      // Mapping cells to fields
      return {
        team: teamNameWithoutAbbreviation,
        position: cells[0].textContent.trim().split(" ")[0],
        played: cells[6].textContent.trim(),
        won: cells[3].textContent.trim(),
        drawn: cells[4].textContent.trim(),
        lost: cells[5].textContent.trim(),
        goalsFor: cells[6].textContent.trim(),
        goalsAgainst: cells[7].textContent.trim(),
        goalDifference: cells[8].textContent.trim(),
        points: cells[9].textContent.trim(),
        nextGame: cells[11].textContent.trim(),
      };
    });
  });

  // logging league table data
  console.log(data);

  await browser.close();
})();

// if you have any questions, reach out and I'll help you out :)
