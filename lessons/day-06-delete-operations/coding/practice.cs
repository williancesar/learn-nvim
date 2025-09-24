/*
 * Day 06: Delete Operations Practice
 *
 * Delete Operation Instructions:
 * 1. Use 'x' and 'X' to delete characters
 * 2. Practice 'dw', 'db', 'de' for word deletion
 * 3. Use 'dd' to delete entire lines
 * 4. Try 'D' to delete from cursor to end of line
 * 5. Practice 'd$' and 'd0' for partial line deletion
 * 6. Use visual mode + 'd' for complex deletions
 * 7. Clean up the over-commented code below
 */

using System; // This import is necessary for basic C# functionality and should be kept in most files
using System.Collections.Generic; // Required for List<T>, Dictionary<T>, and other generic collections
using System.Linq; // Essential for LINQ operations like Where, Select, OrderBy, etc.
using System.Threading.Tasks; // Needed for async/await operations and Task<T> return types
using System.ComponentModel.DataAnnotations; // Provides validation attributes like [Required], [Range], etc.
using System.Text.Json; // Modern JSON serialization library replacing Newtonsoft.Json in .NET
using System.Text.Json.Serialization; // Additional JSON attributes for property naming and serialization control

namespace NvimPractice.Day06.DeleteOperations; // Namespace follows standard .NET naming conventions

// ============================================================================
// EXCESSIVE DOCUMENTATION SECTION - PRACTICE DELETING COMMENTS
// ============================================================================
// This file demonstrates over-commenting and redundant documentation
// Every line has unnecessary explanations that should be removed
// Practice your deletion skills by cleaning up these verbose comments
// Focus on keeping only the essential comments and documentation
// ============================================================================

/// <summary>
/// Financial transaction processing system with comprehensive audit trails
/// This class handles all types of financial transactions including deposits, withdrawals, transfers
/// It maintains detailed logs of every operation for compliance and debugging purposes
/// The system supports multiple currencies and provides real-time balance calculations
/// All operations are thread-safe and support both synchronous and asynchronous execution
/// </summary>
public class BankAccountManager // This class manages bank accounts - obvious from the name
{
    // Private field to store all accounts - using Dictionary for O(1) lookup performance
    private readonly Dictionary<string, BankAccount> _accounts = new(); // Initialize empty dictionary

    // Private field for transaction history - using List for chronological ordering
    private readonly List<Transaction> _transactions = new(); // Store all transactions

    // Lock object for thread safety - prevents concurrent access issues
    private readonly object _lockObject = new(); // Simple object for locking

    // Static field for generating unique transaction IDs - thread-safe counter
    private static long _transactionIdCounter = 1; // Start from 1, not 0

    // Default constructor - initializes the manager with empty collections
    public BankAccountManager() // Constructor doesn't need parameters in this basic implementation
    {
        // No initialization needed as fields are already initialized above
        // Collections are created with field initializers for better performance
    } // End of constructor

    /// <summary>
    /// Creates a new bank account with the specified account number and initial balance
    /// Validates that the account number is unique and the initial balance is non-negative
    /// Adds the account to the internal dictionary for future operations
    /// Returns true if successful, false if account already exists
    /// Thread-safe operation using lock statement
    /// </summary>
    /// <param name="accountNumber">Unique identifier for the account - must be non-empty string</param>
    /// <param name="initialBalance">Starting balance - must be >= 0 for regulatory compliance</param>
    /// <param name="accountHolderName">Name of the account owner - required for identification</param>
    /// <returns>Boolean indicating success or failure of account creation</returns>
    public bool CreateAccount(string accountNumber, decimal initialBalance, string accountHolderName)
    { // Method body starts here
        // Validate input parameters - null or empty values are not allowed
        if (string.IsNullOrWhiteSpace(accountNumber)) // Check for null, empty, or whitespace-only
        {
            return false; // Return failure for invalid account number
        } // End of account number validation

        if (string.IsNullOrWhiteSpace(accountHolderName)) // Validate account holder name
        {
            return false; // Name is required for all accounts
        } // End of name validation

        if (initialBalance < 0) // Negative balances not allowed for new accounts
        {
            return false; // Regulatory requirement - no negative starting balances
        } // End of balance validation

        lock (_lockObject) // Enter critical section for thread safety
        { // Critical section begins
            if (_accounts.ContainsKey(accountNumber)) // Check if account already exists
            {
                return false; // Account number must be unique - duplicate not allowed
            } // End of duplicate check

            // Create new account instance with provided parameters
            var newAccount = new BankAccount // Object initialization syntax
            {
                AccountNumber = accountNumber, // Set the unique identifier
                Balance = initialBalance, // Set the starting balance
                AccountHolderName = accountHolderName, // Set the owner's name
                CreatedDate = DateTime.UtcNow, // Record creation timestamp in UTC
                IsActive = true // New accounts are active by default
            }; // End of object initialization

            _accounts.Add(accountNumber, newAccount); // Add to dictionary using account number as key

            // Record the initial deposit transaction if balance > 0
            if (initialBalance > 0) // Only create transaction for non-zero initial deposits
            {
                var initialTransaction = new Transaction // Create transaction record
                {
                    Id = GenerateTransactionId(), // Get unique transaction ID
                    AccountNumber = accountNumber, // Link to the account
                    Type = TransactionType.Deposit, // Initial balance is considered a deposit
                    Amount = initialBalance, // Transaction amount equals initial balance
                    Timestamp = DateTime.UtcNow, // Record when transaction occurred
                    Description = "Initial account funding", // Descriptive message
                    BalanceAfter = initialBalance // Balance after this transaction
                }; // End of transaction object initialization

                _transactions.Add(initialTransaction); // Add to transaction history
            } // End of initial transaction recording

            return true; // Return success - account created successfully
        } // End of critical section
    } // End of CreateAccount method

    /// <summary>
    /// Processes a deposit transaction to add funds to the specified account
    /// Validates account existence and transaction amount before processing
    /// Updates account balance and records transaction in audit trail
    /// All operations are atomic and thread-safe
    /// </summary>
    /// <param name="accountNumber">Target account for the deposit - must exist</param>
    /// <param name="amount">Amount to deposit - must be positive value</param>
    /// <param name="description">Optional description for the transaction</param>
    /// <returns>Transaction object if successful, null if failed</returns>
    public Transaction? DepositFunds(string accountNumber, decimal amount, string description = "Deposit")
    { // Method implementation begins
        // Validate input parameters before processing
        if (string.IsNullOrWhiteSpace(accountNumber)) // Account number is required
        {
            return null; // Cannot process without valid account number
        } // End of account number validation

        if (amount <= 0) // Deposit amount must be positive
        {
            return null; // Zero or negative deposits are not allowed
        } // End of amount validation

        lock (_lockObject) // Thread-safe operation using lock
        { // Begin critical section
            if (!_accounts.TryGetValue(accountNumber, out var account)) // Find the target account
            {
                return null; // Account doesn't exist - cannot deposit
            } // End of account existence check

            if (!account.IsActive) // Check if account is active
            {
                return null; // Cannot deposit to inactive accounts
            } // End of account status check

            // Update account balance - add the deposit amount
            account.Balance += amount; // Simple addition operation
            account.LastTransactionDate = DateTime.UtcNow; // Update last activity timestamp

            // Create transaction record for audit trail
            var transaction = new Transaction // Initialize new transaction object
            {
                Id = GenerateTransactionId(), // Generate unique identifier
                AccountNumber = accountNumber, // Link to account
                Type = TransactionType.Deposit, // Specify transaction type
                Amount = amount, // Record transaction amount
                Timestamp = DateTime.UtcNow, // When transaction occurred
                Description = description ?? "Deposit", // Use provided or default description
                BalanceAfter = account.Balance // Account balance after this transaction
            }; // End of transaction initialization

            _transactions.Add(transaction); // Add to transaction history
            return transaction; // Return the created transaction
        } // End of critical section
    } // End of DepositFunds method

    // Method to withdraw funds - similar structure to deposit but with different validation
    public Transaction? WithdrawFunds(string accountNumber, decimal amount, string description = "Withdrawal") // Withdrawal method signature
    { // Method body starts
        if (string.IsNullOrWhiteSpace(accountNumber)) // Validate account number parameter
        {
            return null; // Invalid account number
        }

        if (amount <= 0) // Withdrawal amount must be positive
        {
            return null; // Cannot withdraw zero or negative amounts
        }

        lock (_lockObject) // Thread synchronization for safety
        {
            if (!_accounts.TryGetValue(accountNumber, out var account)) // Find account
            {
                return null; // Account not found
            }

            if (!account.IsActive) // Verify account is active
            {
                return null; // Inactive accounts cannot process withdrawals
            }

            if (account.Balance < amount) // Check for sufficient funds
            {
                return null; // Insufficient balance for withdrawal
            }

            account.Balance -= amount; // Subtract withdrawal amount from balance
            account.LastTransactionDate = DateTime.UtcNow; // Update activity timestamp

            var transaction = new Transaction // Create withdrawal transaction record
            {
                Id = GenerateTransactionId(), // Unique transaction identifier
                AccountNumber = accountNumber, // Account reference
                Type = TransactionType.Withdrawal, // Transaction type
                Amount = amount, // Transaction amount
                Timestamp = DateTime.UtcNow, // Transaction timestamp
                Description = description ?? "Withdrawal", // Transaction description
                BalanceAfter = account.Balance // Resulting balance
            };

            _transactions.Add(transaction); // Record transaction in history
            return transaction; // Return transaction object
        }
    } // End of withdrawal method

    // Transfer method - combines withdrawal from source and deposit to destination
    public TransferResult TransferFunds(string fromAccount, string toAccount, decimal amount, string description = "Transfer") // Method for account-to-account transfers
    {
        // Input validation section
        if (string.IsNullOrWhiteSpace(fromAccount) || string.IsNullOrWhiteSpace(toAccount)) // Validate account numbers
        {
            return new TransferResult { Success = false, ErrorMessage = "Invalid account numbers" }; // Return failure
        }

        if (fromAccount == toAccount) // Prevent transfers to same account
        {
            return new TransferResult { Success = false, ErrorMessage = "Cannot transfer to same account" }; // Self-transfer not allowed
        }

        if (amount <= 0) // Transfer amount must be positive
        {
            return new TransferResult { Success = false, ErrorMessage = "Transfer amount must be positive" }; // Invalid amount
        }

        lock (_lockObject) // Synchronize access to accounts
        {
            // Validate source account
            if (!_accounts.TryGetValue(fromAccount, out var sourceAccount)) // Find source account
            {
                return new TransferResult { Success = false, ErrorMessage = "Source account not found" }; // Source missing
            }

            // Validate destination account
            if (!_accounts.TryGetValue(toAccount, out var destinationAccount)) // Find destination account
            {
                return new TransferResult { Success = false, ErrorMessage = "Destination account not found" }; // Destination missing
            }

            // Check account status
            if (!sourceAccount.IsActive || !destinationAccount.IsActive) // Both accounts must be active
            {
                return new TransferResult { Success = false, ErrorMessage = "One or both accounts are inactive" }; // Status check
            }

            // Check sufficient funds
            if (sourceAccount.Balance < amount) // Verify source has enough money
            {
                return new TransferResult { Success = false, ErrorMessage = "Insufficient funds" }; // Not enough money
            }

            // Process the transfer - atomic operation
            sourceAccount.Balance -= amount; // Debit source account
            destinationAccount.Balance += amount; // Credit destination account

            // Update timestamps
            sourceAccount.LastTransactionDate = DateTime.UtcNow; // Source activity
            destinationAccount.LastTransactionDate = DateTime.UtcNow; // Destination activity

            // Record withdrawal transaction
            var withdrawalTransaction = new Transaction // Source account transaction
            {
                Id = GenerateTransactionId(), // Unique ID for withdrawal
                AccountNumber = fromAccount, // Source account
                Type = TransactionType.Transfer, // Transfer type
                Amount = -amount, // Negative amount for withdrawal
                Timestamp = DateTime.UtcNow, // When it happened
                Description = $"Transfer to {toAccount}: {description}", // Descriptive message
                BalanceAfter = sourceAccount.Balance, // Balance after withdrawal
                RelatedAccountNumber = toAccount // Link to destination
            };

            // Record deposit transaction
            var depositTransaction = new Transaction // Destination account transaction
            {
                Id = GenerateTransactionId(), // Unique ID for deposit
                AccountNumber = toAccount, // Destination account
                Type = TransactionType.Transfer, // Transfer type
                Amount = amount, // Positive amount for deposit
                Timestamp = DateTime.UtcNow, // Same timestamp
                Description = $"Transfer from {fromAccount}: {description}", // Descriptive message
                BalanceAfter = destinationAccount.Balance, // Balance after deposit
                RelatedAccountNumber = fromAccount // Link to source
            };

            // Add both transactions to history
            _transactions.Add(withdrawalTransaction); // Record withdrawal
            _transactions.Add(depositTransaction); // Record deposit

            return new TransferResult // Return success result
            {
                Success = true, // Operation succeeded
                WithdrawalTransaction = withdrawalTransaction, // Source transaction
                DepositTransaction = depositTransaction // Destination transaction
            };
        }
    }

    // Utility method to generate unique transaction IDs
    private static long GenerateTransactionId() // Thread-safe ID generation
    {
        return Interlocked.Increment(ref _transactionIdCounter); // Atomic increment
    }

    // Method to get account balance - simple lookup operation
    public decimal? GetAccountBalance(string accountNumber) // Balance inquiry method
    {
        if (string.IsNullOrWhiteSpace(accountNumber)) // Validate input
        {
            return null; // Invalid account number
        }

        lock (_lockObject) // Thread-safe read operation
        {
            return _accounts.TryGetValue(accountNumber, out var account) ? account.Balance : null; // Return balance or null
        }
    }

    // Method to get transaction history for an account
    public IEnumerable<Transaction> GetTransactionHistory(string accountNumber) // Transaction history retrieval
    {
        if (string.IsNullOrWhiteSpace(accountNumber)) // Validate account number
        {
            return Enumerable.Empty<Transaction>(); // Return empty collection
        }

        lock (_lockObject) // Thread-safe collection access
        {
            return _transactions.Where(t => t.AccountNumber == accountNumber).OrderByDescending(t => t.Timestamp).ToList(); // Filtered and sorted transactions
        }
    }
}

// Data model classes with excessive documentation

/// <summary>
/// Represents a bank account with all necessary properties for financial operations
/// Includes balance tracking, metadata, and status information
/// All properties are designed for both read and write operations
/// Thread-safety is handled at the service layer, not the model level
/// </summary>
public class BankAccount // Main account entity class
{
    /// <summary>
    /// Unique identifier for the account - primary key
    /// Must be unique across all accounts in the system
    /// Used for all account lookup operations
    /// Should never be changed after account creation
    /// </summary>
    public string AccountNumber { get; set; } = string.Empty; // Account identifier property

    /// <summary>
    /// Current balance of the account in the base currency
    /// Can be positive, zero, or negative (for overdrafts)
    /// Updated with every financial transaction
    /// Precision is maintained using decimal type
    /// </summary>
    public decimal Balance { get; set; } // Account balance property

    /// <summary>
    /// Full name of the account holder
    /// Required for account identification and legal purposes
    /// Should match official identification documents
    /// Used for customer service and verification
    /// </summary>
    public string AccountHolderName { get; set; } = string.Empty; // Customer name property

    /// <summary>
    /// Timestamp when the account was created
    /// Stored in UTC for consistency across time zones
    /// Used for account age calculations and reporting
    /// Immutable after account creation
    /// </summary>
    public DateTime CreatedDate { get; set; } // Account creation timestamp

    /// <summary>
    /// Timestamp of the most recent transaction
    /// Updated automatically with each transaction
    /// Used for account activity monitoring
    /// Helps identify dormant accounts
    /// </summary>
    public DateTime? LastTransactionDate { get; set; } // Last activity timestamp

    /// <summary>
    /// Indicates whether the account is currently active
    /// Active accounts can process transactions
    /// Inactive accounts are frozen for security or regulatory reasons
    /// Can be toggled by administrators
    /// </summary>
    public bool IsActive { get; set; } = true; // Account status flag
} // End of BankAccount class

/// <summary>
/// Represents a single financial transaction with complete audit information
/// Contains all details needed for regulatory compliance and customer service
/// Immutable after creation to maintain audit trail integrity
/// Links transactions to accounts and related transactions
/// </summary>
public class Transaction // Transaction record class
{
    /// <summary>
    /// Unique identifier for this transaction
    /// Generated automatically using thread-safe counter
    /// Used for transaction lookup and references
    /// Never reused even after transaction deletion
    /// </summary>
    public long Id { get; set; } // Transaction unique identifier

    /// <summary>
    /// Account number associated with this transaction
    /// Links transaction to specific account
    /// Used for transaction history queries
    /// Must match existing account number
    /// </summary>
    public string AccountNumber { get; set; } = string.Empty; // Account reference

    /// <summary>
    /// Type of transaction - deposit, withdrawal, or transfer
    /// Determines how the transaction affects account balance
    /// Used for reporting and categorization
    /// Cannot be changed after creation
    /// </summary>
    public TransactionType Type { get; set; } // Transaction category

    /// <summary>
    /// Transaction amount in base currency
    /// Positive for credits, negative for debits
    /// Decimal precision for accurate calculations
    /// Cannot be zero - validated at creation
    /// </summary>
    public decimal Amount { get; set; } // Transaction value

    /// <summary>
    /// Exact time when transaction was processed
    /// Stored in UTC for consistency
    /// Used for chronological ordering
    /// Immutable audit trail requirement
    /// </summary>
    public DateTime Timestamp { get; set; } // Processing timestamp

    /// <summary>
    /// Human-readable description of the transaction
    /// Provides context for customer and audit purposes
    /// Can include reference numbers or explanations
    /// Optional but recommended for clarity
    /// </summary>
    public string Description { get; set; } = string.Empty; // Transaction description

    /// <summary>
    /// Account balance immediately after this transaction
    /// Snapshot of balance state for audit purposes
    /// Used for balance verification and reconciliation
    /// Calculated at transaction time
    /// </summary>
    public decimal BalanceAfter { get; set; } // Post-transaction balance

    /// <summary>
    /// Related account number for transfer transactions
    /// Links transfer pairs together for complete audit trail
    /// Null for deposit and withdrawal transactions
    /// Points to counterpart account in transfers
    /// </summary>
    public string? RelatedAccountNumber { get; set; } // Transfer counterpart reference
} // End of Transaction class

/// <summary>
/// Enumeration of all supported transaction types
/// Used for categorization and business logic
/// Each type has specific processing rules
/// Cannot be extended without code changes
/// </summary>
public enum TransactionType // Transaction classification enum
{
    /// <summary>
    /// Money added to account - increases balance
    /// Always positive amount value
    /// Can be cash, check, or electronic deposit
    /// </summary>
    Deposit, // Credit transaction type

    /// <summary>
    /// Money removed from account - decreases balance
    /// Always positive amount value (debit represented as positive)
    /// Requires sufficient balance or overdraft facility
    /// </summary>
    Withdrawal, // Debit transaction type

    /// <summary>
    /// Money moved between accounts - affects two accounts
    /// Creates paired transactions for complete audit trail
    /// Atomic operation - both sides succeed or fail together
    /// </summary>
    Transfer // Account-to-account movement type
} // End of TransactionType enum

/// <summary>
/// Result object for transfer operations containing all relevant information
/// Includes success status, error messages, and transaction references
/// Used to provide complete feedback to calling code
/// Immutable after creation for consistency
/// </summary>
public class TransferResult // Transfer operation result container
{
    /// <summary>
    /// Indicates whether the transfer operation succeeded
    /// True for successful transfers, false for any failure
    /// Primary indicator for error handling logic
    /// </summary>
    public bool Success { get; set; } // Operation success flag

    /// <summary>
    /// Descriptive error message for failed transfers
    /// Null or empty for successful operations
    /// Provides specific reason for failure
    /// Safe for display to users
    /// </summary>
    public string? ErrorMessage { get; set; } // Failure reason description

    /// <summary>
    /// Transaction record for the withdrawal side of transfer
    /// Null for failed transfers
    /// Contains negative amount and source account details
    /// Links to deposit transaction via RelatedAccountNumber
    /// </summary>
    public Transaction? WithdrawalTransaction { get; set; } // Source account transaction

    /// <summary>
    /// Transaction record for the deposit side of transfer
    /// Null for failed transfers
    /// Contains positive amount and destination account details
    /// Links to withdrawal transaction via RelatedAccountNumber
    /// </summary>
    public Transaction? DepositTransaction { get; set; } // Destination account transaction
} // End of TransferResult class