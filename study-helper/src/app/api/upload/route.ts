import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const form = formidable({ multiples: true });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return reject(new NextResponse('Error parsing form', { status: 500 }));
      }

      try {
        // Handle file upload here
        console.log('Received files:', files);
        
        // For demonstration, we're just logging the file names
        const fileNames = Object.values(files).map((file: any) => file.originalFilename);
        
        return resolve(NextResponse.json({ success: true, files: fileNames }));
      } catch (error) {
        console.error('Error handling upload:', error);
        return reject(new NextResponse('Error handling upload', { status: 500 }));
      }
    });
  });
}

export async function GET() {
  return NextResponse.json({ message: 'Upload endpoint is working' });
}