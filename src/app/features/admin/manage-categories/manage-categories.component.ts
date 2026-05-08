import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Category } from '../../../core/models/categories.interface';
import { CategoriesService } from '../../../core/services/categories.service';
import { ToastService } from '../../../shared/ui/toast/toast.service';

type ActiveFilter = 'active' | 'inactive' | 'all';

@Component({
  selector: 'app-manage-categories',
  imports: [FormsModule],
  templateUrl: './manage-categories.component.html',
})
export class ManageCategoriesComponent {
  readonly categories = signal<Category[]>([]);
  readonly activeFilter = signal<ActiveFilter>('active');
  readonly newName = signal('');
  readonly editingId = signal<number | null>(null);
  readonly editingName = signal('');

  readonly filteredCategories = computed(() => this.categories().filter((category) => this.activeFilter() === 'all' || (this.activeFilter() === 'active' ? category.active : !category.active)));

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly toast: ToastService,
  ) {
    this.load();
  }

  create(): void {
    const name = this.newName().trim();
    if (!name) return;
    this.categoriesService.create(name).subscribe({ next: () => { this.toast.success('Category created.'); this.newName.set(''); this.load(); }, error: () => this.toast.error('Unable to create category.') });
  }

  edit(category: Category): void {
    this.editingId.set(category.id);
    this.editingName.set(category.name);
  }

  saveName(category: Category): void {
    this.categoriesService.update(category.id, { NewName: this.editingName().trim() }).subscribe({ next: () => { this.toast.success('Category updated.'); this.editingId.set(null); this.load(); }, error: () => this.toast.error('Unable to update category.') });
  }

  toggleActive(category: Category): void {
    const warning = category.active ? 'Deactivating this category will also deactivate all dishes in this category. Continue?' : 'Activate this category?';
    if (!window.confirm(warning)) return;
    this.categoriesService.update(category.id, { Active: !category.active }).subscribe({ next: () => { this.toast.success(category.active ? 'Category deactivated.' : 'Category activated.'); this.load(); }, error: () => this.toast.error('Unable to update category.') });
  }

  private load(): void {
    this.categoriesService.getAll().subscribe({ next: (categories) => this.categories.set(categories.data ?? []), error: () => this.toast.error('Unable to load categories.') });
  }
}
