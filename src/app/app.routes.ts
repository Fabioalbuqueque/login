import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent:() => 
             import('./pages/auth/auth').then(module => module.Auth)
    },
    {
        path: 'home',
        loadComponent:() => 
             import('./pages/home/home').then(module => module.Home)
    },
    
    


    
];
