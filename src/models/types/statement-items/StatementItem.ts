
export class StatementItem {
    id: number;
    name: string;
    category: number;
    currency: string;

    constructor(
        id: number,
        name: string,
        category: number,
        currency: string,
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
            this.category,
            this.currency,
        );
    }
}

export class StatementItemDto extends StatementItem {
    constructor(
        id: number,
        name: string,
        category: number,
        currency: string,
    ) {
        super(id, name, category, currency);
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
