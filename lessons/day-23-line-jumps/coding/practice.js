// Day 23: Line Jumps and Bracket Matching Practice - gg, G, :number, %, [(, ])
// Practice jumping to specific line numbers and matching brackets/parentheses
// Use gg (top), G (bottom), :42 (line 42), % (matching bracket), [( and ])

/**
 * Mathematical Expression Parser and Calculator
 * Contains complex nested structures perfect for bracket matching practice
 * Line numbers are important for error reporting and debugging
 */

// Line 10: Complex mathematical expressions with nested brackets
const MATHEMATICAL_EXPRESSIONS = {
    // Line 12: Simple arithmetic expressions
    basic: [
        '(2 + 3) * 4',
        '((5 - 2) * 3) + 1',
        '[10 / (2 + 3)] * 7',
        '{[(8 * 2) - 4] / 3} + 9'
    ],

    // Line 19: Advanced expressions with functions
    advanced: [
        'sin(PI / 2) + cos(0)',
        'sqrt(pow(3, 2) + pow(4, 2))',
        'log(exp(1)) * ln(e)',
        'tan(atan(1)) + cot(PI / 4)'
    ],

    // Line 26: Complex nested expressions
    complex: [
        '((a + b) * (c - d)) / ((e * f) + (g / h))',
        'sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)))',
        'max(min(a, b), min(c, d)) + abs(e - f)',
        'floor(ceil(random() * 100) / 10) * 10'
    ]
};

// Line 35: Expression tokenizer class
class ExpressionTokenizer {
    constructor(expression) {
        this.expression = expression;
        this.position = 0;
        this.tokens = [];
        this.bracketStack = [];
    }

    // Line 43: Tokenize the mathematical expression
    tokenize() {
        while (this.position < this.expression.length) {
            this.skipWhitespace();

            if (this.position >= this.expression.length) {
                break;
            }

            const char = this.expression[this.position];

            // Line 53: Handle different token types
            if (this.isDigit(char)) {
                this.tokenizeNumber();
            } else if (this.isLetter(char)) {
                this.tokenizeIdentifier();
            } else if (this.isOperator(char)) {
                this.tokenizeOperator();
            } else if (this.isOpenBracket(char)) {
                this.tokenizeOpenBracket(char);
            } else if (this.isCloseBracket(char)) {
                this.tokenizeCloseBracket(char);
            } else {
                throw new Error(`Unexpected character at position ${this.position}: ${char}`);
            }
        }

        // Line 68: Validate bracket matching
        if (this.bracketStack.length > 0) {
            throw new Error(`Unmatched opening brackets: ${this.bracketStack.join(', ')}`);
        }

        return this.tokens;
    }

    // Line 75: Number tokenization
    tokenizeNumber() {
        let number = '';
        let hasDecimal = false;

        while (this.position < this.expression.length) {
            const char = this.expression[this.position];

            if (this.isDigit(char)) {
                number += char;
                this.position++;
            } else if (char === '.' && !hasDecimal) {
                number += char;
                hasDecimal = true;
                this.position++;
            } else {
                break;
            }
        }

        this.tokens.push({
            type: 'NUMBER',
            value: parseFloat(number),
            position: this.position - number.length
        });
    }

    // Line 98: Identifier tokenization (function names, variables)
    tokenizeIdentifier() {
        let identifier = '';

        while (this.position < this.expression.length) {
            const char = this.expression[this.position];

            if (this.isLetter(char) || this.isDigit(char) || char === '_') {
                identifier += char;
                this.position++;
            } else {
                break;
            }
        }

        this.tokens.push({
            type: 'IDENTIFIER',
            value: identifier,
            position: this.position - identifier.length
        });
    }

    // Line 117: Operator tokenization
    tokenizeOperator() {
        const char = this.expression[this.position];
        const nextChar = this.expression[this.position + 1];

        // Line 121: Handle multi-character operators
        if ((char === '=' && nextChar === '=') ||
            (char === '!' && nextChar === '=') ||
            (char === '<' && nextChar === '=') ||
            (char === '>' && nextChar === '=') ||
            (char === '*' && nextChar === '*') ||
            (char === '/' && nextChar === '/')) {

            this.tokens.push({
                type: 'OPERATOR',
                value: char + nextChar,
                position: this.position
            });
            this.position += 2;
        } else {
            this.tokens.push({
                type: 'OPERATOR',
                value: char,
                position: this.position
            });
            this.position++;
        }
    }

    // Line 143: Open bracket tokenization with stack tracking
    tokenizeOpenBracket(bracket) {
        this.bracketStack.push({
            bracket: bracket,
            position: this.position
        });

        this.tokens.push({
            type: 'OPEN_BRACKET',
            value: bracket,
            position: this.position
        });

        this.position++;
    }

    // Line 157: Close bracket tokenization with matching validation
    tokenizeCloseBracket(bracket) {
        if (this.bracketStack.length === 0) {
            throw new Error(`Unexpected closing bracket at position ${this.position}: ${bracket}`);
        }

        const lastOpen = this.bracketStack.pop();
        const expectedClose = this.getMatchingBracket(lastOpen.bracket);

        if (bracket !== expectedClose) {
            throw new Error(
                `Mismatched brackets: expected '${expectedClose}' at position ${this.position}, ` +
                `but found '${bracket}'. Opening bracket '${lastOpen.bracket}' at position ${lastOpen.position}`
            );
        }

        this.tokens.push({
            type: 'CLOSE_BRACKET',
            value: bracket,
            position: this.position,
            matchingPosition: lastOpen.position
        });

        this.position++;
    }

    // Line 178: Helper methods for character classification
    isDigit(char) {
        return char >= '0' && char <= '9';
    }

    isLetter(char) {
        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
    }

    isOperator(char) {
        return '+-*/%=!<>^&|'.indexOf(char) !== -1;
    }

    isOpenBracket(char) {
        return '([{'.indexOf(char) !== -1;
    }

    isCloseBracket(char) {
        return ')]}'.indexOf(char) !== -1;
    }

    // Line 198: Get matching bracket for validation
    getMatchingBracket(openBracket) {
        const bracketPairs = {
            '(': ')',
            '[': ']',
            '{': '}'
        };
        return bracketPairs[openBracket];
    }

    // Line 208: Skip whitespace characters
    skipWhitespace() {
        while (this.position < this.expression.length &&
               /\s/.test(this.expression[this.position])) {
            this.position++;
        }
    }
}

// Line 216: Abstract syntax tree node classes
class ASTNode {
    constructor(type, value = null) {
        this.type = type;
        this.value = value;
        this.children = [];
        this.parent = null;
    }

    // Line 224: Add child node
    addChild(child) {
        child.parent = this;
        this.children.push(child);
    }

    // Line 230: Find matching bracket node
    findMatchingBracket() {
        if (this.type !== 'BRACKET_GROUP') {
            return null;
        }

        // Implementation for finding matching brackets in AST
        return this.findMatchingNode();
    }

    // Line 239: Traverse the AST
    traverse(callback) {
        callback(this);
        this.children.forEach(child => child.traverse(callback));
    }
}

// Line 245: Expression parser class
class ExpressionParser {
    constructor(tokens) {
        this.tokens = tokens;
        this.position = 0;
        this.ast = null;
    }

    // Line 252: Parse expression into AST
    parse() {
        try {
            this.ast = this.parseExpression();

            if (this.position < this.tokens.length) {
                throw new Error(`Unexpected token at position ${this.position}`);
            }

            return this.ast;
        } catch (error) {
            throw new Error(`Parse error: ${error.message}`);
        }
    }

    // Line 266: Parse full expression (lowest precedence)
    parseExpression() {
        let node = this.parseLogicalOr();

        while (this.position < this.tokens.length &&
               this.currentToken().value === '=') {
            const operator = this.consumeToken();
            const right = this.parseLogicalOr();

            const assignmentNode = new ASTNode('ASSIGNMENT', operator.value);
            assignmentNode.addChild(node);
            assignmentNode.addChild(right);
            node = assignmentNode;
        }

        return node;
    }

    // Line 282: Parse logical OR operations
    parseLogicalOr() {
        let node = this.parseLogicalAnd();

        while (this.position < this.tokens.length &&
               this.currentToken().value === '||') {
            const operator = this.consumeToken();
            const right = this.parseLogicalAnd();

            const orNode = new ASTNode('LOGICAL_OR', operator.value);
            orNode.addChild(node);
            orNode.addChild(right);
            node = orNode;
        }

        return node;
    }

    // Line 298: Parse logical AND operations
    parseLogicalAnd() {
        let node = this.parseEquality();

        while (this.position < this.tokens.length &&
               this.currentToken().value === '&&') {
            const operator = this.consumeToken();
            const right = this.parseEquality();

            const andNode = new ASTNode('LOGICAL_AND', operator.value);
            andNode.addChild(node);
            andNode.addChild(right);
            node = andNode;
        }

        return node;
    }

    // Line 314: Parse equality operations (==, !=)
    parseEquality() {
        let node = this.parseComparison();

        while (this.position < this.tokens.length &&
               ['==', '!='].includes(this.currentToken().value)) {
            const operator = this.consumeToken();
            const right = this.parseComparison();

            const equalityNode = new ASTNode('EQUALITY', operator.value);
            equalityNode.addChild(node);
            equalityNode.addChild(right);
            node = equalityNode;
        }

        return node;
    }

    // Line 330: Parse comparison operations (<, >, <=, >=)
    parseComparison() {
        let node = this.parseAddition();

        while (this.position < this.tokens.length &&
               ['<', '>', '<=', '>='].includes(this.currentToken().value)) {
            const operator = this.consumeToken();
            const right = this.parseAddition();

            const comparisonNode = new ASTNode('COMPARISON', operator.value);
            comparisonNode.addChild(node);
            comparisonNode.addChild(right);
            node = comparisonNode;
        }

        return node;
    }

    // Line 346: Parse addition and subtraction
    parseAddition() {
        let node = this.parseMultiplication();

        while (this.position < this.tokens.length &&
               ['+', '-'].includes(this.currentToken().value)) {
            const operator = this.consumeToken();
            const right = this.parseMultiplication();

            const additionNode = new ASTNode('ADDITION', operator.value);
            additionNode.addChild(node);
            additionNode.addChild(right);
            node = additionNode;
        }

        return node;
    }

    // Line 362: Parse multiplication, division, and modulo
    parseMultiplication() {
        let node = this.parseExponentiation();

        while (this.position < this.tokens.length &&
               ['*', '/', '%'].includes(this.currentToken().value)) {
            const operator = this.consumeToken();
            const right = this.parseExponentiation();

            const multiplicationNode = new ASTNode('MULTIPLICATION', operator.value);
            multiplicationNode.addChild(node);
            multiplicationNode.addChild(right);
            node = multiplicationNode;
        }

        return node;
    }

    // Line 378: Parse exponentiation (right-associative)
    parseExponentiation() {
        let node = this.parseUnary();

        if (this.position < this.tokens.length &&
            this.currentToken().value === '**') {
            const operator = this.consumeToken();
            const right = this.parseExponentiation(); // Right-associative

            const exponentiationNode = new ASTNode('EXPONENTIATION', operator.value);
            exponentiationNode.addChild(node);
            exponentiationNode.addChild(right);
            node = exponentiationNode;
        }

        return node;
    }

    // Line 394: Parse unary operations (-, +, !)
    parseUnary() {
        if (this.position < this.tokens.length &&
            ['-', '+', '!'].includes(this.currentToken().value)) {
            const operator = this.consumeToken();
            const operand = this.parseUnary();

            const unaryNode = new ASTNode('UNARY', operator.value);
            unaryNode.addChild(operand);
            return unaryNode;
        }

        return this.parsePrimary();
    }

    // Line 408: Parse primary expressions (numbers, identifiers, grouped expressions)
    parsePrimary() {
        const token = this.currentToken();

        if (!token) {
            throw new Error('Unexpected end of expression');
        }

        // Line 415: Handle numbers
        if (token.type === 'NUMBER') {
            this.consumeToken();
            return new ASTNode('NUMBER', token.value);
        }

        // Line 420: Handle identifiers and function calls
        if (token.type === 'IDENTIFIER') {
            const identifier = this.consumeToken();

            // Check if this is a function call
            if (this.position < this.tokens.length &&
                this.currentToken().value === '(') {
                return this.parseFunctionCall(identifier);
            }

            return new ASTNode('IDENTIFIER', identifier.value);
        }

        // Line 432: Handle grouped expressions with brackets
        if (token.type === 'OPEN_BRACKET') {
            return this.parseGroupedExpression();
        }

        throw new Error(`Unexpected token: ${token.value} at position ${token.position}`);
    }

    // Line 439: Parse function calls with arguments
    parseFunctionCall(functionName) {
        const functionNode = new ASTNode('FUNCTION_CALL', functionName.value);

        // Consume opening parenthesis
        this.expectToken('(');

        // Parse arguments
        if (this.currentToken() && this.currentToken().value !== ')') {
            do {
                const argument = this.parseExpression();
                functionNode.addChild(argument);

                if (this.currentToken() && this.currentToken().value === ',') {
                    this.consumeToken(); // Consume comma
                } else {
                    break;
                }
            } while (this.position < this.tokens.length);
        }

        // Consume closing parenthesis
        this.expectToken(')');

        return functionNode;
    }

    // Line 462: Parse grouped expressions (parentheses, brackets, braces)
    parseGroupedExpression() {
        const openBracket = this.consumeToken();
        const expectedClose = this.getMatchingBracket(openBracket.value);

        const groupNode = new ASTNode('BRACKET_GROUP', openBracket.value);
        const expression = this.parseExpression();
        groupNode.addChild(expression);

        this.expectToken(expectedClose);

        return groupNode;
    }

    // Line 474: Helper methods for parsing
    currentToken() {
        return this.position < this.tokens.length ? this.tokens[this.position] : null;
    }

    consumeToken() {
        return this.position < this.tokens.length ? this.tokens[this.position++] : null;
    }

    expectToken(expectedValue) {
        const token = this.currentToken();

        if (!token || token.value !== expectedValue) {
            throw new Error(`Expected '${expectedValue}' but found '${token ? token.value : 'end of input'}'`);
        }

        return this.consumeToken();
    }

    getMatchingBracket(openBracket) {
        const bracketPairs = {
            '(': ')',
            '[': ']',
            '{': '}'
        };
        return bracketPairs[openBracket];
    }
}

// Line 498: Expression evaluator class
class ExpressionEvaluator {
    constructor(ast, variables = {}) {
        this.ast = ast;
        this.variables = variables;
        this.functions = this.initializeFunctions();
    }

    // Line 505: Initialize built-in mathematical functions
    initializeFunctions() {
        return {
            sin: Math.sin,
            cos: Math.cos,
            tan: Math.tan,
            asin: Math.asin,
            acos: Math.acos,
            atan: Math.atan,
            sinh: Math.sinh,
            cosh: Math.cosh,
            tanh: Math.tanh,
            exp: Math.exp,
            log: Math.log,
            log10: Math.log10,
            log2: Math.log2,
            sqrt: Math.sqrt,
            cbrt: Math.cbrt,
            pow: Math.pow,
            abs: Math.abs,
            ceil: Math.ceil,
            floor: Math.floor,
            round: Math.round,
            max: Math.max,
            min: Math.min,
            random: Math.random
        };
    }

    // Line 532: Evaluate the abstract syntax tree
    evaluate() {
        return this.evaluateNode(this.ast);
    }

    // Line 536: Evaluate individual AST nodes
    evaluateNode(node) {
        switch (node.type) {
            case 'NUMBER':
                return node.value;

            case 'IDENTIFIER':
                if (node.value in this.variables) {
                    return this.variables[node.value];
                }
                throw new Error(`Undefined variable: ${node.value}`);

            case 'ADDITION':
                return this.evaluateBinaryOperation(node);

            case 'MULTIPLICATION':
                return this.evaluateBinaryOperation(node);

            case 'EXPONENTIATION':
                return this.evaluateBinaryOperation(node);

            case 'COMPARISON':
                return this.evaluateBinaryOperation(node);

            case 'EQUALITY':
                return this.evaluateBinaryOperation(node);

            case 'LOGICAL_AND':
                return this.evaluateBinaryOperation(node);

            case 'LOGICAL_OR':
                return this.evaluateBinaryOperation(node);

            case 'UNARY':
                return this.evaluateUnaryOperation(node);

            case 'BRACKET_GROUP':
                return this.evaluateNode(node.children[0]);

            case 'FUNCTION_CALL':
                return this.evaluateFunctionCall(node);

            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    // Line 576: Evaluate binary operations
    evaluateBinaryOperation(node) {
        const left = this.evaluateNode(node.children[0]);
        const right = this.evaluateNode(node.children[1]);

        switch (node.value) {
            case '+': return left + right;
            case '-': return left - right;
            case '*': return left * right;
            case '/': return left / right;
            case '%': return left % right;
            case '**': return Math.pow(left, right);
            case '<': return left < right;
            case '>': return left > right;
            case '<=': return left <= right;
            case '>=': return left >= right;
            case '==': return left === right;
            case '!=': return left !== right;
            case '&&': return left && right;
            case '||': return left || right;
            default:
                throw new Error(`Unknown binary operator: ${node.value}`);
        }
    }

    // Line 598: Evaluate unary operations
    evaluateUnaryOperation(node) {
        const operand = this.evaluateNode(node.children[0]);

        switch (node.value) {
            case '+': return +operand;
            case '-': return -operand;
            case '!': return !operand;
            default:
                throw new Error(`Unknown unary operator: ${node.value}`);
        }
    }

    // Line 610: Evaluate function calls
    evaluateFunctionCall(node) {
        const functionName = node.value;

        if (!(functionName in this.functions)) {
            throw new Error(`Unknown function: ${functionName}`);
        }

        const args = node.children.map(child => this.evaluateNode(child));
        return this.functions[functionName](...args);
    }
}

// Line 622: Export all classes and utilities
export {
    MATHEMATICAL_EXPRESSIONS,
    ExpressionTokenizer,
    ASTNode,
    ExpressionParser,
    ExpressionEvaluator
};