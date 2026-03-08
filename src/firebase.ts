import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCuwG-uYHCrGzhHFoWZy_-Jhsq8ccsd7LA", 
  authDomain: "mindcare-project-486117.firebaseapp.com", 
  projectId: "mindcare-project-486117" 
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);