/**
 * TypeScript Practice: Operator + Motion Combinations
 *
 * This file contains TypeScript code designed for practicing operator and motion combinations
 * such as dw, cw, yap, di", ca{, etc. Focus on combining delete, change, and yank
 * operators with various motions and text objects.
 *
 * Practice editing efficiently by combining operators with word, paragraph, and text object motions.
 */

// Code with repetitive patterns for practicing operator+motion combinations
class DataTransformationService {
  private transformationRules: TransformationRule[];
  private validationRules: ValidationRule[];
  private processingPipeline: ProcessingStep[];
  private errorHandlers: ErrorHandler[];

  constructor(config: TransformationConfig) {
    this.transformationRules = config.transformationRules || [];
    this.validationRules = config.validationRules || [];
    this.processingPipeline = config.processingPipeline || [];
    this.errorHandlers = config.errorHandlers || [];
  }

  // Method with long parameter list for practicing dw, cw on parameters
  processDataWithComplexParameters(
    inputData: InputDataStructure,
    transformationOptions: TransformationOptions,
    validationSettings: ValidationSettings,
    outputConfiguration: OutputConfiguration,
    errorHandlingMode: ErrorHandlingMode,
    loggingLevel: LoggingLevel,
    performanceMetrics: PerformanceMetrics,
    cacheSettings: CacheSettings
  ): Promise<ProcessedDataResult> {
    const startTime = performance.now();
    const correlationId = this.generateCorrelationId();

    try {
      this.logProcessingStart(correlationId, inputData, transformationOptions);

      const validatedData = this.validateInputData(inputData, validationSettings);
      const transformedData = this.applyTransformations(validatedData, transformationOptions);
      const processedData = this.runProcessingPipeline(transformedData, outputConfiguration);
      const finalData = this.applyOutputConfiguration(processedData, outputConfiguration);

      const endTime = performance.now();
      const processingTime = endTime - startTime;

      this.logProcessingComplete(correlationId, processingTime, performanceMetrics);

      return {
        success: true,
        data: finalData,
        metadata: {
          correlationId,
          processingTime,
          transformationCount: this.transformationRules.length,
          validationCount: this.validationRules.length,
          pipelineSteps: this.processingPipeline.length
        }
      };
    } catch (error) {
      this.handleProcessingError(error, correlationId, errorHandlingMode);
      throw error;
    }
  }

  // Methods with nested object properties for practicing text object operations
  private validateInputData(data: InputDataStructure, settings: ValidationSettings): ValidatedData {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate required fields
    if (!data.primaryKey || data.primaryKey.trim() === '') {
      errors.push({ field: 'primaryKey', message: 'Primary key is required' });
    }

    if (!data.timestamp || isNaN(data.timestamp.getTime())) {
      errors.push({ field: 'timestamp', message: 'Valid timestamp is required' });
    }

    // Validate nested object structure
    if (!data.metadata || typeof data.metadata !== 'object') {
      errors.push({ field: 'metadata', message: 'Metadata object is required' });
    } else {
      if (!data.metadata.source || data.metadata.source.trim() === '') {
        warnings.push({ field: 'metadata.source', message: 'Source information is recommended' });
      }

      if (!data.metadata.version || data.metadata.version < 1) {
        warnings.push({ field: 'metadata.version', message: 'Version should be specified' });
      }

      if (data.metadata.tags && !Array.isArray(data.metadata.tags)) {
        errors.push({ field: 'metadata.tags', message: 'Tags must be an array' });
      }
    }

    // Validate array properties
    if (data.items && Array.isArray(data.items)) {
      data.items.forEach((item, index) => {
        if (!item.id || item.id.trim() === '') {
          errors.push({ field: `items[${index}].id`, message: 'Item ID is required' });
        }

        if (!item.type || item.type.trim() === '') {
          errors.push({ field: `items[${index}].type`, message: 'Item type is required' });
        }

        if (item.value === null || item.value === undefined) {
          warnings.push({ field: `items[${index}].value`, message: 'Item value is missing' });
        }
      });
    }

    if (errors.length > 0 && settings.strictMode) {
      throw new ValidationException(`Validation failed: ${errors.map(e => e.message).join(', ')}`, errors);
    }

    return {
      originalData: data,
      errors,
      warnings,
      isValid: errors.length === 0,
      validatedAt: new Date()
    };
  }

  private applyTransformations(data: ValidatedData, options: TransformationOptions): TransformedData {
    let currentData = { ...data.originalData };

    for (const rule of this.transformationRules) {
      try {
        currentData = this.applyTransformationRule(currentData, rule, options);
      } catch (error) {
        if (options.continueOnError) {
          console.warn(`Transformation rule ${rule.name} failed:`, error);
          continue;
        }
        throw new TransformationException(`Transformation rule ${rule.name} failed`, rule, error);
      }
    }

    return {
      originalData: data.originalData,
      transformedData: currentData,
      appliedRules: this.transformationRules.map(rule => rule.name),
      transformedAt: new Date()
    };
  }

  private applyTransformationRule(data: InputDataStructure, rule: TransformationRule, options: TransformationOptions): InputDataStructure {
    switch (rule.type) {
      case 'fieldMapping':
        return this.applyFieldMapping(data, rule as FieldMappingRule, options);
      case 'valueTransformation':
        return this.applyValueTransformation(data, rule as ValueTransformationRule, options);
      case 'structuralChange':
        return this.applyStructuralChange(data, rule as StructuralChangeRule, options);
      case 'conditionalTransformation':
        return this.applyConditionalTransformation(data, rule as ConditionalTransformationRule, options);
      default:
        throw new Error(`Unknown transformation rule type: ${rule.type}`);
    }
  }

  private applyFieldMapping(data: InputDataStructure, rule: FieldMappingRule, options: TransformationOptions): InputDataStructure {
    const result = { ...data };

    for (const mapping of rule.mappings) {
      const sourceValue = this.getNestedValue(data, mapping.sourcePath);
      if (sourceValue !== undefined) {
        this.setNestedValue(result, mapping.targetPath, sourceValue);
        if (mapping.removeSource && options.removeSourceFields) {
          this.deleteNestedValue(result, mapping.sourcePath);
        }
      }
    }

    return result;
  }

  private applyValueTransformation(data: InputDataStructure, rule: ValueTransformationRule, options: TransformationOptions): InputDataStructure {
    const result = { ...data };

    for (const transformation of rule.transformations) {
      const currentValue = this.getNestedValue(result, transformation.fieldPath);
      if (currentValue !== undefined) {
        const transformedValue = this.transformValue(currentValue, transformation.transformer, options);
        this.setNestedValue(result, transformation.fieldPath, transformedValue);
      }
    }

    return result;
  }

  private applyStructuralChange(data: InputDataStructure, rule: StructuralChangeRule, options: TransformationOptions): InputDataStructure {
    let result = { ...data };

    for (const change of rule.changes) {
      switch (change.operation) {
        case 'add':
          this.setNestedValue(result, change.path, change.value);
          break;
        case 'remove':
          this.deleteNestedValue(result, change.path);
          break;
        case 'rename':
          const value = this.getNestedValue(result, change.path);
          if (value !== undefined && change.newPath) {
            this.setNestedValue(result, change.newPath, value);
            this.deleteNestedValue(result, change.path);
          }
          break;
        case 'restructure':
          result = this.restructureObject(result, change);
          break;
      }
    }

    return result;
  }

  private applyConditionalTransformation(data: InputDataStructure, rule: ConditionalTransformationRule, options: TransformationOptions): InputDataStructure {
    if (!this.evaluateCondition(data, rule.condition)) {
      return data;
    }

    let result = data;
    for (const action of rule.actions) {
      result = this.applyTransformationRule(result, action, options);
    }

    return result;
  }

  // Utility methods with various brackets and quotes for text object practice
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      if (current && typeof current === 'object' && key in current) {
        return current[key];
      }
      return undefined;
    }, obj);
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop();

    if (!lastKey) return;

    const target = keys.reduce((current, key) => {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      return current[key];
    }, obj);

    target[lastKey] = value;
  }

  private deleteNestedValue(obj: any, path: string): void {
    const keys = path.split('.');
    const lastKey = keys.pop();

    if (!lastKey) return;

    const target = keys.reduce((current, key) => {
      if (current && typeof current === 'object' && key in current) {
        return current[key];
      }
      return null;
    }, obj);

    if (target && typeof target === 'object') {
      delete target[lastKey];
    }
  }

  private transformValue(value: any, transformer: ValueTransformer, options: TransformationOptions): any {
    switch (transformer.type) {
      case 'string':
        return this.transformString(value, transformer as StringTransformer, options);
      case 'number':
        return this.transformNumber(value, transformer as NumberTransformer, options);
      case 'date':
        return this.transformDate(value, transformer as DateTransformer, options);
      case 'array':
        return this.transformArray(value, transformer as ArrayTransformer, options);
      case 'object':
        return this.transformObject(value, transformer as ObjectTransformer, options);
      default:
        return value;
    }
  }

  private transformString(value: any, transformer: StringTransformer, options: TransformationOptions): string {
    let result = String(value);

    if (transformer.operations.includes('trim')) {
      result = result.trim();
    }

    if (transformer.operations.includes('lowercase')) {
      result = result.toLowerCase();
    }

    if (transformer.operations.includes('uppercase')) {
      result = result.toUpperCase();
    }

    if (transformer.operations.includes('capitalize')) {
      result = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
    }

    if (transformer.pattern && transformer.replacement !== undefined) {
      const regex = new RegExp(transformer.pattern, transformer.flags || 'g');
      result = result.replace(regex, transformer.replacement);
    }

    return result;
  }

  private transformNumber(value: any, transformer: NumberTransformer, options: TransformationOptions): number {
    let result = Number(value);

    if (isNaN(result)) {
      return transformer.defaultValue || 0;
    }

    if (transformer.operations.includes('round')) {
      result = Math.round(result);
    }

    if (transformer.operations.includes('floor')) {
      result = Math.floor(result);
    }

    if (transformer.operations.includes('ceil')) {
      result = Math.ceil(result);
    }

    if (transformer.operations.includes('abs')) {
      result = Math.abs(result);
    }

    if (transformer.multiplier) {
      result *= transformer.multiplier;
    }

    if (transformer.precision !== undefined) {
      result = Number(result.toFixed(transformer.precision));
    }

    return result;
  }

  private generateCorrelationId(): string {
    return `proc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private logProcessingStart(correlationId: string, data: InputDataStructure, options: TransformationOptions): void {
    console.log(`[${correlationId}] Processing started`, {
      timestamp: new Date().toISOString(),
      dataSize: JSON.stringify(data).length,
      rulesCount: this.transformationRules.length,
      options
    });
  }

  private logProcessingComplete(correlationId: string, processingTime: number, metrics: PerformanceMetrics): void {
    console.log(`[${correlationId}] Processing completed`, {
      timestamp: new Date().toISOString(),
      processingTime: `${processingTime.toFixed(2)}ms`,
      metrics
    });
  }
}

// Supporting interfaces and types with various nesting levels
interface TransformationConfig {
  transformationRules: TransformationRule[];
  validationRules: ValidationRule[];
  processingPipeline: ProcessingStep[];
  errorHandlers: ErrorHandler[];
}

interface InputDataStructure {
  primaryKey: string;
  timestamp: Date;
  metadata: {
    source: string;
    version: number;
    tags: string[];
    attributes: Record<string, any>;
  };
  items: Array<{
    id: string;
    type: string;
    value: any;
    properties: Record<string, any>;
  }>;
  configuration: {
    settings: Record<string, any>;
    features: string[];
    permissions: string[];
  };
}

interface TransformationRule {
  name: string;
  type: 'fieldMapping' | 'valueTransformation' | 'structuralChange' | 'conditionalTransformation';
  description: string;
  enabled: boolean;
}

interface FieldMappingRule extends TransformationRule {
  type: 'fieldMapping';
  mappings: Array<{
    sourcePath: string;
    targetPath: string;
    removeSource: boolean;
  }>;
}

interface ValueTransformationRule extends TransformationRule {
  type: 'valueTransformation';
  transformations: Array<{
    fieldPath: string;
    transformer: ValueTransformer;
  }>;
}

interface ValueTransformer {
  type: 'string' | 'number' | 'date' | 'array' | 'object';
}

interface StringTransformer extends ValueTransformer {
  type: 'string';
  operations: Array<'trim' | 'lowercase' | 'uppercase' | 'capitalize'>;
  pattern?: string;
  replacement?: string;
  flags?: string;
}

interface NumberTransformer extends ValueTransformer {
  type: 'number';
  operations: Array<'round' | 'floor' | 'ceil' | 'abs'>;
  multiplier?: number;
  precision?: number;
  defaultValue?: number;
}

// Export section for text object practice
export {
  DataTransformationService,
  type TransformationConfig,
  type InputDataStructure,
  type TransformationRule,
  type FieldMappingRule,
  type ValueTransformationRule,
  type ValueTransformer,
  type StringTransformer,
  type NumberTransformer
};