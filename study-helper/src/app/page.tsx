"use client"

import { useState } from 'react';

interface Flashcard {
  question: string;
  answer: string;
}

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus('Upload successful!');
        const data = await response.json();
        // Assuming the API response contains flashcards in the following format
        setFlashcards(data.flashcards);
      } else {
        setUploadStatus('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Upload failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Your Textbook PDF</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Upload PDF
        </button>
      </form>
      {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
      {flashcards.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Flashcards</h2>
          {flashcards.map((flashcard, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-md">
              <p className="font-bold">Question:</p>
              <p>{flashcard.question}</p>
              <p className="mt-2 font-bold">Answer:</p>
              <p>{flashcard.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
