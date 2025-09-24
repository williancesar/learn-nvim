/*
 * Day 03: Word Motion Practice
 *
 * Word Movement Instructions:
 * 1. Use 'w' to move forward by words
 * 2. Use 'b' to move backward by words
 * 3. Use 'e' to move to end of words
 * 4. Try 'W', 'B', 'E' for WORD movement (ignores punctuation)
 * 5. Practice on mixed naming conventions below
 * 6. Use 'f' and 'F' to find specific characters
 * 7. Try 't' and 'T' to move till characters
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace NvimPractice.Day03.WordMotion;

// Practice word movement through PascalCase, camelCase, and snake_case
public class user_authentication_service
{
    private readonly IPasswordHasher password_hasher;
    private readonly IJwtTokenGenerator jwt_token_generator;
    private readonly IUserRepository user_repository;

    // Practice 'w' and 'b' through these mixed naming conventions
    public user_authentication_service(
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator,
        IUserRepository userRepository)
    {
        password_hasher = passwordHasher ?? throw new ArgumentNullException(nameof(passwordHasher));
        jwt_token_generator = jwtTokenGenerator ?? throw new ArgumentNullException(nameof(jwtTokenGenerator));
        user_repository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
    }

    // Word motion practice: Navigate through method names and parameters
    public async Task<AuthenticationResult> authenticate_user_async(string email_address, string plain_text_password)
    {
        if (string.IsNullOrWhiteSpace(email_address) || string.IsNullOrWhiteSpace(plain_text_password))
        {
            return AuthenticationResult.create_failure("Invalid credentials provided");
        }

        var existing_user = await user_repository.get_user_by_email_async(email_address);
        if (existing_user == null)
        {
            return AuthenticationResult.create_failure("User account not found");
        }

        var password_verification_result = password_hasher.verify_password(plain_text_password, existing_user.hashed_password);
        if (!password_verification_result)
        {
            return AuthenticationResult.create_failure("Invalid password provided");
        }

        var jwt_access_token = jwt_token_generator.generate_access_token(existing_user);
        var jwt_refresh_token = jwt_token_generator.generate_refresh_token(existing_user);

        return AuthenticationResult.create_success(jwt_access_token, jwt_refresh_token, existing_user);
    }

    // Practice 'e' to move to end of words in this method
    public async Task<user_registration_result> register_new_user_async(UserRegistrationRequest registration_request)
    {
        var validation_errors = validate_registration_request(registration_request);
        if (validation_errors.Any())
        {
            return user_registration_result.create_with_validation_errors(validation_errors);
        }

        var existing_user_check = await user_repository.get_user_by_email_async(registration_request.email_address);
        if (existing_user_check != null)
        {
            return user_registration_result.create_failure("Email address already registered");
        }

        var hashed_password_result = password_hasher.hash_password(registration_request.plain_text_password);
        var new_user_entity = create_user_from_registration(registration_request, hashed_password_result);

        await user_repository.save_user_async(new_user_entity);
        return user_registration_result.create_success(new_user_entity);
    }

    // Try 'f' and 'F' to find underscores and dots in this method
    private IEnumerable<string> validate_registration_request(UserRegistrationRequest request)
    {
        var validation_errors = new List<string>();

        if (string.IsNullOrWhiteSpace(request.first_name))
            validation_errors.Add("first_name.is_required");

        if (string.IsNullOrWhiteSpace(request.last_name))
            validation_errors.Add("last_name.is_required");

        if (string.IsNullOrWhiteSpace(request.email_address))
            validation_errors.Add("email_address.is_required");
        else if (!is_valid_email_format(request.email_address))
            validation_errors.Add("email_address.invalid_format");

        if (string.IsNullOrWhiteSpace(request.plain_text_password))
            validation_errors.Add("password.is_required");
        else if (!is_strong_password(request.plain_text_password))
            validation_errors.Add("password.insufficient_strength");

        return validation_errors;
    }

    // Practice 't' and 'T' to move till parentheses and dots
    private bool is_valid_email_format(string email_address)
    {
        return email_address.Contains('@') &&
               email_address.Contains('.') &&
               email_address.Length >= 5;
    }

    private bool is_strong_password(string password)
    {
        return password.Length >= 8 &&
               password.Any(char.IsUpper) &&
               password.Any(char.IsLower) &&
               password.Any(char.IsDigit) &&
               password.Any(c => "!@#$%^&*()_+-=[]{}|;:,.<>?".Contains(c));
    }

    private UserEntity create_user_from_registration(UserRegistrationRequest request, string hashed_password)
    {
        return new UserEntity
        {
            user_id = Guid.NewGuid(),
            first_name = request.first_name,
            last_name = request.last_name,
            email_address = request.email_address,
            hashed_password = hashed_password,
            created_at_utc = DateTime.UtcNow,
            is_email_verified = false,
            account_status = UserAccountStatus.active
        };
    }
}

// Mixed naming conventions for word motion practice
public record UserRegistrationRequest(
    [property: JsonPropertyName("first_name")] string first_name,
    [property: JsonPropertyName("last_name")] string last_name,
    [property: JsonPropertyName("email_address")] string email_address,
    [property: JsonPropertyName("password")] string plain_text_password,
    [property: JsonPropertyName("confirm_password")] string confirm_password,
    [property: JsonPropertyName("date_of_birth")] DateTime? date_of_birth = null,
    [property: JsonPropertyName("phone_number")] string? phone_number = null
);

// Practice navigating through enum values with different naming styles
public enum UserAccountStatus
{
    active,
    inactive,
    suspended,
    email_verification_pending,
    password_reset_required,
    account_locked,
    permanently_deleted
}

// Word motion through complex property names
public class UserEntity
{
    [Key]
    public Guid user_id { get; init; }

    [Required]
    [MaxLength(100)]
    public string first_name { get; init; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string last_name { get; init; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string email_address { get; init; } = string.Empty;

    [Required]
    public string hashed_password { get; init; } = string.Empty;

    public DateTime created_at_utc { get; init; }
    public DateTime? last_login_at_utc { get; set; }
    public DateTime? email_verified_at_utc { get; set; }
    public DateTime? password_changed_at_utc { get; set; }

    public bool is_email_verified { get; set; }
    public UserAccountStatus account_status { get; set; }

    [MaxLength(500)]
    public string? profile_bio_text { get; set; }

    [Url]
    public string? profile_image_url { get; set; }

    [Phone]
    public string? phone_number { get; set; }

    public bool is_phone_verified { get; set; }
    public bool two_factor_auth_enabled { get; set; }

    // Practice word motion through computed properties
    public string full_display_name => $"{first_name} {last_name}";
    public bool requires_password_change => password_changed_at_utc == null ||
                                           password_changed_at_utc < DateTime.UtcNow.AddMonths(-6);
    public bool is_account_active => account_status == UserAccountStatus.active &&
                                    is_email_verified;
}

// Complex naming for advanced word motion practice
public record AuthenticationResult
{
    public bool was_authentication_successful { get; init; }
    public string? jwt_access_token { get; init; }
    public string? jwt_refresh_token { get; init; }
    public UserEntity? authenticated_user { get; init; }
    public string? failure_reason_message { get; init; }
    public DateTime token_expiration_time { get; init; }

    public static AuthenticationResult create_success(string access_token, string refresh_token, UserEntity user)
    {
        return new AuthenticationResult
        {
            was_authentication_successful = true,
            jwt_access_token = access_token,
            jwt_refresh_token = refresh_token,
            authenticated_user = user,
            token_expiration_time = DateTime.UtcNow.AddMinutes(30)
        };
    }

    public static AuthenticationResult create_failure(string reason)
    {
        return new AuthenticationResult
        {
            was_authentication_successful = false,
            failure_reason_message = reason
        };
    }
}

// Practice navigating through mixed camelCase and snake_case
public record user_registration_result
{
    public bool registration_was_successful { get; init; }
    public UserEntity? newly_created_user { get; init; }
    public IEnumerable<string> validation_error_messages { get; init; } = [];
    public string? general_failure_message { get; init; }

    public static user_registration_result create_success(UserEntity user)
    {
        return new user_registration_result
        {
            registration_was_successful = true,
            newly_created_user = user
        };
    }

    public static user_registration_result create_failure(string message)
    {
        return new user_registration_result
        {
            registration_was_successful = false,
            general_failure_message = message
        };
    }

    public static user_registration_result create_with_validation_errors(IEnumerable<string> errors)
    {
        return new user_registration_result
        {
            registration_was_successful = false,
            validation_error_messages = errors
        };
    }
}

// Interface definitions for dependency injection practice
public interface IPasswordHasher
{
    string hash_password(string plain_text_password);
    bool verify_password(string plain_text_password, string hashed_password);
}

public interface IJwtTokenGenerator
{
    string generate_access_token(UserEntity user);
    string generate_refresh_token(UserEntity user);
    bool validate_token(string jwt_token);
}

public interface IUserRepository
{
    Task<UserEntity?> get_user_by_email_async(string email_address);
    Task<UserEntity?> get_user_by_id_async(Guid user_id);
    Task save_user_async(UserEntity user);
    Task update_user_async(UserEntity user);
    Task delete_user_async(Guid user_id);
}

// Practice word motion through these complex static utility methods
public static class password_strength_validator
{
    private static readonly string[] common_weak_passwords =
    {
        "password", "123456", "password123", "admin", "letmein",
        "welcome", "monkey", "dragon", "qwerty", "abc123"
    };

    public static bool is_password_in_common_weak_list(string password)
    {
        return common_weak_passwords.Contains(password.ToLower());
    }

    public static double calculate_password_entropy_score(string password)
    {
        var character_set_size = 0;
        if (password.Any(char.IsLower)) character_set_size += 26;
        if (password.Any(char.IsUpper)) character_set_size += 26;
        if (password.Any(char.IsDigit)) character_set_size += 10;
        if (password.Any(c => "!@#$%^&*()".Contains(c))) character_set_size += 10;

        return password.Length * Math.Log2(character_set_size);
    }
}