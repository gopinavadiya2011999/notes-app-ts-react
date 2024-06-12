import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { v4 as uuidv4 } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyCQaKZ3K-H01k4hD2sgdPdhVruxsLitwiA",
  authDomain: "notes-app-dcb1f.firebaseapp.com",
  projectId: "notes-app-dcb1f",
  storageBucket: "notes-app-dcb1f.appspot.com",
  messagingSenderId: "953228763302",
  appId: "1:953228763302:web:07e1b8a29f24d6f7dc9467",
  measurementId: "G-N7B0WKJVER"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

export const uploadImageToFirebase = async (base64Data: string): Promise<string> => {
  try {
    // Decode base64 data
    const imageBlob = await fetch(base64Data).then((res) => res.blob());

    // Upload image to Firebase Storage
    const storageRef = ref(storage, uuidv4());
    await uploadBytes(storageRef, imageBlob); 

    // Get URL of the uploaded image
    const imageUrl = await getDownloadURL(storageRef); 
    
    return imageUrl;
  } catch (error) {
    console.error('Error uploading image to Firebase:', error);
    throw error;
  }
};
