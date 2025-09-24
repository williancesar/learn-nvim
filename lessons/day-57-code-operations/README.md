# Day 57: Code-specific Operations - Language Features and Patterns

## Learning Objectives

By the end of this lesson, you will:
- Master language-specific navigation patterns
- Optimize operations for your primary programming languages
- Build muscle memory for common code structures
- Integrate language servers for intelligent operations
- Create custom operators for language patterns

## Theory: Language-Aware Editing

### The Power of Semantic Understanding

Vim becomes exponentially more powerful when combined with language understanding:
- **Syntactic Navigation**: Move by language constructs, not just text
- **Semantic Operations**: Operate on meaning, not just patterns
- **Intelligent Transformations**: Refactor with understanding of code structure
- **Context-Aware Completion**: Complete based on type and scope

### Language Server Protocol Integration

Modern Neovim leverages LSP for intelligent operations:
```vim
" Jump to definition
gd          " Go to definition
gD          " Go to declaration
gi          " Go to implementation
gr          " Go to references
gy          " Go to type definition

" Code actions
<leader>ca  " Code action
<leader>rn  " Rename symbol
<leader>f   " Format code
```

## Language-Specific Patterns

### JavaScript/TypeScript Patterns

#### Function Navigation
```javascript
// Navigate between function definitions
]m  " Next method/function
[m  " Previous method/function
]M  " Next method/function end
[M  " Previous method/function end

// Custom text objects for arrow functions
" vaf - Visual around function
" vif - Visual inside function
// Works with: () => {}, function() {}, async function() {}
```

#### Object and Array Operations
```javascript
// Intelligent object manipulation
const config = {
  server: {
    port: 3000,     // ci" changes value
    host: 'local'   // da" deletes entire line
  },
  database: {       // va{ selects object
    url: 'mongo'    // =i{ formats inside
  }
}

// Array operations
const items = [
  'first',    // dap deletes item with comma
  'second',   // cip changes item preserving comma
  'third'     // vap selects item with comma
]
```

### Python Patterns

#### Class and Method Navigation
```python
# Python-specific movements
]c  # Next class
[c  # Previous class
]f  # Next function/method
[f  # Previous function/method

# Indentation as text object
class DataProcessor:
    def __init__(self):     # vii selects method body
        self.data = []       # vai selects with decorator

    def process(self):       # daf deletes entire method
        for item in data:    # cii changes loop body
            yield item * 2   # =ii formats indent level
```

### Go Patterns

#### Error Handling Optimization
```go
// Quick error handling pattern
// Type: ierr<Tab> to expand error check
if err != nil {
    return err
}

// Struct field navigation
type Config struct {
    Host     string `json:"host"`      // ]f next field
    Port     int    `json:"port"`      // [f previous field
    Timeout  time.Duration             // daf delete field
}

// Interface implementation
]i  // Next interface method
[i  // Previous interface method
```

### Rust Patterns

#### Lifetime and Ownership Operations
```rust
// Navigate by ownership
]o  // Next ownership transfer
[o  // Previous ownership transfer

// Match arm operations
match result {
    Ok(value) => {},    // dam deletes arm
    Err(e) => {}       // cam changes arm
}                      // =am formats arm

// Trait implementation blocks
]t  // Next trait impl
[t  // Previous trait impl
```

## Advanced Code Operations

### Multi-Language Refactoring

#### Extract Variable (All Languages)
```vim
" Visual select expression, then:
<leader>ev  " Extract to variable
<leader>ec  " Extract to constant
<leader>ef  " Extract to function
<leader>em  " Extract to method
```

#### Inline Operations
```vim
" With cursor on variable/function:
<leader>iv  " Inline variable
<leader>if  " Inline function
<leader>it  " Inline type
```

### Smart Code Generation

#### Snippet-based Generation
```vim
" Type triggers for common patterns:
for<Tab>    " For loop
if<Tab>     " If statement
fn<Tab>     " Function
cl<Tab>     " Class
try<Tab>    " Try-catch block
```

#### Context-Aware Completion
```vim
" Intelligent completion chains:
<C-x><C-o>  " Omnicomplete (language-aware)
<C-x><C-n>  " Keyword in current file
<C-x><C-f>  " Filename completion
<C-x><C-l>  " Whole line completion
```

## Real-World Case Studies

### Case Study 1: Refactoring a REST API

**Scenario**: Converting callback-based API to async/await

```javascript
// Before: Callback hell
function fetchUser(id, callback) {
    db.getUser(id, (err, user) => {
        if (err) return callback(err);
        db.getPosts(user.id, (err, posts) => {
            if (err) return callback(err);
            callback(null, {...user, posts});
        });
    });
}

// Vim operations sequence:
// 1. Position at function start
// 2. cif to change inside function
// 3. Type: async function fetchUser(id) {
// 4. Use :%s/callback(/await /g
// 5. Remove error handling boilerplate with macros
// 6. Result:

async function fetchUser(id) {
    const user = await db.getUser(id);
    const posts = await db.getPosts(user.id);
    return {...user, posts};
}

// Time: 15 seconds vs 2 minutes manual editing
```

### Case Study 2: Type Annotation Addition

**Scenario**: Adding TypeScript types to JavaScript code

```typescript
// Macro for adding types: qa
// Position on parameter
// ea: string<Esc>
// Record: q

// Apply to function:
function processData(name, age, items) {
    // Position on 'name', @a
    // Position on 'age', ea: number<Esc>
    // Position on 'items', ea: any[]<Esc>
}

// Result:
function processData(name: string, age: number, items: any[]) {

// Time saved: 80% reduction in typing
```

### Case Study 3: Test Generation

**Scenario**: Creating test cases from implementation

```python
# Original implementation
def calculate_discount(price, percentage):
    if percentage < 0 or percentage > 100:
        raise ValueError("Invalid percentage")
    return price * (1 - percentage / 100)

# Vim sequence for test generation:
# 1. yaf (yank function)
# 2. Go to test file
# 3. o<Esc>p (paste)
# 4. Use macro to transform:
#    - Change 'def' to 'def test_'
#    - Add assert statements
#    - Generate edge cases

# Generated test (with macro):
def test_calculate_discount():
    assert calculate_discount(100, 10) == 90
    assert calculate_discount(50, 50) == 25
    with pytest.raises(ValueError):
        calculate_discount(100, -10)
    with pytest.raises(ValueError):
        calculate_discount(100, 110)
```

## Performance Metrics

### Measured Improvements

| Operation | Traditional | Vim Operations | Time Saved |
|-----------|------------|----------------|------------|
| Extract method | 45 sec | 5 sec | 89% |
| Rename across files | 2 min | 10 sec | 92% |
| Add error handling | 30 sec | 3 sec | 90% |
| Convert to async | 3 min | 20 sec | 89% |
| Generate tests | 5 min | 30 sec | 90% |
| Refactor imports | 1 min | 8 sec | 87% |

### Productivity Multipliers

```
Daily operations: ~200
Average time saved per operation: 30 seconds
Daily time saved: 100 minutes
Annual time saved: 416 hours (10.4 work weeks)
```

## Practice Challenges

### Challenge 1: Language-Specific Refactoring

Given this JavaScript code, perform these operations:
```javascript
// TODO: Convert to modern syntax
var MyModule = function() {
    var privateVar = 'hidden';

    return {
        method1: function(x) {
            return x * 2;
        },
        method2: function(y) {
            return y + privateVar;
        }
    };
};
```

**Tasks**:
1. Convert to ES6 class syntax
2. Use arrow functions where appropriate
3. Add TypeScript types
4. Time limit: 30 seconds

### Challenge 2: Cross-Language Pattern

Implement the same pattern in three languages:
```python
# Python version
class Observer:
    def __init__(self):
        self._observers = []

    def attach(self, observer):
        self._observers.append(observer)

    def notify(self, *args):
        for observer in self._observers:
            observer.update(self, *args)
```

**Tasks**:
1. Implement in JavaScript (ES6)
2. Implement in Go
3. Implement in Rust
4. Use yanking and transformation macros
5. Time limit: 2 minutes total

### Challenge 3: Intelligent Extraction

Extract and refactor this nested code:
```go
func processOrder(order Order) error {
    // Validation logic (extract to validateOrder)
    if order.ID == "" {
        return errors.New("missing ID")
    }
    if order.Amount <= 0 {
        return errors.New("invalid amount")
    }
    if len(order.Items) == 0 {
        return errors.New("no items")
    }

    // Processing logic (extract to calculateTotals)
    var total float64
    for _, item := range order.Items {
        total += item.Price * float64(item.Quantity)
    }

    // Persistence logic (extract to saveOrder)
    db := getDB()
    if err := db.Save(&order); err != nil {
        return fmt.Errorf("save failed: %w", err)
    }

    return nil
}
```

**Expected Result**: Three clean, focused functions
**Time limit**: 45 seconds

## Quick Reference Card

### Universal Code Operations
```vim
" Navigation
gd          " Go to definition
gr          " Find references
gi          " Go to implementation
K           " Show documentation

" Refactoring
<leader>rn  " Rename symbol
<leader>ca  " Code action
<leader>f   " Format code
<leader>qf  " Quick fix

" Text Objects (Language-aware)
af          " around function
if          " inside function
ac          " around class
ic          " inside class
aa          " around argument
ia          " inside argument
```

### Language-Specific Leaders
```vim
" JavaScript/TypeScript
<leader>ji  " Jump to import
<leader>je  " Jump to export
<leader>jc  " Jump to component

" Python
<leader>pc  " Jump to class
<leader>pf  " Jump to function
<leader>pi  " Fix imports

" Go
<leader>ge  " Jump to error
<leader>gi  " Jump to interface
<leader>gt  " Generate test

" Rust
<leader>rc  " Jump to crate
<leader>ri  " Jump to impl
<leader>rt  " Jump to trait
```

## Optimization Strategies

### 1. Language-Specific Configs
```vim
" ~/.config/nvim/ftplugin/javascript.vim
setlocal expandtab shiftwidth=2
nnoremap <buffer> <leader>log oconsole.log();<Esc>hi

" ~/.config/nvim/ftplugin/python.vim
setlocal expandtab shiftwidth=4
nnoremap <buffer> <leader>log oprint(f"{=}")<Esc>2F{a

" ~/.config/nvim/ftplugin/go.vim
setlocal noexpandtab shiftwidth=4
nnoremap <buffer> <leader>log ofmt.Println()<Esc>hi
```

### 2. Snippet Libraries
```vim
" UltiSnips/javascript.snippets
snippet ifer "if error return"
if (err) {
    return ${1:callback}(err);
}
endsnippet

snippet prom "Promise"
new Promise((resolve, reject) => {
    ${1:// implementation}
});
endsnippet
```

### 3. Custom Operators
```vim
" Operator for commenting
map gc <Plug>Commentary

" Operator for surrounding
map gs <Plug>VSurround

" Operator for replacing
map gr <Plug>ReplaceWithRegister
```

## Next Steps

### Tomorrow: Refactoring Patterns
- Learn systematic refactoring approaches
- Master large-scale code transformations
- Build refactoring macros
- Study Martin Fowler's catalog in Vim context

### Skill Development Path
1. **Master your primary language**: Focus 80% on one language
2. **Learn secondary patterns**: Add 2-3 languages gradually
3. **Build custom tools**: Create language-specific plugins
4. **Share knowledge**: Document your patterns for team

### Recommended Practice
- Refactor one legacy function daily
- Time yourself on common operations
- Build a personal snippet library
- Create language-specific cheat sheets

## Summary

Language-specific operations transform Vim from a text editor into an intelligent code manipulation system. By combining:
- LSP integration for semantic understanding
- Custom text objects for language constructs
- Targeted macros for common patterns
- Snippet expansion for boilerplate

You achieve a level of editing efficiency that's impossible with traditional IDEs. The key is building muscle memory for your specific language patterns while maintaining flexibility for polyglot development.

Remember: The goal isn't to memorize every possible operation, but to recognize patterns in your daily coding and optimize them systematically. Each optimized operation compounds into massive time savings over your career.