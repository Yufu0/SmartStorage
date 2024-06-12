import {Routes} from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {HomeComponent} from "./pages/home/home.component";
import {UploadComponent} from "./pages/upload/upload.component";
import {SearchComponent} from "./pages/search/search.component";
import {LogsComponent} from "./pages/logs/logs.component";

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: 'home',
        component: HomeComponent,
        children: [
            { path: '', redirectTo: 'search', pathMatch: 'full' },
            { path: 'search', component: SearchComponent },
            { path: 'upload', component: UploadComponent }
        ]
    },
    { path: 'logs', component: LogsComponent}
];
