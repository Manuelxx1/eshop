import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  categoriaNombre: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.categoriaNombre = this.route.snapshot.paramMap.get('nombre') || '';
  }
}
