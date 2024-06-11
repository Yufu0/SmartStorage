import {TagModel} from "../models/tagModel";

export function getLabelsFromTags(tags: TagModel[]): string[] {
    return tags.map(tag => tag.label);
}
