using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace TextObjectsPractice
{
    /// <summary>
    /// Practice file for text objects (iw, aw, is, as, ip, ap)
    /// Focus on selecting and manipulating words, sentences, and paragraphs
    /// Practice with classes, interfaces, methods, and properties
    /// </summary>
    public interface IUserRepository
    {
        Task<User> GetUserByIdAsync(int userId);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> CreateUserAsync(User user);
        Task<User> UpdateUserAsync(User user);
        Task<bool> DeleteUserAsync(int userId);
        Task<IEnumerable<User>> SearchUsersAsync(string searchTerm);
        Task<bool> UserExistsAsync(string email);
        Task<IEnumerable<User>> GetUsersByRoleAsync(string role);
    }

    public interface IEmailService
    {
        Task SendWelcomeEmailAsync(string emailAddress, string userName);
        Task SendPasswordResetEmailAsync(string emailAddress, string resetToken);
        Task SendNotificationEmailAsync(string emailAddress, string subject, string body);
        Task<bool> ValidateEmailAddressAsync(string emailAddress);
    }

    public interface IPasswordHasher
    {
        string HashPassword(string password);
        bool VerifyPassword(string password, string hashedPassword);
        string GenerateRandomSalt();
    }

    public class UserService
    {
        private readonly IUserRepository userRepository;
        private readonly IEmailService emailService;
        private readonly IPasswordHasher passwordHasher;
        private readonly ILogger<UserService> logger;

        public UserService(
            IUserRepository userRepository,
            IEmailService emailService,
            IPasswordHasher passwordHasher,
            ILogger<UserService> logger)
        {
            this.userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            this.emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
            this.passwordHasher = passwordHasher ?? throw new ArgumentNullException(nameof(passwordHasher));
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<UserRegistrationResult> RegisterUserAsync(UserRegistrationRequest request)
        {
            logger.LogInformation("Starting user registration for email: {Email}", request.EmailAddress);

            var validationResult = ValidateRegistrationRequest(request);
            if (!validationResult.IsValid)
            {
                return new UserRegistrationResult { Success = false, Errors = validationResult.Errors };
            }

            var existingUser = await userRepository.UserExistsAsync(request.EmailAddress);
            if (existingUser)
            {
                logger.LogWarning("Registration failed: User already exists with email {Email}", request.EmailAddress);
                return new UserRegistrationResult { Success = false, Errors = new[] { "User already exists" } };
            }

            var hashedPassword = passwordHasher.HashPassword(request.Password);
            var newUser = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                EmailAddress = request.EmailAddress,
                PasswordHash = hashedPassword,
                DateOfBirth = request.DateOfBirth,
                PhoneNumber = request.PhoneNumber,
                CreatedDate = DateTime.UtcNow,
                IsActive = true,
                Role = "User"
            };

            try
            {
                var createdUser = await userRepository.CreateUserAsync(newUser);
                await emailService.SendWelcomeEmailAsync(createdUser.EmailAddress, createdUser.FullName);

                logger.LogInformation("User registration completed successfully for {Email}", request.EmailAddress);
                return new UserRegistrationResult { Success = true, UserId = createdUser.Id };
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error during user registration for {Email}", request.EmailAddress);
                return new UserRegistrationResult { Success = false, Errors = new[] { "Registration failed" } };
            }
        }

        public async Task<UserLoginResult> LoginUserAsync(UserLoginRequest request)
        {
            logger.LogInformation("User login attempt for email: {Email}", request.EmailAddress);

            if (string.IsNullOrWhiteSpace(request.EmailAddress) || string.IsNullOrWhiteSpace(request.Password))
            {
                return new UserLoginResult { Success = false, ErrorMessage = "Email and password are required" };
            }

            var users = await userRepository.SearchUsersAsync(request.EmailAddress);
            var user = users.FirstOrDefault(u => u.EmailAddress.Equals(request.EmailAddress, StringComparison.OrdinalIgnoreCase));

            if (user == null)
            {
                logger.LogWarning("Login failed: User not found with email {Email}", request.EmailAddress);
                return new UserLoginResult { Success = false, ErrorMessage = "Invalid credentials" };
            }

            if (!user.IsActive)
            {
                logger.LogWarning("Login failed: User account is inactive for {Email}", request.EmailAddress);
                return new UserLoginResult { Success = false, ErrorMessage = "Account is inactive" };
            }

            var passwordValid = passwordHasher.VerifyPassword(request.Password, user.PasswordHash);
            if (!passwordValid)
            {
                logger.LogWarning("Login failed: Invalid password for {Email}", request.EmailAddress);
                return new UserLoginResult { Success = false, ErrorMessage = "Invalid credentials" };
            }

            user.LastLoginDate = DateTime.UtcNow;
            await userRepository.UpdateUserAsync(user);

            logger.LogInformation("User login successful for {Email}", request.EmailAddress);
            return new UserLoginResult { Success = true, User = user };
        }

        public async Task<UserUpdateResult> UpdateUserProfileAsync(int userId, UserUpdateRequest request)
        {
            logger.LogInformation("Updating user profile for userId: {UserId}", userId);

            var existingUser = await userRepository.GetUserByIdAsync(userId);
            if (existingUser == null)
            {
                return new UserUpdateResult { Success = false, ErrorMessage = "User not found" };
            }

            var validationResult = ValidateUpdateRequest(request);
            if (!validationResult.IsValid)
            {
                return new UserUpdateResult { Success = false, Errors = validationResult.Errors };
            }

            existingUser.FirstName = request.FirstName ?? existingUser.FirstName;
            existingUser.LastName = request.LastName ?? existingUser.LastName;
            existingUser.PhoneNumber = request.PhoneNumber ?? existingUser.PhoneNumber;
            existingUser.DateOfBirth = request.DateOfBirth ?? existingUser.DateOfBirth;
            existingUser.ModifiedDate = DateTime.UtcNow;

            try
            {
                var updatedUser = await userRepository.UpdateUserAsync(existingUser);
                logger.LogInformation("User profile updated successfully for userId: {UserId}", userId);
                return new UserUpdateResult { Success = true, User = updatedUser };
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error updating user profile for userId: {UserId}", userId);
                return new UserUpdateResult { Success = false, ErrorMessage = "Update failed" };
            }
        }

        public async Task<PasswordResetResult> RequestPasswordResetAsync(string emailAddress)
        {
            logger.LogInformation("Password reset requested for email: {Email}", emailAddress);

            if (!await emailService.ValidateEmailAddressAsync(emailAddress))
            {
                return new PasswordResetResult { Success = false, ErrorMessage = "Invalid email address" };
            }

            var users = await userRepository.SearchUsersAsync(emailAddress);
            var user = users.FirstOrDefault(u => u.EmailAddress.Equals(emailAddress, StringComparison.OrdinalIgnoreCase));

            if (user == null)
            {
                logger.LogWarning("Password reset failed: User not found with email {Email}", emailAddress);
                return new PasswordResetResult { Success = false, ErrorMessage = "User not found" };
            }

            var resetToken = GeneratePasswordResetToken();
            user.PasswordResetToken = resetToken;
            user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1);

            await userRepository.UpdateUserAsync(user);
            await emailService.SendPasswordResetEmailAsync(emailAddress, resetToken);

            logger.LogInformation("Password reset email sent for {Email}", emailAddress);
            return new PasswordResetResult { Success = true, Message = "Password reset email sent" };
        }

        private ValidationResult ValidateRegistrationRequest(UserRegistrationRequest request)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(request.FirstName))
                errors.Add("First name is required");

            if (string.IsNullOrWhiteSpace(request.LastName))
                errors.Add("Last name is required");

            if (string.IsNullOrWhiteSpace(request.EmailAddress))
                errors.Add("Email address is required");
            else if (!IsValidEmailFormat(request.EmailAddress))
                errors.Add("Invalid email format");

            if (string.IsNullOrWhiteSpace(request.Password))
                errors.Add("Password is required");
            else if (!IsValidPasswordStrength(request.Password))
                errors.Add("Password does not meet strength requirements");

            if (request.DateOfBirth.HasValue && request.DateOfBirth.Value > DateTime.Now.AddYears(-13))
                errors.Add("User must be at least 13 years old");

            return new ValidationResult { IsValid = errors.Count == 0, Errors = errors };
        }

        private ValidationResult ValidateUpdateRequest(UserUpdateRequest request)
        {
            var errors = new List<string>();

            if (!string.IsNullOrWhiteSpace(request.FirstName) && request.FirstName.Length > 50)
                errors.Add("First name cannot exceed 50 characters");

            if (!string.IsNullOrWhiteSpace(request.LastName) && request.LastName.Length > 50)
                errors.Add("Last name cannot exceed 50 characters");

            if (!string.IsNullOrWhiteSpace(request.PhoneNumber) && !IsValidPhoneNumber(request.PhoneNumber))
                errors.Add("Invalid phone number format");

            if (request.DateOfBirth.HasValue && request.DateOfBirth.Value > DateTime.Now.AddYears(-13))
                errors.Add("User must be at least 13 years old");

            return new ValidationResult { IsValid = errors.Count == 0, Errors = errors };
        }

        private bool IsValidEmailFormat(string email)
        {
            try
            {
                var address = new System.Net.Mail.MailAddress(email);
                return address.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private bool IsValidPasswordStrength(string password)
        {
            if (password.Length < 8)
                return false;

            var hasUpperCase = password.Any(char.IsUpper);
            var hasLowerCase = password.Any(char.IsLower);
            var hasDigit = password.Any(char.IsDigit);
            var hasSpecialChar = password.Any(ch => !char.IsLetterOrDigit(ch));

            return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
        }

        private bool IsValidPhoneNumber(string phoneNumber)
        {
            var digits = phoneNumber.Where(char.IsDigit).Count();
            return digits >= 10 && digits <= 15;
        }

        private string GeneratePasswordResetToken()
        {
            return Guid.NewGuid().ToString("N").ToUpperInvariant();
        }
    }

    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string EmailAddress { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public bool IsActive { get; set; }
        public string Role { get; set; } = "User";
        public string? PasswordResetToken { get; set; }
        public DateTime? PasswordResetTokenExpiry { get; set; }

        public string FullName => $"{FirstName} {LastName}";
        public int Age => DateOfBirth.HasValue ? DateTime.Now.Year - DateOfBirth.Value.Year : 0;
        public bool IsPasswordResetTokenValid => PasswordResetTokenExpiry.HasValue && PasswordResetTokenExpiry.Value > DateTime.UtcNow;
    }

    public record UserRegistrationRequest(
        string FirstName,
        string LastName,
        string EmailAddress,
        string Password,
        string? PhoneNumber,
        DateTime? DateOfBirth
    );

    public record UserLoginRequest(string EmailAddress, string Password);

    public record UserUpdateRequest(
        string? FirstName,
        string? LastName,
        string? PhoneNumber,
        DateTime? DateOfBirth
    );

    public class UserRegistrationResult
    {
        public bool Success { get; set; }
        public int UserId { get; set; }
        public IEnumerable<string> Errors { get; set; } = Array.Empty<string>();
    }

    public class UserLoginResult
    {
        public bool Success { get; set; }
        public User? User { get; set; }
        public string? ErrorMessage { get; set; }
    }

    public class UserUpdateResult
    {
        public bool Success { get; set; }
        public User? User { get; set; }
        public string? ErrorMessage { get; set; }
        public IEnumerable<string> Errors { get; set; } = Array.Empty<string>();
    }

    public class PasswordResetResult
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public string? ErrorMessage { get; set; }
    }

    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public IEnumerable<string> Errors { get; set; } = Array.Empty<string>();
    }
}