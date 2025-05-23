export class InvoicePartyReference {
  public id?: string;
  public name?: string;

  constructor(id?: string, name?: string) {
    this.id = id;
    this.name = name;
  }

  public toDto(): InvoicePartyReferenceDto {
    return {
      id: this.id ? [this.id] : [],
      name: this.name ? [this.name] : []
    };
  }

  static fromDto(dto: InvoicePartyReferenceDto): InvoicePartyReference {
    return new InvoicePartyReference(
      dto.id[0] || undefined,
      dto.name[0] || undefined
    );
  }

  public isValid(): boolean {
    return !!(this.id || this.name);
  }
}

export type InvoicePartyReferenceDto = {
  id: [string] | [];
  name: [string] | [];
} 