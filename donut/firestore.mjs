import { getFirestore, doc, setDoc, collection, query, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'

export const db = getFirestore();

const docRef = doc(collection(db, 'expenses'));

export function addItem (item){
    return setDoc(docRef, item);
}

const queryExpenses = query(collection(db, "expenses"))

export function getData(data, cb){
    onSnapshot(queryExpenses, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            const doc = {
                ...change.doc.data(),
                id: change.doc.id
            }

            if (change.type === "added") {
                data.push(doc)
            }
            if (change.type === "modified") {
                const index = data.findIndex((data) => data.id === doc.id)
                data[index] = doc
            }
            if (change.type === "removed") {
                data = data.filter((data) => data.id !== doc.id)
            }
        })
        cb(data)
    });
}