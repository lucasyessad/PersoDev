import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

/** Route API : Upload d'image vers Cloudinary (avec fallback Supabase Storage) */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = (formData.get("type") as string) || "listing";

    if (!file) {
      return NextResponse.json({ erreur: "Fichier requis" }, { status: 400 });
    }

    // Vérifier la taille (max 10 Mo)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { erreur: "Le fichier ne doit pas dépasser 10 Mo" },
        { status: 400 }
      );
    }

    // Vérifier le type MIME côté client (première vérification)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { erreur: "Seules les images sont acceptées" },
        { status: 400 }
      );
    }

    // Validation serveur via magic bytes (le type MIME client est spoofable)
    const headerBytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const isValidImage =
      (headerBytes[0] === 0xFF && headerBytes[1] === 0xD8) || // JPEG
      (headerBytes[0] === 0x89 && headerBytes[1] === 0x50) || // PNG
      (headerBytes[0] === 0x47 && headerBytes[1] === 0x49) || // GIF
      (headerBytes[0] === 0x52 && headerBytes[1] === 0x49 && headerBytes[8] === 0x57) || // WebP (RIFF...WEBP)
      (headerBytes[4] === 0x66 && headerBytes[5] === 0x74 && headerBytes[6] === 0x79 && headerBytes[7] === 0x70); // HEIC (ftyp)

    if (!isValidImage) {
      return NextResponse.json(
        { erreur: "Format d'image non reconnu" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();

    // Essayer Cloudinary d'abord
    if (process.env.CLOUDINARY_API_KEY) {
      try {
        const result = await uploadToCloudinary(buffer, {
          folder: `${type}s/${user.id}`,
          publicId: `${timestamp}-${file.name.replace(/\.[^.]+$/, "")}`,
          transformation: type === "logo" ? "agency_logo" : "listing_main",
        });

        return NextResponse.json({
          url: result.url,
          publicId: result.publicId,
          width: result.width,
          height: result.height,
          source: "cloudinary",
        });
      } catch (error) {
        console.error("Erreur Cloudinary, fallback Supabase:", error);
      }
    }

    // Fallback : Supabase Storage
    const nomFichier = `${user.id}/${timestamp}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("listing-photos")
      .upload(nomFichier, buffer, {
        contentType: file.type,
      });

    if (uploadError) {
      return NextResponse.json(
        { erreur: "Erreur lors de l'upload : " + uploadError.message },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from("listing-photos")
      .getPublicUrl(uploadData.path);

    return NextResponse.json({
      url: urlData.publicUrl,
      source: "supabase",
    });
  } catch {
    return NextResponse.json(
      { erreur: "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}
