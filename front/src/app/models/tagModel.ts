export class TagModel {
    label: string;
    color: TagColors;

    constructor(label: string, color: TagColors = TagColors.BLUE) {
        this.label = label;
        this.color = color;
    }
}

export enum TagColors {
    BLUE = '#30A9DE',
    YELLOW = '#EFDC05',
    RED = '#E53A40',
    PURPLE = '#A593E0',
    ORANGE = '#F6B352',
    GREEN = '#8CD790',
    LIGHT_BLUE = '#84B1ED',
    PINK = '#FADAD8'
}
