import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Exercise } from '../exercise';
import { TrainingService } from '../training.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit,OnDestroy {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state']
  dataSource = new MatTableDataSource<Exercise>();

  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  private exchangedSubscription: Subscription

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.exchangedSubscription = this.trainingService.finishedExercisesChanged.subscribe((exercises: Exercise[])=> {
      this.dataSource.data = exercises;
    })
    this.trainingService.fetchCompletedOrCancelledExercise();
  }
  ngAfterViewInit(){
    this.dataSource.sort = this.sort; 
    this.dataSource.paginator = this.paginator;
  }
  doFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }
  ngOnDestroy(){
    if(this.exchangedSubscription){
      this.exchangedSubscription.unsubscribe();
    }
  }

}
