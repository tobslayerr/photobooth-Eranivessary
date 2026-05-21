import { Router, Request, Response } from 'express';
import RequestModel from '../models/RequestModel'; 
import { nanoid } from 'nanoid';
import fsp from 'fs/promises'; 
import path from 'path';
import multer from 'multer';
import { createDriveFolder, uploadFileToDrive, PARENT_FOLDER_ID } from '../services/gdrive';

const router = Router();

// Konfigurasi Multer
const tempDir = process.env.NODE_ENV === 'production' ? '/tmp' : 'uploads/softcopy_temp';

if (process.env.NODE_ENV !== 'production') {
    fsp.mkdir(tempDir, { recursive: true }).catch(() => {});
}

const softcopyStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = nanoid(5);
        const cleanName = file.originalname.replace(/\s+/g, '_');
        cb(null, `${Date.now()}_${uniqueSuffix}_${cleanName}`);
    },
});

// Update Multer untuk menerima multiple fields
const uploadFields = multer({ storage: softcopyStorage }).fields([
    { name: 'non_frame_files', maxCount: 50 },
    { name: 'frame_files', maxCount: 50 }
]);

router.post('/softcopy/upload-framed', uploadFields, async (req: Request, res: Response) => {
    try {
        const { session_id, contact_name } = req.body;
        
        // Casting req.files ke tipe yang benar
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const nonFrameFiles = files['non_frame_files'] || [];
        const frameFiles = files['frame_files'] || [];

        if (!contact_name) {
            return res.status(400).json({ message: 'Nama wajib diisi.' });
        }

        // 1. Buat Folder Root (Nama User)
        const cleanName = contact_name.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '_');
        const rootFolderName = `${cleanName}_${Date.now().toString().slice(-4)}`;
        
        const rootFolder = await createDriveFolder(rootFolderName, PARENT_FOLDER_ID);
        const driveLink = rootFolder.link;

        // 2. Buat Sub-folder 'non_frame' dan 'frame' di dalam Root Folder
        const nonFrameFolder = await createDriveFolder('nonframe', rootFolder.id);
        const frameFolder = await createDriveFolder('frame', rootFolder.id);

        // 3. Upload Foto Non-Frame (Foto Asli)
        for (let i = 0; i < nonFrameFiles.length; i++) {
            const file = nonFrameFiles[i];
            try {
                await uploadFileToDrive(file.path, file.originalname, nonFrameFolder.id);
            } catch (e) {
                console.error('Upload error non-frame:', e);
            } finally {
                try { await fsp.unlink(file.path); } catch (e) {}
            }
        }

        // 4. Upload Foto Frame (Hasil Edit)
        for (let i = 0; i < frameFiles.length; i++) {
            const file = frameFiles[i];
            try {
                await uploadFileToDrive(file.path, file.originalname, frameFolder.id);
            } catch (e) {
                console.error('Upload error frame:', e);
            } finally {
                try { await fsp.unlink(file.path); } catch (e) {}
            }
        }

        // 5. Simpan ke MongoDB
        const newRequest = new RequestModel({
            session_id: session_id || null,
            contact_name: contact_name,
            selected_photos: driveLink,
            frame_choice: 'MIXED',
            status: 'SENT'
        });

        await newRequest.save();

        res.status(201).json({
            message: 'Upload berhasil.',
            driveLink: driveLink,
        });
        
    } catch (error) {
        console.error('Error saat upload softcopy:', error);
        res.status(500).json({ message: 'Gagal memproses upload.' });
    }
});

router.get('/test-db', async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const state = mongoose.connection.readyState;
        res.json({ status: state === 1 ? 'Koneksi MongoDB Berhasil' : 'Koneksi Terputus' });
    } catch (error) {
        res.status(500).json({ message: 'Koneksi DB Gagal', error });
    }
});

export default router;