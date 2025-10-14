export function isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}


export function validateUUID(id: string | undefined, fieldName: string = 'ID'): string {
    if (!id) {
        throw new Error(`${fieldName} is required`);
    }
    
    if (!isValidUUID(id)) {
        throw new Error(`Invalid ${fieldName} format`);
    }
    
    return id;
}

export function safeValidateUUID(id: string | undefined): { isValid: boolean; uuid?: string; error?: string } {
    if (!id) {
        return { isValid: false, error: 'ID is required' };
    }
    
    if (!isValidUUID(id)) {
        return { isValid: false, error: 'Invalid UUID format' };
    }
    
    return { isValid: true, uuid: id };
}