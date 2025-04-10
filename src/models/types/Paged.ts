import { PagedDto } from "./PagedDto";
import { Presentable } from "./Presentable";

type InferPresentable<T extends Presentable<any>> =
  T extends Presentable<infer O> ? O : never;

export class Paged<I extends Presentable<any>> {
  Items: I[];
  PageSize: number;
  PageNumber: number;
  TotalItems: number;
  TotalPages: number;

  constructor(
    items: I[],
    pageSize: number,
    pageNumber: number,
    totalItems: number,
    totalPages: number
  ) {
    this.Items = items;
    this.PageSize = pageSize;
    this.PageNumber = pageNumber;
    this.TotalItems = totalItems;
    this.TotalPages = totalPages;
  }

  async toDto(): Promise<PagedDto<InferPresentable<I>>> {
    const items = await Promise.all(
      this.Items.map((item) => item.toDto())
    )

    return {
      Items: items,
      PageSize: this.PageSize,
      PageNumber: this.PageNumber,
      TotalItems: this.TotalItems,
      TotalPages: this.TotalPages,
    }
  }
  
  static fromDto<T extends Presentable<any>>(
    dto: PagedDto<InferPresentable<T>>,
    itemFactory: (dto: InferPresentable<T>) => T
  ): Paged<T> {
    const items = dto.Items.map((item) => itemFactory(item));
    return new Paged(
      items,
      dto.PageSize,
      dto.PageNumber,
      dto.TotalItems,
      dto.TotalPages
    );
  }

  static from<I extends Presentable<any>>(
    array: I[],
    pageSize: number,
    pageNumber: number
  ): Paged<I> {
    const totalItems = array.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const safePageNumber = Math.max(1, Math.min(pageNumber, totalPages || 1)); // fallback a 1 se non ci sono pagine
    const start = (safePageNumber - 1) * pageSize;
    const end = start + pageSize;
    const items = array.slice(start, end);

    return new Paged<I>(items, pageSize, safePageNumber, totalItems, totalPages);
  }
};