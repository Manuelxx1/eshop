import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.html',
  styleUrls: ['./categoria.css']
})
export class Categoria implements OnInit {
  categoriaNombre: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.categoriaNombre = this.route.snapshot.paramMap.get('nombre') || '';
  }
}
