export interface Exercise {
    id:string;
    name:string;
    duration:number;
    calories:number;
    date?:Date;
    state?: 'completed' | 'cancelled' | null;

}
//generated interface instead of class with type model.