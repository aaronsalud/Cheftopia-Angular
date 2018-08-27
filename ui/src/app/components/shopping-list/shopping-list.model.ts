import { Ingredient } from '../shared/ingredient.model';

export class ShoppingList {
    public id: number;
    public name: string;
    public description: string;
    public archived: boolean;
    public ingredients: Ingredient[];

    constructor(
        id: number,
        name: string,
        desc: string,
        archived: boolean,
        ingredients: Ingredient[]
    ) {
        this.id = id;
        this.name = name;
        this.description = desc;
        this.archived = archived;
        this.ingredients = ingredients;
    }
}