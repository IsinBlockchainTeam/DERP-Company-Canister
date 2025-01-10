export class StatementItem {
    id: number;
    name: string;
    category: number;
    currency: string;

    constructor(
        id: number,
        name: string,
        category: number,
        currency: string
    ) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.currency = currency;
    }

    toPresentable(total: number): StatementItemPresentable {
        return new StatementItemPresentable(
            this.id,
            this.name,
            this.category,
            this.currency,
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
        total: number,
    ) {
        super(id, name, category, currency);
        this.total = total;
    }
}
