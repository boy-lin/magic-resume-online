import { respData, respErr } from "@/lib/response";
import { newStorage } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;
    const name = formData.get("name") as string;
    const storage = newStorage();
    const url = await storage.uploadImage(image);

    return respData(url);
  } catch (error: any) {
    return respErr(error.message || "upload file failed");
  }
}
