import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
});

export const PARENT_FOLDER_ID = process.env.GOOGLE_PARENT_FOLDER_ID || '';

export async function createDriveFolder(folderName: string, parentId: string): Promise<{ id: string, link: string }> {
    try {
        const fileMetadata = {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentId],
        };
        const response = await drive.files.create({
            requestBody: fileMetadata,
            fields: 'id, webViewLink',
        });
        
        await drive.permissions.create({
            fileId: response.data.id!,
            requestBody: { role: 'reader', type: 'anyone' },
        });

        return { id: response.data.id!, link: response.data.webViewLink! };
    } catch (error) {
        console.error('Gagal membuat folder Drive:', error);
        throw error;
    }
}

export async function uploadFileToDrive(filePath: string, fileName: string, folderId: string): Promise<string> {
    const mimeType = path.extname(fileName) === '.png' ? 'image/png' : 'image/jpeg';
    
    const response = await drive.files.create({
        requestBody: { name: fileName, parents: [folderId] },
        media: { mimeType: mimeType, body: fs.createReadStream(filePath) },
        fields: 'id, webViewLink',
    });

    return response.data.webViewLink || '';
}