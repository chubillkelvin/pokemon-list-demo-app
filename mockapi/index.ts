const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getSpriteById = (id: number): string => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export const getPokemonSprites = async (limit: number, offset: number): Promise<string[]> => {
    const sprites: string[] = [];
    for (let i = offset; i < offset + limit; i++) {
        sprites.push(getSpriteById(i));
    }
    await delay(500); // fake an api response delay
    return sprites;
};
