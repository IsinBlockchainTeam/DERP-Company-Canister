
export class StatementItem {
    id: number;
    name: string;
    currency: string;
    category?: number;

    constructor(
        id: number,
        name: string,
        currency: string,
        category?: number,
    ) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.currency = currency;
    }

    toDto(): StatementItemDto {
        return new StatementItemDto(
            this.id,
            this.name,
            this.currency,
            this.category ? [this.category] : [],
        );
    }

    static fromDto(dto: StatementItemDto): StatementItem {
        return new StatementItem(
            dto.id,
            dto.name,
            dto.currency,
            dto.category.length > 0 ? dto.category[0] : undefined,
        );
    }
}

export class StatementItemDto {
    id: number;
    name: string;
    currency: string;
    category: [number] | [];

    constructor(
        id: number,
        name: string,
        currency: string,
        category: [number] | []
    ) {
        this.id = id;
        this.name = name;
        this.currency = currency;
        this.category = category;
    }
}

export class StatementItemAggregate {
    parentStatementItemId: number;
    total: number;
    year: number;
    month?: number;
    day?: number;

    constructor(
        parentStatementItemId: number,
        total: number,
        year: number,
        month?: number,
        day?: number,
    ) {
        this.parentStatementItemId = parentStatementItemId;
        this.total = total;
        this.year = year;
        this.month = month;
        this.day = day;
    }

    toDto(): StatementItemAggregateDto {
        return new StatementItemAggregateDto(
            this.parentStatementItemId,
            this.total,
            this.year,
            this.month != undefined ? [this.month] : [],
            this.day != undefined ? [this.day] : [],
        );
    }

    static fromDto(dto: StatementItemAggregateDto): StatementItemAggregate {
        return new StatementItemAggregate(
            dto.parentStatementItemId,
            dto.total,
            dto.year,
            dto.month.length > 0 ? dto.month[0] : undefined,
            dto.day.length > 0 ? dto.day[0] : undefined,
        );
    }
}

export class StatementItemAggregateDto {
    parentStatementItemId: number;
    total: number;
    year: number;
    month: [number] | [];
    day: [number] | [];

    constructor(
        parentStatementItemId: number,
        total: number,
        year: number,
        month: [number] | [],
        day: [number] | [],
    ) {
        this.parentStatementItemId = parentStatementItemId;
        this.total = total;
        this.year = year;
        this.month = month;
        this.day = day;
    }
}
