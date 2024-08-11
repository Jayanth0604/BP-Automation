import React, { useState } from "react";
import "./styles.css";

const ContentChecker = () => {
  const [text, setText] = useState("");
  const [processedText, setProcessedText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const numberWordsToNumbers = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
    ten: "10"
  };

  const unitConversions = [
    { pattern: /(\d+)\s*width/gi, replacement: "$1 W" },
    { pattern: /(\d+)\s*height/gi, replacement: "$1 H" },
    { pattern: /(\d+)\s*depth/gi, replacement: "$1 D" },
    { pattern: /(\d+)\s*degree/gi, replacement: "$1°" },
    { pattern: /(\d+)\s*\*/gi, replacement: "$1 x" },
    { pattern: /(\d+)\s*gallons\s*per\s*minute/gi, replacement: "$1 GPM" },
    { pattern: /(\d+)\s*gallon\s*per\s*minute/gi, replacement: "$1 GPM" },
    { pattern: /(\d+)\s*length/gi, replacement: "$1 L" },
    { pattern: /(\d+)\s*-inch(?:es)?/gi, replacement: "$1 in." },
    { pattern: /(\d+)\s*inch(?:es)?/gi, replacement: "$1 in." },
    { pattern: /(\d+)\s*foot|feet/gi, replacement: "$1 ft." },
    { pattern: /(\d+)\s*-feet(?:es)?/gi, replacement: "$1 in." }
  ];

  const removeStartingWords = (text) => {
    const wordsToRemove = ["The", "This", "These", "An", "A", "It", "Its"];
    const regex = new RegExp(`^\\s*(${wordsToRemove.join("|")})\\s+`, "i");

    return text.replace(regex, "").replace(/^\s*\w/, (c) => c.toUpperCase());
  };

  const capitalizeFirstLetter = (text) => {
    // List of units that should remain uppercase
    const units = ["W", "H", "D", "GPM", "L", "in.", "ft."];

    // Split text into sentences
    let sentences = text.toLowerCase().split(/(?<=[.!?])\s+/);

    // Process each sentence
    sentences = sentences.map((sentence) => {
      sentence = removeStartingWords(sentence);
      return sentence.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    });

    const result = sentences.join(" ");

    // Ensure units remain uppercase
    return result.replace(
      new RegExp(`\\b(${units.join("|")})\\b`, "g"),
      (unit) => unit.toUpperCase()
    );
  };

  const replaceText = (inputText) => {
    let result = inputText.replace(/&/g, "and");

    // Replace number words with numbers
    for (const [word, number] of Object.entries(numberWordsToNumbers)) {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      result = result.replace(regex, number);
    }

    // Convert specific units if they appear near a number
    for (const { pattern, replacement } of unitConversions) {
      result = result.replace(pattern, replacement);
    }
    result = result.replace(/[.!?]/g, ",");
    result = result.replace(/[!?]/g, ".");
    result = result.replace(/[$#]/g, "");
    result = result.replace(/[$*]/g, "");
    result = result.replace(/(\d+)\s*["]/g, "$1 in.");
    result = result.replace(/(\d+)\s*[']/g, "$1 ft.");

    // Convert the first letter of each sentence to uppercase, others to lowercase
    result = capitalizeFirstLetter(result);

    return result;
  };

  const handleChange = (event) => {
    setText(event.target.value);
    setErrorMessage("");
  };

  const handleProcess = () => {
    const processed = replaceText(text);
    setProcessedText(processed);

    if (processed.length > 550) {
      setErrorMessage(
        "This content exceeds 550 characters. Kindly have a look at it."
      );
    } else {
      setErrorMessage("");
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(processedText)
      .then(() => {
        alert("Processed text copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };

  return (
    <div>
      <h1>Bullet points</h1>
      <textarea
        value={text}
        className="text"
        onChange={handleChange}
        placeholder="Enter the paragraph here..."
        rows="6"
        cols="50"
      />
      <br />
      <button onClick={handleProcess}>Process Text</button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <div className="result1">
        <h2>Processed Text</h2>
        <p>{processedText}</p>
        <button onClick={handleCopyToClipboard} className="clipboard-button">
          📋
        </button>
      </div>
    </div>
  );
};

export default ContentChecker;
