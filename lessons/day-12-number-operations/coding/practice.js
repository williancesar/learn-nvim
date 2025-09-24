/**
 * DAY 12: NUMBER OPERATIONS PRACTICE
 * ===================================
 *
 * LEARNING OBJECTIVES:
 * - Master number increment/decrement (Ctrl-a, Ctrl-x)
 * - Practice with array indices and numeric values
 * - Learn to efficiently modify numbers in code
 *
 * KEY COMMANDS TO PRACTICE:
 * - Ctrl-a    : Increment number under cursor
 * - Ctrl-x    : Decrement number under cursor
 * - {n}Ctrl-a : Increment by n
 * - {n}Ctrl-x : Decrement by n
 * - g Ctrl-a  : Increment sequentially in visual mode
 * - g Ctrl-x  : Decrement sequentially in visual mode
 *
 * NUMBER FORMATS SUPPORTED:
 * - Decimal: 123, -456
 * - Hexadecimal: 0x1F, 0xFF
 * - Octal: 077, 0123
 * - Binary: 0b1010, 0b1111
 *
 * EXERCISE INSTRUCTIONS:
 * 1. Practice incrementing/decrementing various number types
 * 2. Work with array indices and object properties
 * 3. Adjust configuration values and constants
 * 4. Use visual mode for sequential number operations
 */

// PRACTICE TARGET: Array indices for increment/decrement
const fruits = ['apple', 'banana', 'cherry', 'date', 'elderberry'];

// Practice: Change these indices using Ctrl-a and Ctrl-x
console.log(fruits[0]);    // Try: Ctrl-a to make it fruits[1]
console.log(fruits[1]);    // Try: Ctrl-a to make it fruits[2]
console.log(fruits[2]);    // Try: Ctrl-x to make it fruits[1]
console.log(fruits[3]);    // Try: Ctrl-x to make it fruits[2]
console.log(fruits[4]);    // Try: Ctrl-x to make it fruits[3]

// PRACTICE TARGET: Object property numeric keys
const userScores = {
    1: 'Bronze',     // Try: Ctrl-a on the key to make it 2
    2: 'Silver',     // Try: Ctrl-a on the key to make it 3
    3: 'Gold',       // Try: Ctrl-a on the key to make it 4
    4: 'Platinum',   // Try: Ctrl-a on the key to make it 5
    5: 'Diamond'     // Try: Ctrl-a on the key to make it 6
};

// PRACTICE TARGET: Version numbers and configuration
const packageConfig = {
    version: '1.0.0',        // Practice: increment middle or last digit
    majorVersion: 1,         // Try: 5Ctrl-a to increment by 5
    minorVersion: 2,         // Try: 3Ctrl-a to increment by 3
    patchVersion: 15,        // Try: Ctrl-x to decrement
    buildNumber: 1047,       // Try: 10Ctrl-a to increment by 10
    releaseCandidate: 2      // Try: Ctrl-a to increment
};

// PRACTICE TARGET: Port numbers and timeouts
const serverConfig = {
    httpPort: 3000,          // Try: Ctrl-a to make it 3001
    httpsPort: 3443,         // Try: Ctrl-x to make it 3442
    dbPort: 5432,            // Try: 100Ctrl-a to make it 5532
    redisPort: 6379,         // Try: 10Ctrl-x to make it 6369
    timeout: 5000,           // Try: 1000Ctrl-a to make it 6000
    retryDelay: 1000,        // Try: 500Ctrl-a to make it 1500
    maxRetries: 3,           // Try: 2Ctrl-a to make it 5
    poolSize: 10             // Try: 5Ctrl-a to make it 15
};

// PRACTICE TARGET: Coordinates and dimensions
const gameObjects = [
    { x: 100, y: 150, width: 32, height: 48 },   // Practice on any of these numbers
    { x: 200, y: 300, width: 64, height: 64 },   // Try: Ctrl-a on x to move right
    { x: 50, y: 75, width: 16, height: 32 },     // Try: Ctrl-x on y to move up
    { x: 400, y: 250, width: 128, height: 96 }   // Try: various increments
];

// PRACTICE TARGET: Color values (hexadecimal)
const colorPalette = {
    primary: '#007bff',      // Try: Ctrl-a on any hex digit
    secondary: '#6c757d',    // Try: Ctrl-x on any hex digit
    success: '#28a745',      // Practice: increment to make lighter
    danger: '#dc3545',       // Practice: decrement to make darker
    warning: '#ffc107',      // Try: increment individual components
    info: '#17a2b8',         // Try: experiment with hex values
    light: '#f8f9fa',        // Try: increment for brighter
    dark: '#343a40'          // Try: decrement for darker
};

// PRACTICE TARGET: RGB values
const rgbColors = {
    red: 'rgb(255, 0, 0)',       // Practice: adjust individual RGB values
    green: 'rgb(0, 128, 0)',     // Try: Ctrl-a on the green component
    blue: 'rgb(0, 0, 255)',      // Try: Ctrl-x on the blue component
    purple: 'rgb(128, 0, 128)',  // Try: adjust red and blue
    orange: 'rgb(255, 165, 0)',  // Try: modify orange intensity
    cyan: 'rgb(0, 255, 255)'     // Try: adjust cyan components
};

// PRACTICE TARGET: CSS measurements
const cssValues = {
    fontSize: '16px',        // Try: Ctrl-a to make it 17px
    lineHeight: '1.5',       // Try: increment the decimal
    padding: '10px',         // Try: 5Ctrl-a to make it 15px
    margin: '20px',          // Try: Ctrl-x to make it 19px
    borderWidth: '2px',      // Try: Ctrl-a to make it 3px
    borderRadius: '8px',     // Try: 2Ctrl-a to make it 10px
    zIndex: 100,             // Try: 10Ctrl-a to make it 110
    opacity: 0.8             // Try: increment/decrement decimal
};

// PRACTICE TARGET: Time and duration values
const animationConfig = {
    duration: 300,           // milliseconds - try: 100Ctrl-a
    delay: 150,              // milliseconds - try: 50Ctrl-x
    iterations: 1,           // try: Ctrl-a for repeat
    easingSteps: 10,         // try: 5Ctrl-a
    frameRate: 60,           // fps - try: Ctrl-x
    timestep: 16             // milliseconds - try: Ctrl-a
};

// PRACTICE TARGET: Financial and currency values
const priceData = {
    basePrice: 99.99,        // Try: increment/decrement cents
    discount: 10,            // percentage - try: 5Ctrl-a
    tax: 8.25,               // percentage - try: adjust decimal
    shipping: 12.50,         // Try: 2Ctrl-a to increase shipping
    total: 110.74,           // Try: adjust based on other changes
    installments: 12,        // Try: Ctrl-a for more payments
    interestRate: 4.5        // percentage - try: adjust rate
};

// PRACTICE TARGET: Array lengths and capacities
const arrayConfigs = [
    new Array(10),           // Try: Ctrl-a to increase size
    new Array(25),           // Try: 5Ctrl-a to increase by 5
    new Array(50),           // Try: 10Ctrl-x to decrease by 10
    new Array(100),          // Try: various adjustments
    new Array(5),            // Try: Ctrl-a for small increment
    new Array(1000)          // Try: 100Ctrl-x for large decrement
];

// PRACTICE TARGET: Loop counters and ranges
for (let i = 0; i < 10; i++) {     // Practice: adjust loop limit
    if (i % 2 === 0) {             // Practice: change modulo value
        console.log(`Even: ${i}`);
    }
}

for (let j = 1; j <= 100; j += 5) {    // Practice: adjust step size
    if (j % 10 === 0) {                // Practice: change divisor
        console.log(`Multiple of 10: ${j}`);
    }
}

// PRACTICE TARGET: Binary and octal numbers
const binaryNumbers = {
    flags: 0b1010,           // Binary - try: Ctrl-a
    mask: 0b1111,            // Binary - try: Ctrl-x
    permissions: 0755,       // Octal - try: Ctrl-a
    mode: 0644,              // Octal - try: Ctrl-x
    hexValue: 0xFF,          // Hex - try: Ctrl-a/Ctrl-x
    address: 0x1000          // Hex - try: increment
};

// PRACTICE TARGET: Database IDs and foreign keys
const databaseRecords = [
    { id: 1, userId: 101, categoryId: 5 },     // Practice: increment any ID
    { id: 2, userId: 102, categoryId: 7 },     // Practice: sequential increments
    { id: 3, userId: 103, categoryId: 12 },    // Practice: larger increments
    { id: 4, userId: 104, categoryId: 8 },     // Practice: try decrements
    { id: 5, userId: 105, categoryId: 15 }     // Practice: batch operations
];

// PRACTICE TARGET: API pagination parameters
const paginationConfig = {
    page: 1,                 // Try: Ctrl-a to go to next page
    limit: 25,               // Try: 5Ctrl-a to increase page size
    offset: 0,               // Try: 25Ctrl-a to skip to next set
    totalPages: 10,          // Try: adjust based on data
    totalItems: 250,         // Try: increment total count
    perPage: 20              // Try: adjust items per page
};

// PRACTICE TARGET: HTTP status codes
const statusCodes = {
    ok: 200,                 // Try: Ctrl-a (but stay in 200s)
    created: 201,            // Try: Ctrl-x back to 200
    accepted: 202,           // Try: various status codes
    notFound: 404,           // Try: Ctrl-a to 405
    serverError: 500,        // Try: Ctrl-a to 501
    badGateway: 502          // Try: Ctrl-x back to 501
};

// PRACTICE TARGET: Performance metrics
const performanceMetrics = {
    loadTime: 1200,          // milliseconds - try: 100Ctrl-x
    renderTime: 850,         // milliseconds - try: 50Ctrl-a
    responseTime: 45,        // milliseconds - try: 5Ctrl-x
    memoryUsage: 128,        // MB - try: 16Ctrl-a
    cpuUsage: 15,            // percentage - try: 5Ctrl-a
    cacheHitRate: 85         // percentage - try: Ctrl-a
};

// PRACTICE TARGET: Grid and layout dimensions
const gridSystem = {
    columns: 12,             // Try: Ctrl-a to 13 (unusual grid)
    rows: 8,                 // Try: 2Ctrl-a to 10
    cellWidth: 80,           // pixels - try: 10Ctrl-a
    cellHeight: 60,          // pixels - try: 10Ctrl-x
    gutter: 20,              // pixels - try: 5Ctrl-a
    maxWidth: 1200,          // pixels - try: 200Ctrl-a
    breakpoint: 768          // pixels - try: 32Ctrl-a
};

// PRACTICE TARGET: Sequential numbering exercise
// Use visual mode (V) to select these lines, then g Ctrl-a for sequential increment
const items = [
    `Item 1`,                // After g Ctrl-a: Item 1
    `Item 1`,                // After g Ctrl-a: Item 2
    `Item 1`,                // After g Ctrl-a: Item 3
    `Item 1`,                // After g Ctrl-a: Item 4
    `Item 1`                 // After g Ctrl-a: Item 5
];

// PRACTICE TARGET: Temperature values
const temperatureReadings = {
    celsius: 25,             // Try: 5Ctrl-a for warmer
    fahrenheit: 77,          // Try: 9Ctrl-a (celsius to fahrenheit ratio)
    kelvin: 298,             // Try: 5Ctrl-a (same as celsius change)
    minTemp: -10,            // Try: 5Ctrl-a for warmer minimum
    maxTemp: 35,             // Try: 5Ctrl-a for higher maximum
    average: 22              // Try: adjust based on min/max
};

// PRACTICE TARGET: Sports scores and statistics
const gameStats = {
    homeScore: 21,           // Try: 7Ctrl-a for touchdown
    awayScore: 14,           // Try: 3Ctrl-a for field goal
    quarter: 3,              // Try: Ctrl-a to advance quarter
    timeLeft: 847,           // seconds - try: 60Ctrl-x for minute
    penalties: 5,            // Try: Ctrl-a for more penalties
    turnovers: 2             // Try: Ctrl-a for more turnovers
};

// PRACTICE TARGET: Recipe measurements
const recipeIngredients = {
    flour: 2.5,              // cups - try: increment by 0.5
    sugar: 1,                // cup - try: Ctrl-a for sweeter
    eggs: 3,                 // count - try: Ctrl-a for richer
    butter: 8,               // tablespoons - try: 2Ctrl-a
    vanilla: 1,              // teaspoon - try: Ctrl-a for more flavor
    bakingTime: 25,          // minutes - try: 5Ctrl-a
    temperature: 350         // fahrenheit - try: 25Ctrl-a
};

/**
 * PRACTICE EXERCISES:
 *
 * 1. BASIC NUMBER OPERATIONS:
 *    - Place cursor on any number and press Ctrl-a to increment
 *    - Place cursor on any number and press Ctrl-x to decrement
 *    - Try with different number formats (decimal, hex, binary, octal)
 *
 * 2. INCREMENTAL OPERATIONS:
 *    - Use 5Ctrl-a to increment by 5
 *    - Use 10Ctrl-x to decrement by 10
 *    - Use 100Ctrl-a for large increments
 *
 * 3. ARRAY INDEX PRACTICE:
 *    - Modify array indices in the fruits examples
 *    - Practice with object numeric keys
 *    - Adjust loop counters and ranges
 *
 * 4. CONFIGURATION ADJUSTMENTS:
 *    - Increment port numbers to avoid conflicts
 *    - Adjust timeout values for performance tuning
 *    - Modify version numbers for releases
 *
 * 5. VISUAL MODE SEQUENTIAL OPERATIONS:
 *    - Select multiple lines with the same number
 *    - Use g Ctrl-a to increment sequentially
 *    - Use g Ctrl-x to decrement sequentially
 *    - Practice with the 'items' array example
 *
 * 6. COLOR AND DESIGN VALUES:
 *    - Adjust hex color values for different shades
 *    - Modify RGB components individually
 *    - Change CSS measurements and dimensions
 *
 * 7. REAL-WORLD SCENARIOS:
 *    - Adjust API pagination parameters
 *    - Modify database record IDs
 *    - Change performance thresholds
 *    - Update temperature and measurement values
 *
 * REMEMBER:
 * - Cursor must be on or immediately before a number
 * - Works with negative numbers and decimals
 * - Supports various number formats (decimal, hex, octal, binary)
 * - Use {count}Ctrl-a for larger increments
 * - Visual mode with g Ctrl-a creates sequences
 * - Great for quickly adjusting configuration values
 */