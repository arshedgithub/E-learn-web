export interface IValidationSchema {
    type: string;
    properties: Record<string, any>;
    required?: string[];
    additionalProperties?: boolean;
}
