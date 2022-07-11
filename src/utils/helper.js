export const getRandom = (min, max) => {
    return Math.random() * (max - min) + min;
}

export const normalize = (value) => (value + 1) / 2;
