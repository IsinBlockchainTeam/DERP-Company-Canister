export class StatementItem {
    id: number;
    name: string;
    category: number;
    currency: string;
    year: number;

    constructor(
        id: number,
        name: string,
        category: number,
        currency: string,
        year: number,
    ) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.currency = currency;
        this.year = year;
    }

    toPresentable(total: number): StatementItemPresentable {
        return new StatementItemPresentable(
            this.id,
            this.name,
            this.category,
            this.currency,
            this.year,
            total,
        );
    }
}

export class StatementItemPresentable extends StatementItem {
    total: number

    constructor(
        id: number,
        name: string,
        category: number,
        currency: string,
        year: number,
        total: number,
    ) {
        super(id, name, category, currency, year);
        this.total = total;
    }
}
