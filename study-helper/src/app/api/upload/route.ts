import { NextRequest, NextResponse } from 'next/server';
import { IncomingForm, Fields, Files } from 'formidable';
import { createIncomingMessage } from 'http';
import path from 'path';
import { promises as fs } from 'fs';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'uploads');

export async function POST(request: NextRequest) {
  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10 MB limit
  });

  try {
    // Ensure the upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const formData = await new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
      const readableStream = new Readable();
      readableStream._read = () => {}; // _read is required but you can noop it
      readableStream.push(request.body);
      readableStream.push(null);

      const req = createIncomingMessage(request);
      form.parse(request.body, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const file = formData.files.file?.[0];
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Handle the uploaded file
    console.log('Uploaded file:', file.filepath);

    return NextResponse.json({ message: 'File uploaded successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error during file upload:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}