import { ResolveFn, Routes } from '@angular/router';
import { resolveUserTasks, TasksComponent } from '../tasks/tasks.component';
import { NewTaskComponent, canLeaveEditPage } from '../tasks/new-task/new-task.component';
import { TasksService } from '../tasks/tasks.service';
import { Task } from '../tasks/task/task.model';
import { inject } from '@angular/core';

//used loadChildren in app.routes.ts so by default TasksComponent is not loaded eagerly, so no need make lazyloading here
// export const resolveUserTasks: ResolveFn<Task[]> = (
//   activatedRouteSnapshot,
//   routerState
// ) => {
//   const order = activatedRouteSnapshot.queryParams['order'];
//   const tasksService = inject(TasksService);
//   const tasks = tasksService
//     .allTasks()
//     .filter(
//       (task) => task.userId === activatedRouteSnapshot.paramMap.get('userId')
//     );

//   if (order && order === 'asc') {
//     tasks.sort((a, b) => (a.id > b.id ? 1 : -1));
//   } else {
//     tasks.sort((a, b) => (a.id > b.id ? -1 : 1));
//   }

//   return tasks.length ? tasks : [];
// };

export const routes: Routes = [
  {
    path: '',
    providers: [TasksService], //lazyloading service so that all children component can use this service
    children:[
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full',
      },
      //lazyloading
      {
        path: 'tasks', // <your-domain>/users/<uid>/tasks
        component: TasksComponent,
        //used loadChildren in app.routes.ts so by default TasksComponent is not loaded eagerly, so no need make lazyloading here
        //loadComponent: () => import('../tasks/tasks.component').then(m => m.TasksComponent), //m= module
        runGuardsAndResolvers: 'always',
        resolve: {
          userTasks: resolveUserTasks,
        },
      },
      {
        path: 'tasks/new',
        component: NewTaskComponent,
        canDeactivate: [canLeaveEditPage]
      },
    ]
  }
];
