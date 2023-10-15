import React, { useEffect, useState } from "react";
import MainPage from "../templates/MainPage/MainPage";
import ReactMarkdown from "react-markdown";

/** Component that renders Markdown content */
const MarkdownRenderer: React.FC = () => {
  const [markdown, setMarkdown] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the Markdown file from the public directory
    fetch("/manual.md") // Assuming manual.md is in the public directory
      .then((response) => response.text())
      .then((text) => setMarkdown(text))
      .catch((error) => console.error("Error fetching Markdown:", error));
  }, []);

  return (
    <div className="markdown-container">
      {markdown && <ReactMarkdown>{markdown}</ReactMarkdown>}
    </div>
  );
};

/** Page that renders the user manual of the app */
const Information = () => {
  return (
    <MainPage>
      <h1>Instrucciones de uso</h1>
      <MarkdownRenderer />
      {/* Separator */}
      <div className="my-5" />
    </MainPage>
  );
};

export default Information;
