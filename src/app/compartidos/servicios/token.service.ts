import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  guardarToken(token: string) {
    // localStorage.setItem('token', token);
    setCookie('token-dscable', token, {expires: 365, path: '/'});
  }

  obtenerToken(){
    // const token = localStorage.getItem('token');
    const token = getCookie('token-dscable');
    return token;
  }

  eliminarToken() {
    // localStorage.removeItem('token');
    removeCookie('token-dscable');
  }
}
