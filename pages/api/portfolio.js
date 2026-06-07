import fs from "fs";
import { join } from "path";

export default function handler(req, res) {
  const portfolioData = join(process.cwd(), "/data/portfolio.json");

  if (process.env.NODE_ENV === "development") {
    if (req.method === "POST") {
      try {
        // 1. Correctly write data to your JSON file (removed the invalid callback function)
        fs.writeFileSync(portfolioData, JSON.stringify(req.body, null, 2), "utf-8");
        
        // 2. CRITICAL: Send a 200 OK status back to the browser so the dashboard can finish!
        return res.status(200).json({ status: "Success", message: "Data saved successfully!" });
      } catch (err) {
        console.error("Error writing to file:", err);
        return res.status(500).json({ status: "Error", message: "Failed to write file" });
      }
    } else {
      return res
        .status(200)
        .json({ name: "This route works in development mode only" });
    }
  } else {
    return res.status(403).json({ message: "Not allowed outside development mode" });
  }
}