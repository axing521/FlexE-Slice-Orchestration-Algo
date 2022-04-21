/***
 * @creater:ACBash
 * @create_time:22-4-20 14:49:50
 * @last_modify:ACBash
 * @modify_time:22-4-20 16:12:16
 * @line_count:25
 **/

export function defaultToString(item) {
    if (item === null) {
        return 'NULL';
    }else if (item === undefined) {
        return 'UNDEFINED';
    }else if (typeof item === 'string' || item instanceof String) {
        return `${item}`;
    }
    
    return item.toString();
}

export const Colors={
    WHITE:0,
    GREY:1,
    BLACK:2
}

export const initializeColor= vertices => {
    const color={};
    for(let i=0;i<vertices.length;i++){
        color[vertices[i]]=Colors.WHITE;
    }
    return color;
}