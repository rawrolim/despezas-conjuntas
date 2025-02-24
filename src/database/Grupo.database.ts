import { collection, addDoc, getDocs, query, deleteDoc, doc, updateDoc } from "@firebase/firestore";
import { db } from "@/configs/firebase";
import Grupo from "@/interfaces/Grupo.interface";
import Despesa from "@/interfaces/Despesa.interface";

async function createGroup(obj: Grupo) {
    const groupsCollectionRef = collection(db, 'groups');
    const newGroup = {
        name: obj.name,
        users: obj.users,
        createdAt: new Date().toString(),
        despesas: []
    };
    const doc = addDoc(groupsCollectionRef, newGroup);
    return doc
}

async function getGroups(userId: string = '') {
    const groupsCollectionRef = collection(db, 'groups');
    const groupsQuery = query(groupsCollectionRef);
    const rs = await getDocs(groupsQuery);
    const docs = rs.docs
        .map(d => {
            const data = d.data();
            const group: Grupo = {
                createdAt: data.createdAt,
                id: d.id,
                name: data.name,
                users: data.users,
                despesas: data.despesas
            }
            return group;
        });
    if (userId) {
        const group = docs.filter((doc: any) => {
            const userExist = doc.users.find((user: string) => user == userId);
            if (userExist)
                return doc
        });
        return group;
    }else{
        return docs;
    }
}

async function deleteGroup(docId: string) {
    const docRef = doc(db, 'groups', docId);
    await deleteDoc(docRef);
}

async function addDespesas(groupId: string, despesa: Despesa, userId: string) {
    const docRef = doc(db, 'groups', groupId);
    const dataTemp: any = (await getGroups(userId)).find(d => d.id == groupId);
    dataTemp.despesas.push(despesa);
    await updateDoc(docRef, dataTemp);
}

async function deleteDespesa(groupId: string, despesa: Despesa, userId: string){
    const docRef = doc(db, 'groups', groupId);
    const dataTemp: Grupo | undefined | any = (await getGroups(userId)).find(d => d.id == groupId);
    if(!dataTemp)
        throw new Error("Grupo não encontrado.");

    const index = dataTemp.despesas.findIndex((d: Grupo | any) => d.name == despesa.name && d.valor == despesa.valor);
    dataTemp.despesas.splice(index,1)
    await updateDoc(docRef, dataTemp);
}

async function addUserOnGroup(groupId: string, userId: string) {
    const docRef = doc(db, 'groups', groupId);
    const dataTemp: any = (await getGroups('')).find(d => d.id == groupId);
    dataTemp.users.push(userId);
    await updateDoc(docRef, dataTemp);
}

export { createGroup, getGroups, deleteGroup, addDespesas, addUserOnGroup, deleteDespesa }