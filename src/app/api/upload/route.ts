import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Không tìm thấy tệp tin" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), "public", "uploads");

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Already exists
        }

        const extension = path.extname(file.name) || ".jpg";
        const filename = `${uuidv4()}${extension}`;
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);

        const url = `/uploads/${filename}`;
        return NextResponse.json({ url });
    } catch (error: any) {
        console.error("UPLOAD_ERROR:", error);
        return NextResponse.json({ error: "Lỗi khi tải ảnh lên server" }, { status: 500 });
    }
}
