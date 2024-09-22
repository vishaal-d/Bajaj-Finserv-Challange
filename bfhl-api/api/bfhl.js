const base64ToFile = require("base64-to-file");
const fs = require("fs");

// Helper to run the serverless function
const handler = (req, res) => {
  const userId = "john_doe_17091999";
  const email = "john@xyz.com";
  const rollNumber = "ABCD123";

  if (req.method === "POST") {
    const { data, file_b64 } = req.body;

    let numbers = [];
    let alphabets = [];
    let highestLowercase = [];

    // Separate numbers and alphabets
    data.forEach((item) => {
      if (!isNaN(item)) {
        numbers.push(item);
      } else if (/[a-zA-Z]/.test(item)) {
        alphabets.push(item);
      }
    });

    // Find the highest lowercase alphabet
    let lowercaseLetters = alphabets.filter((char) => /[a-z]/.test(char));
    if (lowercaseLetters.length > 0) {
      highestLowercase.push(lowercaseLetters.sort().pop());
    }

    // Handle base64 file
    let fileValid = false,
      mimeType = "",
      fileSizeKB = 0;
    if (file_b64) {
      try {
        const fileData = base64ToFile(file_b64, "./uploads", "uploadFile");
        const stats = fs.statSync(fileData.path);
        mimeType = fileData.mimeType;
        fileSizeKB = (stats.size / 1024).toFixed(2); // size in KB
        fileValid = true;
      } catch (err) {
        console.error("File handling error:", err);
        fileValid = false;
      }
    }

    return res.status(200).json({
      is_success: true,
      user_id: userId,
      email: email,
      roll_number: rollNumber,
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercase,
      file_valid: fileValid,
      file_mime_type: mimeType,
      file_size_kb: fileSizeKB,
    });
  }

  if (req.method === "GET") {
    return res.status(200).json({ operation_code: 1 });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};

// Export handler for Vercel serverless function
module.exports = handler; // Use CommonJS export
