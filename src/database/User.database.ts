import { collection, addDoc, getDocs, query, updateDoc } from "@firebase/firestore";
import { db } from "@/configs/firebase";
import User from "@/interfaces/User.interface";

async function createUser(obj: User) {
    const user = await getUserById(obj.userId);
    if (user)
        return user;

    const usersCollectionRef = collection(db, 'user');
    const newUser: User = {
        userName: obj.userName,
        userId: obj.userId,
        salario: 0,
    };
    const doc = addDoc(usersCollectionRef, newUser);
    return doc
}

async function getUserById(userId: string) {
    const usersCollectionRef = collection(db, 'user');
    const usersQuery = query(usersCollectionRef);
    const rs = await getDocs(usersQuery);
    const user = rs.docs.find(userData => {
        const data = userData.data();
        if (data.userId == userId)
            return data
    });
    return user?.data();
}

async function updateUser(obj: User){
    const usersCollectionRef = collection(db, 'user');    
    const usersQuery = query(usersCollectionRef);
    const rs = await getDocs(usersQuery);
    const user = rs.docs.find(userData => {
        const data = userData.data();
        if (data.userId == obj.userId)
            return data
    });
    if(user != undefined){
        const docRef = user.ref
        await updateDoc(docRef, {salario: obj.salario});
    }
}

async function getUsers(){
    const usersCollectionRef = collection(db, 'user');    
    const usersQuery = query(usersCollectionRef);
    const rs = await getDocs(usersQuery);
    return rs.docs
}


export { createUser, getUserById, updateUser, getUsers }