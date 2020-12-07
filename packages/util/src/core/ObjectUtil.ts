type WithoutUndefined<T> = T extends undefined ? never : T;

function firstKey<T extends object>(object: T): keyof T | null {
    const keys = Object.keys(object);
    return keys.length > 0 ? (keys[0] as keyof T) : null;
}

/**
 * Similar to Object.assign, differences are:
 * - Type Checking
 * - Null-case Handling
 */
function safeAssign<T extends object | undefined | null>(object: T, updatedFields: Partial<NonNullable<T>> | undefined | null): T {
    if (object) {
        return Object.assign(object, updatedFields);
    } else {
        return object;
    }
}

/**
 * Attention:
 * Undefined object values will be ignored.
 * E.g: {a: 10, b: undefined} is treated as {a: 10}.
 */
function toObject<T extends object, V>(object: T, mapperCallback: (key: keyof T, value: WithoutUndefined<T[keyof T]>, index: number) => WithoutUndefined<V>): Record<keyof T, WithoutUndefined<V>> {
    const newObject = {};
    Object.keys(object).forEach((key, index) => {
        if (object[key] !== undefined) {
            const mappedValue = mapperCallback(key as keyof T & string, object[key], index);
            newObject[key] = mappedValue;
        }
    });

    return newObject as Record<keyof T, WithoutUndefined<V>>;
}

/**
 * Attention:
 * Undefined object values will be ignored.
 * E.g: {a: 10, b: undefined} is treated as {a: 10}.
 */
function toArray<T extends object, V>(object: T, mapperCallback: (key: keyof T & string, value: WithoutUndefined<T[keyof T]>, index: number) => WithoutUndefined<V>): WithoutUndefined<V>[] {
    const result: WithoutUndefined<V>[] = [];
    Object.keys(object).forEach((key, index) => object[key] !== undefined && result.push(mapperCallback(key as keyof T & string, object[key], index)));
    return result;
}

/**
 * Attention:
 * Undefined object values will be ignored.
 * E.g: {a: 10, b: undefined} is treated as {a: 10}.
 */
function forEach<T extends object>(object: T, forEachCallback: (key: keyof T & string, value: WithoutUndefined<T[keyof T]>, index: number) => any): void {
    Object.keys(object).forEach((key, index) => object[key] !== undefined && forEachCallback(key as keyof T & string, object[key], index));
}

/**
 * Attention:
 * Undefined object values will be ignored.
 * E.g: {a: 10, b: undefined} is treated as {a: 10}.
 * This function will return the first matched key, or null.
 */
function findKey<T extends object>(object: T, value: WithoutUndefined<T[keyof T]>): keyof T | null {
    let matchedKey: keyof T | null = null;
    forEach(object, key => {
        if (object[key] === value) {
            matchedKey = key;
        }
    });
    return matchedKey;
}

function isEmpty(object: object): boolean {
    return Object.keys(object).length === 0;
}

/**
 * Attention:
 * Not applicable to object with cyclic reference.
 */
function deepClone<T extends object>(object: T): T {
    const innerDeepClone = (innerObject: any, isInnerLevel: boolean = true): any => {
        if (innerObject === object && isInnerLevel) {
            throw new Error(`[util] Object contains some field referencing itself: ${JSON.stringify(object)}`);
        }

        // Primitive types: null / undefined / number / string / boolean / bigint / symbol / function
        // Because typeof null === "object", we have to judge this case first
        if (null == innerObject || "object" !== typeof innerObject) {
            return innerObject;
        }

        // The following order is important, because array/date are also instance-of Object
        if (innerObject instanceof Date) {
            return new Date(innerObject.getTime());
        }

        if (innerObject instanceof Array) {
            return innerObject.map(_ => innerDeepClone(_));
        }

        if (innerObject instanceof Object) {
            const newObject: any = {};
            for (const attr in innerObject) {
                // eslint-disable-next-line no-prototype-builtins -- using for-in loop requires checking object.hasOwnProperty to exclude properties up from the prototype chain
                if (innerObject.hasOwnProperty(attr)) {
                    newObject[attr] = innerDeepClone(innerObject[attr]);
                }
            }
            return newObject;
        }

        return innerObject;
    };

    return innerDeepClone(object, false);
}

function sortByKeys<T extends object>(object: T, priorityList: ReadonlyArray<keyof T>): T {
    const objectKeys = Object.keys(object) as Array<keyof T>;
    objectKeys.sort((a, b) => {
        const aIndex = priorityList.indexOf(a);
        const bIndex = priorityList.indexOf(b);
        if (aIndex < 0 && bIndex < 0) {
            return 0;
        } else if (aIndex < 0) {
            // b should be before a
            return 1;
        } else if (bIndex < 0) {
            // a should be before b
            return -1;
        } else {
            return aIndex - bIndex;
        }
    });
    const obj: T = {} as T;
    objectKeys.forEach(_ => (obj[_] = object[_]));
    return obj;
}

export const ObjectUtil = Object.freeze({
    firstKey,
    safeAssign,
    toObject,
    toArray,
    forEach,
    isEmpty,
    findKey,
    deepClone,
    sortByKeys,
});
