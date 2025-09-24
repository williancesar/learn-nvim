using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace SearchPatternPractice
{
    /// <summary>
    /// Practice file for search patterns and naming conventions:
    /// Practice searching for: /, ?, *, #, n, N
    /// Search for: class names, method names, variable patterns
    /// Practice: /UserService, /Get.*Async, /private.*_field, etc.
    /// </summary>
    public class UserAccountManager
    {
        private readonly IUserAccountRepository _userAccountRepository;
        private readonly IPasswordValidator _passwordValidator;
        private readonly IEmailValidator _emailValidator;
        private readonly IAuthenticationService _authenticationService;
        private readonly IUserNotificationService _userNotificationService;
        private readonly IAccountSecurityService _accountSecurityService;
        private readonly IUserProfileService _userProfileService;

        public UserAccountManager(
            IUserAccountRepository userAccountRepository,
            IPasswordValidator passwordValidator,
            IEmailValidator emailValidator,
            IAuthenticationService authenticationService,
            IUserNotificationService userNotificationService,
            IAccountSecurityService accountSecurityService,
            IUserProfileService userProfileService)
        {
            _userAccountRepository = userAccountRepository;
            _passwordValidator = passwordValidator;
            _emailValidator = emailValidator;
            _authenticationService = authenticationService;
            _userNotificationService = userNotificationService;
            _accountSecurityService = accountSecurityService;
            _userProfileService = userProfileService;
        }

        public async Task<CreateAccountResult> CreateUserAccountAsync(CreateAccountRequest request)
        {
            var validationResult = await ValidateCreateAccountRequestAsync(request);
            if (!validationResult.IsValid)
            {
                return CreateAccountResult.Failed(validationResult.ErrorMessage);
            }

            var existingUser = await _userAccountRepository.GetUserByEmailAsync(request.EmailAddress);
            if (existingUser != null)
            {
                return CreateAccountResult.Failed("User account already exists");
            }

            var hashedPassword = await _passwordValidator.HashPasswordAsync(request.Password);
            var userAccount = new UserAccount
            {
                UserId = Guid.NewGuid(),
                EmailAddress = request.EmailAddress,
                PasswordHash = hashedPassword,
                FirstName = request.FirstName,
                LastName = request.LastName,
                PhoneNumber = request.PhoneNumber,
                DateOfBirth = request.DateOfBirth,
                AccountStatus = AccountStatus.Active,
                CreatedDateTime = DateTime.UtcNow,
                LastModifiedDateTime = DateTime.UtcNow,
                EmailVerified = false,
                PhoneVerified = false,
                TwoFactorEnabled = false
            };

            var createdAccount = await _userAccountRepository.CreateUserAccountAsync(userAccount);
            await _userNotificationService.SendWelcomeEmailAsync(createdAccount);
            await _userNotificationService.SendEmailVerificationAsync(createdAccount);

            return CreateAccountResult.Success(createdAccount);
        }

        public async Task<AuthenticationResult> AuthenticateUserAsync(AuthenticationRequest request)
        {
            var userAccount = await _userAccountRepository.GetUserByEmailAsync(request.EmailAddress);
            if (userAccount == null)
            {
                return AuthenticationResult.Failed("Invalid credentials");
            }

            if (userAccount.AccountStatus != AccountStatus.Active)
            {
                return AuthenticationResult.Failed("Account is not active");
            }

            var passwordValid = await _passwordValidator.VerifyPasswordAsync(request.Password, userAccount.PasswordHash);
            if (!passwordValid)
            {
                await _accountSecurityService.RecordFailedLoginAttemptAsync(userAccount.UserId);
                return AuthenticationResult.Failed("Invalid credentials");
            }

            if (userAccount.TwoFactorEnabled)
            {
                var twoFactorResult = await _authenticationService.ValidateTwoFactorCodeAsync(userAccount.UserId, request.TwoFactorCode);
                if (!twoFactorResult.IsValid)
                {
                    return AuthenticationResult.Failed("Invalid two-factor authentication code");
                }
            }

            var authToken = await _authenticationService.GenerateAuthTokenAsync(userAccount);
            await _accountSecurityService.RecordSuccessfulLoginAsync(userAccount.UserId);

            userAccount.LastLoginDateTime = DateTime.UtcNow;
            await _userAccountRepository.UpdateUserAccountAsync(userAccount);

            return AuthenticationResult.Success(authToken);
        }

        public async Task<PasswordChangeResult> ChangeUserPasswordAsync(ChangePasswordRequest request)
        {
            var userAccount = await _userAccountRepository.GetUserByIdAsync(request.UserId);
            if (userAccount == null)
            {
                return PasswordChangeResult.Failed("User account not found");
            }

            var currentPasswordValid = await _passwordValidator.VerifyPasswordAsync(request.CurrentPassword, userAccount.PasswordHash);
            if (!currentPasswordValid)
            {
                return PasswordChangeResult.Failed("Current password is incorrect");
            }

            var passwordValidation = await _passwordValidator.ValidatePasswordStrengthAsync(request.NewPassword);
            if (!passwordValidation.IsValid)
            {
                return PasswordChangeResult.Failed(passwordValidation.ErrorMessage);
            }

            var newPasswordHash = await _passwordValidator.HashPasswordAsync(request.NewPassword);
            userAccount.PasswordHash = newPasswordHash;
            userAccount.LastPasswordChangeDateTime = DateTime.UtcNow;
            userAccount.LastModifiedDateTime = DateTime.UtcNow;

            await _userAccountRepository.UpdateUserAccountAsync(userAccount);
            await _userNotificationService.SendPasswordChangeConfirmationAsync(userAccount);
            await _accountSecurityService.RecordPasswordChangeAsync(userAccount.UserId);

            return PasswordChangeResult.Success();
        }

        public async Task<EmailVerificationResult> VerifyUserEmailAsync(EmailVerificationRequest request)
        {
            var userAccount = await _userAccountRepository.GetUserByIdAsync(request.UserId);
            if (userAccount == null)
            {
                return EmailVerificationResult.Failed("User account not found");
            }

            var verificationResult = await _emailValidator.VerifyEmailTokenAsync(request.VerificationToken);
            if (!verificationResult.IsValid)
            {
                return EmailVerificationResult.Failed("Invalid verification token");
            }

            userAccount.EmailVerified = true;
            userAccount.EmailVerifiedDateTime = DateTime.UtcNow;
            userAccount.LastModifiedDateTime = DateTime.UtcNow;

            await _userAccountRepository.UpdateUserAccountAsync(userAccount);
            await _userNotificationService.SendEmailVerificationSuccessAsync(userAccount);

            return EmailVerificationResult.Success();
        }

        public async Task<ProfileUpdateResult> UpdateUserProfileAsync(ProfileUpdateRequest request)
        {
            var userAccount = await _userAccountRepository.GetUserByIdAsync(request.UserId);
            if (userAccount == null)
            {
                return ProfileUpdateResult.Failed("User account not found");
            }

            var validationResult = await ValidateProfileUpdateRequestAsync(request);
            if (!validationResult.IsValid)
            {
                return ProfileUpdateResult.Failed(validationResult.ErrorMessage);
            }

            if (!string.IsNullOrEmpty(request.FirstName))
                userAccount.FirstName = request.FirstName;

            if (!string.IsNullOrEmpty(request.LastName))
                userAccount.LastName = request.LastName;

            if (!string.IsNullOrEmpty(request.PhoneNumber))
                userAccount.PhoneNumber = request.PhoneNumber;

            if (request.DateOfBirth.HasValue)
                userAccount.DateOfBirth = request.DateOfBirth.Value;

            userAccount.LastModifiedDateTime = DateTime.UtcNow;

            await _userAccountRepository.UpdateUserAccountAsync(userAccount);
            await _userProfileService.UpdateUserProfileAsync(userAccount);

            return ProfileUpdateResult.Success(userAccount);
        }

        public async Task<SecuritySettingsResult> UpdateSecuritySettingsAsync(SecuritySettingsRequest request)
        {
            var userAccount = await _userAccountRepository.GetUserByIdAsync(request.UserId);
            if (userAccount == null)
            {
                return SecuritySettingsResult.Failed("User account not found");
            }

            if (request.EnableTwoFactor.HasValue)
            {
                userAccount.TwoFactorEnabled = request.EnableTwoFactor.Value;
                if (request.EnableTwoFactor.Value)
                {
                    var setupResult = await _accountSecurityService.SetupTwoFactorAuthenticationAsync(userAccount.UserId);
                    if (!setupResult.IsSuccessful)
                    {
                        return SecuritySettingsResult.Failed("Failed to setup two-factor authentication");
                    }
                }
            }

            if (request.UpdateSecurityQuestions && request.SecurityQuestions != null)
            {
                await _accountSecurityService.UpdateSecurityQuestionsAsync(userAccount.UserId, request.SecurityQuestions);
            }

            userAccount.LastModifiedDateTime = DateTime.UtcNow;
            await _userAccountRepository.UpdateUserAccountAsync(userAccount);

            return SecuritySettingsResult.Success();
        }

        public async Task<AccountDeactivationResult> DeactivateUserAccountAsync(AccountDeactivationRequest request)
        {
            var userAccount = await _userAccountRepository.GetUserByIdAsync(request.UserId);
            if (userAccount == null)
            {
                return AccountDeactivationResult.Failed("User account not found");
            }

            userAccount.AccountStatus = AccountStatus.Inactive;
            userAccount.DeactivatedDateTime = DateTime.UtcNow;
            userAccount.DeactivationReason = request.Reason;
            userAccount.LastModifiedDateTime = DateTime.UtcNow;

            await _userAccountRepository.UpdateUserAccountAsync(userAccount);
            await _authenticationService.RevokeAllUserTokensAsync(userAccount.UserId);
            await _userNotificationService.SendAccountDeactivationNotificationAsync(userAccount);

            return AccountDeactivationResult.Success();
        }

        public async Task<AccountReactivationResult> ReactivateUserAccountAsync(AccountReactivationRequest request)
        {
            var userAccount = await _userAccountRepository.GetUserByIdAsync(request.UserId);
            if (userAccount == null)
            {
                return AccountReactivationResult.Failed("User account not found");
            }

            if (userAccount.AccountStatus != AccountStatus.Inactive)
            {
                return AccountReactivationResult.Failed("Account is not in inactive status");
            }

            userAccount.AccountStatus = AccountStatus.Active;
            userAccount.ReactivatedDateTime = DateTime.UtcNow;
            userAccount.DeactivatedDateTime = null;
            userAccount.DeactivationReason = null;
            userAccount.LastModifiedDateTime = DateTime.UtcNow;

            await _userAccountRepository.UpdateUserAccountAsync(userAccount);
            await _userNotificationService.SendAccountReactivationNotificationAsync(userAccount);

            return AccountReactivationResult.Success();
        }

        private async Task<ValidationResult> ValidateCreateAccountRequestAsync(CreateAccountRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.EmailAddress))
                return ValidationResult.Failed("Email address is required");

            if (!await _emailValidator.IsValidEmailFormatAsync(request.EmailAddress))
                return ValidationResult.Failed("Invalid email address format");

            if (string.IsNullOrWhiteSpace(request.Password))
                return ValidationResult.Failed("Password is required");

            var passwordValidation = await _passwordValidator.ValidatePasswordStrengthAsync(request.Password);
            if (!passwordValidation.IsValid)
                return ValidationResult.Failed(passwordValidation.ErrorMessage);

            if (string.IsNullOrWhiteSpace(request.FirstName))
                return ValidationResult.Failed("First name is required");

            if (string.IsNullOrWhiteSpace(request.LastName))
                return ValidationResult.Failed("Last name is required");

            return ValidationResult.Success();
        }

        private async Task<ValidationResult> ValidateProfileUpdateRequestAsync(ProfileUpdateRequest request)
        {
            if (!string.IsNullOrEmpty(request.FirstName) && request.FirstName.Length > 50)
                return ValidationResult.Failed("First name cannot exceed 50 characters");

            if (!string.IsNullOrEmpty(request.LastName) && request.LastName.Length > 50)
                return ValidationResult.Failed("Last name cannot exceed 50 characters");

            if (!string.IsNullOrEmpty(request.PhoneNumber))
            {
                var phoneValidation = await ValidatePhoneNumberAsync(request.PhoneNumber);
                if (!phoneValidation.IsValid)
                    return ValidationResult.Failed(phoneValidation.ErrorMessage);
            }

            return ValidationResult.Success();
        }

        private async Task<ValidationResult> ValidatePhoneNumberAsync(string phoneNumber)
        {
            var phonePattern = @"^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$";
            if (!Regex.IsMatch(phoneNumber, phonePattern))
                return ValidationResult.Failed("Invalid phone number format");

            return ValidationResult.Success();
        }
    }

    // Data models with searchable naming patterns
    public class UserAccount
    {
        public Guid UserId { get; set; }
        public string EmailAddress { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
        public AccountStatus AccountStatus { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public DateTime LastModifiedDateTime { get; set; }
        public DateTime? LastLoginDateTime { get; set; }
        public DateTime? LastPasswordChangeDateTime { get; set; }
        public bool EmailVerified { get; set; }
        public DateTime? EmailVerifiedDateTime { get; set; }
        public bool PhoneVerified { get; set; }
        public DateTime? PhoneVerifiedDateTime { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public DateTime? DeactivatedDateTime { get; set; }
        public string? DeactivationReason { get; set; }
        public DateTime? ReactivatedDateTime { get; set; }
    }

    public enum AccountStatus
    {
        Active,
        Inactive,
        Suspended,
        Locked
    }

    // Request models with searchable patterns
    public class CreateAccountRequest
    {
        public string EmailAddress { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
    }

    public class AuthenticationRequest
    {
        public string EmailAddress { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? TwoFactorCode { get; set; }
    }

    public class ChangePasswordRequest
    {
        public Guid UserId { get; set; }
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    public class EmailVerificationRequest
    {
        public Guid UserId { get; set; }
        public string VerificationToken { get; set; } = string.Empty;
    }

    public class ProfileUpdateRequest
    {
        public Guid UserId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
    }

    public class SecuritySettingsRequest
    {
        public Guid UserId { get; set; }
        public bool? EnableTwoFactor { get; set; }
        public bool UpdateSecurityQuestions { get; set; }
        public List<SecurityQuestion>? SecurityQuestions { get; set; }
    }

    public class SecurityQuestion
    {
        public string Question { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
    }

    public class AccountDeactivationRequest
    {
        public Guid UserId { get; set; }
        public string Reason { get; set; } = string.Empty;
    }

    public class AccountReactivationRequest
    {
        public Guid UserId { get; set; }
    }

    // Result models with searchable patterns
    public class CreateAccountResult
    {
        public bool IsSuccessful { get; set; }
        public UserAccount? UserAccount { get; set; }
        public string? ErrorMessage { get; set; }

        public static CreateAccountResult Success(UserAccount account) => new() { IsSuccessful = true, UserAccount = account };
        public static CreateAccountResult Failed(string error) => new() { IsSuccessful = false, ErrorMessage = error };
    }

    public class AuthenticationResult
    {
        public bool IsSuccessful { get; set; }
        public string? AuthToken { get; set; }
        public string? ErrorMessage { get; set; }

        public static AuthenticationResult Success(string token) => new() { IsSuccessful = true, AuthToken = token };
        public static AuthenticationResult Failed(string error) => new() { IsSuccessful = false, ErrorMessage = error };
    }

    public class PasswordChangeResult
    {
        public bool IsSuccessful { get; set; }
        public string? ErrorMessage { get; set; }

        public static PasswordChangeResult Success() => new() { IsSuccessful = true };
        public static PasswordChangeResult Failed(string error) => new() { IsSuccessful = false, ErrorMessage = error };
    }

    public class EmailVerificationResult
    {
        public bool IsSuccessful { get; set; }
        public string? ErrorMessage { get; set; }

        public static EmailVerificationResult Success() => new() { IsSuccessful = true };
        public static EmailVerificationResult Failed(string error) => new() { IsSuccessful = false, ErrorMessage = error };
    }

    public class ProfileUpdateResult
    {
        public bool IsSuccessful { get; set; }
        public UserAccount? UserAccount { get; set; }
        public string? ErrorMessage { get; set; }

        public static ProfileUpdateResult Success(UserAccount account) => new() { IsSuccessful = true, UserAccount = account };
        public static ProfileUpdateResult Failed(string error) => new() { IsSuccessful = false, ErrorMessage = error };
    }

    public class SecuritySettingsResult
    {
        public bool IsSuccessful { get; set; }
        public string? ErrorMessage { get; set; }

        public static SecuritySettingsResult Success() => new() { IsSuccessful = true };
        public static SecuritySettingsResult Failed(string error) => new() { IsSuccessful = false, ErrorMessage = error };
    }

    public class AccountDeactivationResult
    {
        public bool IsSuccessful { get; set; }
        public string? ErrorMessage { get; set; }

        public static AccountDeactivationResult Success() => new() { IsSuccessful = true };
        public static AccountDeactivationResult Failed(string error) => new() { IsSuccessful = false, ErrorMessage = error };
    }

    public class AccountReactivationResult
    {
        public bool IsSuccessful { get; set; }
        public string? ErrorMessage { get; set; }

        public static AccountReactivationResult Success() => new() { IsSuccessful = true };
        public static AccountReactivationResult Failed(string error) => new() { IsSuccessful = false, ErrorMessage = error };
    }

    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public string? ErrorMessage { get; set; }

        public static ValidationResult Success() => new() { IsValid = true };
        public static ValidationResult Failed(string error) => new() { IsValid = false, ErrorMessage = error };
    }

    // Service interfaces with searchable patterns
    public interface IUserAccountRepository
    {
        Task<UserAccount> CreateUserAccountAsync(UserAccount userAccount);
        Task<UserAccount?> GetUserByIdAsync(Guid userId);
        Task<UserAccount?> GetUserByEmailAsync(string emailAddress);
        Task<UserAccount> UpdateUserAccountAsync(UserAccount userAccount);
        Task<IEnumerable<UserAccount>> SearchUserAccountsAsync(string searchTerm);
    }

    public interface IPasswordValidator
    {
        Task<string> HashPasswordAsync(string password);
        Task<bool> VerifyPasswordAsync(string password, string hash);
        Task<ValidationResult> ValidatePasswordStrengthAsync(string password);
    }

    public interface IEmailValidator
    {
        Task<bool> IsValidEmailFormatAsync(string emailAddress);
        Task<ValidationResult> VerifyEmailTokenAsync(string token);
    }

    public interface IAuthenticationService
    {
        Task<string> GenerateAuthTokenAsync(UserAccount userAccount);
        Task<ValidationResult> ValidateTwoFactorCodeAsync(Guid userId, string? code);
        Task RevokeAllUserTokensAsync(Guid userId);
    }

    public interface IUserNotificationService
    {
        Task SendWelcomeEmailAsync(UserAccount userAccount);
        Task SendEmailVerificationAsync(UserAccount userAccount);
        Task SendPasswordChangeConfirmationAsync(UserAccount userAccount);
        Task SendEmailVerificationSuccessAsync(UserAccount userAccount);
        Task SendAccountDeactivationNotificationAsync(UserAccount userAccount);
        Task SendAccountReactivationNotificationAsync(UserAccount userAccount);
    }

    public interface IAccountSecurityService
    {
        Task RecordFailedLoginAttemptAsync(Guid userId);
        Task RecordSuccessfulLoginAsync(Guid userId);
        Task RecordPasswordChangeAsync(Guid userId);
        Task<SecuritySetupResult> SetupTwoFactorAuthenticationAsync(Guid userId);
        Task UpdateSecurityQuestionsAsync(Guid userId, List<SecurityQuestion> questions);
    }

    public interface IUserProfileService
    {
        Task UpdateUserProfileAsync(UserAccount userAccount);
    }

    public class SecuritySetupResult
    {
        public bool IsSuccessful { get; set; }
        public string? ErrorMessage { get; set; }
    }
}