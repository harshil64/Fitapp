import { Injectable } from '@angular/core';
import { Exercise } from '../training/exercise';
import { Subject, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
// import { map } from 'rxjs/operators';
// import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import { UiService } from '../shared/ui.service';


@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  // private finishedExercises: Exercise[] = [];
  private fbSubs : Subscription[] = [];

  constructor(private db: AngularFirestore, private uiService: UiService) { }

  fetchAvailableExercises(){
    this.uiService.loadingStateChanged.next(true);
    this.fbSubs.push(this.db.collection('availableExercises').snapshotChanges()
    .pipe(map(docArray => {
      // throw (new Error())
      return docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          name: doc.payload.doc.data(),
          duration: doc.payload.doc.data(),
          calories: doc.payload.doc.data()
        };
      });
    }))
    .subscribe((exercises: Exercise[]) => {
      this.availableExercises = exercises;
      this.exercisesChanged.next([...this.availableExercises]);
    }, error => {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackbar('Fetching Exercises Failed, Please try again later', null, 3000);
      this.exercisesChanged.next(null);
    }));

  }
  
  // fetchAvailableExercise(){
  //   this.db.collection('availableExercises').snapshotChanges().pipe(map(docArray => {
  //     docArray.map(doc => {
  //       return {
  //         id: doc.payload.doc.id,
  //         name: doc.payload.doc.data(),
  //         duration: doc.payload.doc.data().duration,
  //         calories: doc.payload.doc.data().calories
  //       };
  //     });
  //   }))
  //   .subscribe((exercises: Exercise[])=> {
  //     this.availableExercises = exercises;
  //     this.exercisesChanged.next([...this.availableExercises]);
  //   })
  // }

  // this.tasksCollection.snapshotChanges().pipe(
  //   map(
  //       changes => { return changes.map(a => {
  //       const data = a.payload.doc.data() as Task;
  //       data.id = a.payload.doc.id;
  //       return data;
  //     });
  //     }
  //   )).subscribe();

  startExercise(selectedId: string){
    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId)
    this.exerciseChanged.next({...this.runningExercise})
  }

  getRunningExercise(){
    return ({...this.runningExercise}); //Object spread operator - This would return brand new user with same properties but as a diff object
    //So if any part manipulates this runningExercise object they wont be able to manipulate MAIN runningExercise. which is private.
  }
  completeExercise(){
    this.addDatatoDatabase({...this.runningExercise, date:new Date(),state: 'completed'})
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number){
    this.addDatatoDatabase({...this.runningExercise,
      duration:this.runningExercise.duration *(progress / 100),
      calories:this.runningExercise.calories *(progress / 100), 
      date:new Date(),
      state: 'cancelled'})
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  fetchCompletedOrCancelledExercise(){
    this.fbSubs.push(this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
    this.finishedExercisesChanged.next(exercises);
    }));
  }

  cancelSubscription(){
    this.fbSubs.forEach(sub => sub.unsubscribe())
  }

  private addDatatoDatabase(exercise: Exercise){ //stores exercise into firebase
     this.db.collection('finishedExercises').add(exercise);
  }
}
