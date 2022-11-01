export interface Domain {
    propertiesDesc: string,
    properties: string[],
    indicationsDesc: string,
    indications: string[],
    synergies: string[]
}
export interface Health extends Domain{
}
export interface Mood extends Domain{
}
export interface Beauty extends Domain{
}
export interface kitchen {
    kitchenDesc: string,
    details: string[],
}
export interface Recipes {
    recipesTitle: string[],
    recipesContent: string[],
}
export interface Oil {
    name: string,
    image: string,
    description?: string,
    health: Health,
    mood: Mood,
    beauty: Beauty,
    kitchen: kitchen,
    precautions: string[],
    recipes: Recipes,
    ideal: string[],
    utilisations?: string[]
}