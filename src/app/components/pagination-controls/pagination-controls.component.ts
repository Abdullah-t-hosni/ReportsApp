import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pagination-controls',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './pagination-controls.component.html',
  styleUrls: ['./pagination-controls.component.scss']
})
export class PaginationControlsComponent {
  @Input() length = 0; // total items
  @Input() pageSize = 10;
  @Input() pageIndex = 0; // zero-based
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return this.pageSize > 0 ? Math.max(1, Math.ceil(this.length / this.pageSize)) : 1;
  }

  get canPrev(): boolean { return this.pageIndex > 0; }
  get canNext(): boolean { return this.pageIndex < this.totalPages - 1; }

  goFirst() { if (this.pageIndex !== 0) this.emit(0); }
  goPrev() { if (this.canPrev) this.emit(this.pageIndex - 1); }
  goNext() { if (this.canNext) this.emit(this.pageIndex + 1); }
  goLast() { const last = this.totalPages - 1; if (this.pageIndex !== last) this.emit(last); }

  private emit(index: number) { this.pageChange.emit(index); }
}
