import { collection, doc, setDoc, deleteDoc, getDocs, updateDoc, deleteField, getDoc } from "firebase/firestore";
import { IService } from "../../interfaces";
import { DB } from "../firebase";

export const useService = () => {
  const priceRef = doc(collection(DB, 'other'), 'price');

  const setService = async (item: IService) => {
    await updateDoc(priceRef, {
      [item.id]: item,
    })
  };

  const removeService = async (item: IService) => {
    await updateDoc(priceRef, {
      [item.id]: deleteField(),
    });
  };

  const getServices = async () => {
    const snap = await getDoc(priceRef);
    const data = snap.data() as {
      [key: string]: IService
    }
    return data;
  }

  return {
    setService,
    removeService,
    getServices,
  }
}