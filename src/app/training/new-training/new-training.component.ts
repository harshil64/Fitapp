import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';
import { UiService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
 @Output() trainingStart = new EventEmitter<void>();
 exercises: Exercise[];
 private exerciseSubscription: Subscription;
 private loadingSubscription: Subscription;
 isLoading= true;


  constructor(private trainingService: TrainingService,private uiService: UiService) { }

  ngOnInit(): void {
    // this.exercises = this.trainingService.getAvailableExercises();
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises => {
      this.exercises = exercises;
    })
    this.fetchExercises();
}
  onStartTraining(form: NgForm){
    // this.trainingStart.emit(); updated to below code
   this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises => {
     this.exercises = exercises
   });
    this.trainingService.startExercise(form.value.exercise)
  }
  ngOnDestroy(){
    if(this.exerciseSubscription){
      this.exerciseSubscription.unsubscribe();
    }
    if(this.loadingSubscription){
      this.loadingSubscription.unsubscribe();
    }
  }
  fetchExercises(){ //created this method to implement click on button as direct fetchAvailEx was from training.serv.ts file
    this.trainingService.fetchAvailableExercises();
  }
}