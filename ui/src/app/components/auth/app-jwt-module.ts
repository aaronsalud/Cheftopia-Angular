import { NgModule } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
  return localStorage.getItem('jwtToken');
}
@NgModule({
  imports: [
    JwtModule.forRoot({
      config: {
        tokenGetter
      }
    })
  ],
  exports: [JwtModule]
})
export class AppJwtModule {}
