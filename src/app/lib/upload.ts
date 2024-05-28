import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../../firebaseConfig";

const storage = getStorage(app);
export const handleImageUpload = async (file: File) => {
  console.log(file);
  const metadata = {
    contentType: file?.type,
  };
  const imageRef = ref(storage, "image-store/" + file?.name);
  const uploadTask = uploadBytesResumable(imageRef, file, metadata);

  try {
    await new Promise<void>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Handle unsuccessful uploads
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          resolve();
        }
      );
    });

    // Get the download URL after the upload completes
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    console.log("File available at", downloadURL);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
