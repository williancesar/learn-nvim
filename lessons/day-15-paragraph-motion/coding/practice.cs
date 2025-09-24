using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ParagraphMotionPractice
{
    /// <summary>
    /// Practice file for paragraph motion ({ and }) in C#
    /// Focus on navigating between logical code blocks separated by blank lines
    /// </summary>
    public class CustomerService
    {
        private readonly IRepository<Customer> _customerRepository;
        private readonly ILogger<CustomerService> _logger;
        private readonly IEmailService _emailService;

        public CustomerService(
            IRepository<Customer> customerRepository,
            ILogger<CustomerService> logger,
            IEmailService emailService)
        {
            _customerRepository = customerRepository ?? throw new ArgumentNullException(nameof(customerRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
        }


        public async Task<Customer?> GetCustomerByIdAsync(int customerId)
        {
            if (customerId <= 0)
            {
                _logger.LogWarning("Invalid customer ID provided: {CustomerId}", customerId);
                return null;
            }

            try
            {
                var customer = await _customerRepository.GetByIdAsync(customerId);
                return customer;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving customer with ID: {CustomerId}", customerId);
                throw;
            }
        }


        public async Task<IEnumerable<Customer>> GetActiveCustomersAsync()
        {
            var customers = await _customerRepository.GetAllAsync();

            var activeCustomers = customers
                .Where(c => c.IsActive)
                .Where(c => c.LastLoginDate >= DateTime.Now.AddDays(-30))
                .OrderBy(c => c.LastName)
                .ThenBy(c => c.FirstName);

            return activeCustomers;
        }


        public async Task<bool> CreateCustomerAsync(CustomerDto customerDto)
        {
            if (customerDto == null)
                throw new ArgumentNullException(nameof(customerDto));

            var validationResult = ValidateCustomerData(customerDto);
            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Customer validation failed: {Errors}",
                    string.Join(", ", validationResult.Errors));
                return false;
            }

            var customer = new Customer
            {
                FirstName = customerDto.FirstName,
                LastName = customerDto.LastName,
                Email = customerDto.Email,
                PhoneNumber = customerDto.PhoneNumber,
                DateOfBirth = customerDto.DateOfBirth,
                CreatedDate = DateTime.UtcNow,
                IsActive = true
            };

            try
            {
                await _customerRepository.AddAsync(customer);
                await SendWelcomeEmailAsync(customer);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create customer: {Email}", customerDto.Email);
                return false;
            }
        }


        public async Task<bool> UpdateCustomerAsync(int customerId, CustomerDto customerDto)
        {
            var existingCustomer = await _customerRepository.GetByIdAsync(customerId);
            if (existingCustomer == null)
            {
                _logger.LogWarning("Customer not found for update: {CustomerId}", customerId);
                return false;
            }

            existingCustomer.FirstName = customerDto.FirstName;
            existingCustomer.LastName = customerDto.LastName;
            existingCustomer.Email = customerDto.Email;
            existingCustomer.PhoneNumber = customerDto.PhoneNumber;
            existingCustomer.DateOfBirth = customerDto.DateOfBirth;
            existingCustomer.ModifiedDate = DateTime.UtcNow;

            await _customerRepository.UpdateAsync(existingCustomer);
            return true;
        }


        public async Task<bool> DeactivateCustomerAsync(int customerId, string reason)
        {
            var customer = await _customerRepository.GetByIdAsync(customerId);
            if (customer == null)
                return false;

            customer.IsActive = false;
            customer.DeactivationDate = DateTime.UtcNow;
            customer.DeactivationReason = reason;

            await _customerRepository.UpdateAsync(customer);

            _logger.LogInformation("Customer deactivated: {CustomerId}, Reason: {Reason}",
                customerId, reason);

            return true;
        }


        private ValidationResult ValidateCustomerData(CustomerDto customerDto)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(customerDto.FirstName))
                errors.Add("First name is required");

            if (string.IsNullOrWhiteSpace(customerDto.LastName))
                errors.Add("Last name is required");

            if (string.IsNullOrWhiteSpace(customerDto.Email))
                errors.Add("Email is required");
            else if (!IsValidEmail(customerDto.Email))
                errors.Add("Invalid email format");

            if (customerDto.DateOfBirth > DateTime.Now.AddYears(-13))
                errors.Add("Customer must be at least 13 years old");

            return new ValidationResult
            {
                IsValid = errors.Count == 0,
                Errors = errors
            };
        }


        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }


        private async Task SendWelcomeEmailAsync(Customer customer)
        {
            var emailContent = $"Welcome to our service, {customer.FirstName}!";

            try
            {
                await _emailService.SendAsync(customer.Email, "Welcome!", emailContent);
                _logger.LogInformation("Welcome email sent to: {Email}", customer.Email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send welcome email to: {Email}", customer.Email);
            }
        }
    }


    public record CustomerDto(
        string FirstName,
        string LastName,
        string Email,
        string? PhoneNumber,
        DateTime DateOfBirth
    );


    public class Customer
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsActive { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public DateTime? DeactivationDate { get; set; }
        public string? DeactivationReason { get; set; }
    }


    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public List<string> Errors { get; set; } = new();
    }
}