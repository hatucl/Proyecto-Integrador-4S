import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../shared/cart';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent {
  items: any[] = [];

  checkoutForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    correo: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(private cartService: CartService) {
    this.items = this.cartService.items;
  }

  get total() {
    return this.items.reduce((suma, item) => suma + item.price, 0);
  }

  eliminarItem(index: number) {
    this.cartService.removeFromCart(index);
  }

  procesarCompra(){
    if(this.checkoutForm.valid){
      const datosUsuario = this.checkoutForm.value;
      alert(`¡Gracias por tu reserva, ${datosUsuario.nombre}! Tu factura llegara a ${datosUsuario.correo}.`);

      this.cartService.clearCart();
      this.items = [];
    } else {
      alert("Por favor, completa todos los campos correctamente.")
    }
  }
}