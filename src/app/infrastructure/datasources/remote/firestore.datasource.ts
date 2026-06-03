import { inject, Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, getDoc, setDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { ReportFirestoreModel } from '../../models/report-firestore.model';

@Injectable({
  providedIn: 'root',
})
export class FirestoreDatasource {

  private firestore = inject(Firestore);

  async getAll(userId: string): Promise<ReportFirestoreModel[]> {
    const reportsRef = collection(this.firestore, 'reports');
    const q = query(reportsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReportFirestoreModel));
  }

  async getById(reportId: string): Promise<ReportFirestoreModel | null> {
    const docRef = doc(this.firestore, 'reports', reportId);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return { id: docSnapshot.id, ...docSnapshot.data() } as ReportFirestoreModel;
    }
    return null;
  }

  async save(report: ReportFirestoreModel): Promise<void> {
    const docRef = doc(this.firestore, 'reports', report.id);
    await setDoc(docRef, report);
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.firestore, 'reports', id);
    await deleteDoc(docRef);
  }
  
}
