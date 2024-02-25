import path from 'path';

export function slugify(filePath: string) {
    return path.parse(filePath).name.toLowerCase().replace(/ /g, '-');
}