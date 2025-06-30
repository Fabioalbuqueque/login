
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {  Router } from '@angular/router';

interface Usuario{
  name: string;
  email: string;
  password:string;
}


@Component({
  selector: 'app-auth',
  imports: [
    FormsModule, ReactiveFormsModule, CommonModule
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth  implements OnInit{
form! : FormGroup;
isLoginMode = true;

constructor( private fb: FormBuilder, private router: Router) {}

ngOnInit(): void {
    this.setupForm();
}

setupForm(): void {
  this.form = this.fb.group({
    name: [this.isLoginMode ? '' : '', this.isLoginMode ? [] : [Validators.required]],
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
}
  toggleMode(): void {
  this.isLoginMode = !this.isLoginMode;

  const nameControl = this.form.get('name');
  if (this.isLoginMode) {
    nameControl?.clearValidators();
  } else {
    nameControl?.setValidators([Validators.required]);
  }
  nameControl?.updateValueAndValidity();
}

  getUsuarios(): Usuario[]{
    const dados = localStorage.getItem( 'usuarios' );
    return dados? JSON.parse(dados) : [];
  }

  salvarUsuarios(lista: Usuario[]): void{
    localStorage.setItem( 'usuarios', JSON.stringify(lista) )
  }
  onSubmit(): void {
  if (this.form.invalid) {
    console.log('Form inválido:', this.form.errors);
    return;
  }

  console.log('Form values:', this.form.value);

  const { name, email, password } = this.form.value;
  const usuarios = this.getUsuarios();

  if (this.isLoginMode) {
    const usuario = usuarios.find(
      (usuario) => usuario.email === email && usuario.password === password
    );
    if (usuario) {
      console.log('Login bem-sucedido!', usuario);
      localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
      this.router.navigate(['/home']);
    } else {
      alert('Email ou senha inválidos!');
      console.log('Login falhou');
    }
  } else {
    const usuarioJaExiste = usuarios.some((usuario) => usuario.email === email);
    if (usuarioJaExiste) {
      alert('Email já existe!');
      return;
    }

    const novoUsuario: Usuario = { name, email, password };
    usuarios.push(novoUsuario);
    this.salvarUsuarios(usuarios);
    console.log('Usuário criado com sucesso!', novoUsuario);
    alert('Cadastro criado com sucesso');
    this.form.reset(); // Corrigido
  }
}
}

